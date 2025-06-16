from rest_framework import serializers
from django.contrib.auth.models import User
from core.models import ParkingLocation, ParkingSlot, Reservation

# ------------------------------
# User-related serializers
# ------------------------------

class RegisterSerializer(serializers.ModelSerializer):
    """
    Handles user registration.
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
    Returns user profile info.
    """
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email',
            'first_name', 'last_name',
            'is_active', 'is_staff', 'is_superuser'
        ]

# ------------------------------
# Parking-related serializers
# ------------------------------

class ParkingSlotSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = ParkingSlot
        fields = ['id', 'slot_id', 'is_available', 'locked']

class ParkingLocationSerializer(serializers.ModelSerializer):
    """
    Basic serializer for parking locations.
    """
    slots = ParkingSlotSummarySerializer(source='parkingslot_set', many=True , read_only=True)

    class Meta:
        model = ParkingLocation
        fields = ['id', 'name', 'address', 'google_maps_url', 'latitude', 'longitude', 'slots']


class SimpleLocationSerializer(serializers.ModelSerializer):
    """
    A minimal serializer used for nested displays.
    """
    class Meta:
        model = ParkingLocation
        fields = ['id', 'name', 'address']


class ParkingSlotSerializer(serializers.ModelSerializer):
    """
    Serializer for individual parking slots.
    """
    class Meta:
        model = ParkingSlot
        fields = ['id', 'location', 'slot_id', 'floorzone_number', 'is_available', 'locked']
        read_only_fields = ['id']



class ParkingLocationWithSlotsSerializer(serializers.ModelSerializer):
    """
    Serializer that includes associated parking slots.
    """
    slots = ParkingSlotSerializer(many=True, source='parkingslot_set', read_only=True)

    class Meta:
        model = ParkingLocation
        fields = ['id', 'name', 'address', 'google_maps_url', 'slots']


class SlotUtilizationSerializer(serializers.Serializer):
    """
    Used to return slot utilization analytics per location.
    """
    location_id = serializers.IntegerField()
    location_name = serializers.CharField()
    date = serializers.DateField()
    total_slots = serializers.IntegerField()
    reservations = serializers.IntegerField()
    utilization_rate = serializers.FloatField()  # e.g., 0.75 for 75%

# ------------------------------
# Reservation-related serializers
# ------------------------------

class ReservationSerializer(serializers.ModelSerializer):
    """
    Handles reservation creation and display.
    """
    location = serializers.SerializerMethodField()
    user_full_name = serializers.SerializerMethodField()

    class Meta:
        model = Reservation
        fields = [
            'id', 'slot', 'start_time', 'end_time',
            'location', 'vehicle_make', 'vehicle_model',
            'plate_number', 'vehicle_type', 'status',
            'receipt', 'user_full_name'
        ]

    def validate(self, data):
        # Prevent reservation on unavailable slot
        slot = data.get('slot')
        if slot and not slot.is_available:
            raise serializers.ValidationError("Selected slot is not available.")
        return data

    def get_location(self, obj):
        # Include minimal location info for this reservation
        if obj.slot and obj.slot.location:
            return SimpleLocationSerializer(obj.slot.location).data
        return None

    def get_user_full_name(self, obj):
        if obj.user:
            return f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.username
        return "N/A"
