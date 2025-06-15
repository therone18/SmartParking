from rest_framework import serializers, generics, status, permissions
from django.contrib.auth.models import User
from core.models import ParkingLocation, ParkingSlot, Reservation
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

class RegisterSerializer(serializers.ModelSerializer):
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
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class ParkingLocationSerializer(serializers.ModelSerializer):
    slot_ids = serializers.ReadOnlyField()

    class Meta:
        model = ParkingLocation
        fields = ['id', 'name', 'address', 'google_maps_url', 'latitude', 'longitude', 'slot_ids']

        
class ParkingSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParkingSlot
        fields = ['id', 'location', 'floorzone_number', 'is_available', 'locked']
        read_only_fields = ['slot_id']
        location = serializers.CharField(required=True)
        slot_id = serializers.CharField(required=True)
        floorzone_number = serializers.CharField(required=True)
        
class ParkingLocationWithSlotsSerializer(serializers.ModelSerializer):
    slots = ParkingSlotSerializer(many=True, source='parkingslot_set')

    class Meta:
        model = ParkingLocation
        fields = ['id', 'name', 'address', 'google_maps_url', 'slots']
        
class SlotUtilizationSerializer(serializers.Serializer):
    location_id = serializers.IntegerField()
    location_name = serializers.CharField()
    date = serializers.DateField()
    total_slots = serializers.IntegerField()
    reservations = serializers.IntegerField()
    utilization_rate = serializers.FloatField()  # As a decimal (e.g. 0.75 for 75%)

class ParkingLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParkingLocation
        fields = [
            'id', 'name', 'address', 
        ]
        
class ParkingLocationUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ParkingLocation.objects.all()
    serializer_class = ParkingLocationSerializer
    permission_classes = [permissions.IsAdminUser]

    def destroy(self, request, *args, **kwargs):
        location = self.get_object()
        slots = location.parkingslot_set.all()

        # Check if any slot has a reservation
        for slot in slots:
            if Reservation.objects.filter(slot=slot).exists():
                return Response(
                    {"error": "Cannot delete location: some slots have reservations."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # Check if any slots still exist
        if slots.exists():
            return Response(
                {"error": "Cannot delete location: it still has parking slots."},
                status=status.HTTP_400_BAD_REQUEST
            )

        return super().destroy(request, *args, **kwargs)
        

class ReservationSerializer(serializers.ModelSerializer):
    location = serializers.SerializerMethodField()
    
    slot = serializers.PrimaryKeyRelatedField(queryset=ParkingSlot.objects.all(), required=True)
    start_time = serializers.DateTimeField(required=True)
    end_time = serializers.DateTimeField(required=True)
    vehicle_make = serializers.CharField(required=True)
    vehicle_model = serializers.CharField(required=True)
    plate_number = serializers.CharField(required=True)
    vehicle_type = serializers.CharField(required=True)

    class Meta:
        model = Reservation
        fields = [
            'id', 'slot', 'start_time', 'end_time', 'location', 'vehicle_make',
            'vehicle_model', 'plate_number', 'vehicle_type', 'status', 'receipt'
        ]

    def validate(self, data):
        slot = data.get('slot')
        if slot and not slot.is_available:
            raise serializers.ValidationError("Selected slot is not available.")
        return data
    
    def get_location(self, obj):
        location = obj.slot.location if obj.slot else None
        if location:
            return ParkingLocationSerializer(location).data
        return None


