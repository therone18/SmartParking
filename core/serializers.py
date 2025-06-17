from rest_framework import serializers, generics, status, permissions
from django.contrib.auth.models import User
from core.models import ParkingLocation, ParkingSlot, Reservation
from rest_framework.response import Response

# ------------------------------
# Auth / User Serializers
# ------------------------------

class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration. Creates a new user with hashed password.
    """
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password')

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )

class UserSerializer(serializers.ModelSerializer):
    """
    Basic serializer for returning user profile data.
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        
        
# ------------------------------
# Parking Slot Serializers
# ------------------------------

class ParkingSlotSerializer(serializers.ModelSerializer):
    """
    Serializer for individual parking slots.
    Used in admin panel and slot listings.
    """
    class Meta:
        model = ParkingSlot
        fields = ['id', 'location', 'slot_id', 'floorzone_number', 'is_available', 'locked']
        read_only_fields = ['id', 'slot_id']
        

# ------------------------------
# Parking Location Serializers
# ------------------------------

class ParkingLocationSerializer(serializers.ModelSerializer):
    """
    Basic parking location serializer.
    Includes the total number of slots and optional Google Maps info.
    """
    slot_ids = serializers.ReadOnlyField()

    class Meta:
        model = ParkingLocation
        fields = ['id', 'name', 'address', 'google_maps_url', 'latitude', 'longitude', 'slot_ids', 'slots']

class ParkingLocationShortSerializer(serializers.ModelSerializer):
    """
    Short version of ParkingLocation used in nested representations (e.g. reservations).
    """
    class Meta:
        model = ParkingLocation
        fields = ['id', 'name', 'address', 'google_maps_url', 'latitude', 'longitude']

class ParkingLocationWithSlotsSerializer(serializers.ModelSerializer):
    """
    Parking location with full nested slots.
    Used for admin display or map views.
    """
    slots = ParkingSlotSerializer(many=True, source='parkingslot_set', read_only=True)

    class Meta:
        model = ParkingLocation
        fields = [
            'id',
            'name',
            'address',
            'slots',
            'google_maps_url',
            'latitude',
            'longitude'
        ]


# ------------------------------
# Reservation Serializers
# ------------------------------

class ReservationSerializer(serializers.ModelSerializer):
    """
    Full reservation serializer used for creating or retrieving detailed reservation records.
    """
    slot = serializers.PrimaryKeyRelatedField(queryset=ParkingSlot.objects.all(), required=True)

    class Meta:
        model = Reservation
        fields = [
            'id',
            'slot',
            'start_time',
            'end_time',
            'last_park_in',
            'last_park_out',
            'status',
            'receipt',
            'vehicle_make',
            'vehicle_model',
            'plate_number',
            'vehicle_type',
            'created_at'
        ]
        read_only_fields = ['status', 'last_park_in', 'last_park_out', 'receipt', 'created_at']

    def validate(self, data):
        """
        Ensure slot is available before allowing reservation.
        """
        slot = data.get('slot')
        if slot and not slot.is_available:
            raise serializers.ValidationError("Selected slot is not available.")
        return data

class ReservationListSerializer(serializers.ModelSerializer):
    """
    List-style reservation serializer for user dashboard.
    Includes human-readable slot ID and location info.
    """
    slot_id = serializers.CharField(source='slot.slot_id', read_only=True)
    location = serializers.SerializerMethodField()

    class Meta:
        model = Reservation
        fields = [
            'id',
            'slot',          # numeric ID
            'slot_id',       # readable string
            'start_time',
            'end_time',
            'last_park_in',
            'last_park_out',
            'status',
            'receipt',
            'vehicle_make',
            'vehicle_model',
            'plate_number',
            'vehicle_type',
            'created_at',
            'location'
        ]

    def get_location(self, obj):
        """
        Return short location data from slot relation.
        """
        if obj.slot and obj.slot.location:
            return ParkingLocationShortSerializer(obj.slot.location).data
        return None

# ------------------------------
# Analytics Serializers
# ------------------------------

class SlotUtilizationSerializer(serializers.Serializer):
    """
    Custom serializer for admin dashboard analytics.
    """
    location_id = serializers.IntegerField()
    location_name = serializers.CharField()
    date = serializers.DateField()
    total_slots = serializers.IntegerField()
    reservations = serializers.IntegerField()
    utilization_rate = serializers.FloatField()  # e.g., 0.75 for 75%

# ------------------------------
# ParkingLocation Admin View (Included Here)
# ------------------------------

class ParkingLocationUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    """
    Admin-only view for updating or deleting parking locations.
    Prevents deletion if any slot has a reservation or still exists.
    """
    queryset = ParkingLocation.objects.all()
    serializer_class = ParkingLocationSerializer
    permission_classes = [permissions.IsAdminUser]

    def destroy(self, request, *args, **kwargs):
        location = self.get_object()
        slots = location.parkingslot_set.all()

        # Cannot delete if any slot has a reservation
        for slot in slots:
            if Reservation.objects.filter(slot=slot).exists():
                return Response(
                    {"error": "Cannot delete location: some slots have reservations."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # Cannot delete if any slots still exist
        if slots.exists():
            return Response(
                {"error": "Cannot delete location: it still has parking slots."},
                status=status.HTTP_400_BAD_REQUEST
            )

        return super().destroy(request, *args, **kwargs)
