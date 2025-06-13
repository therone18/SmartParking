from django.db import models
from django.contrib.auth.models import User
import uuid

class ParkingLocation(models.Model):
    name = models.CharField(max_length=100)
    address = models.TextField()
    google_maps_url = models.URLField(blank=True, null=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)

    def __str__(self):
        return self.name

    @property
    def slot_ids(self):
        return list(self.parkingslot_set.values_list('slot_id', flat=True))



class ParkingSlot(models.Model):
    location = models.ForeignKey(ParkingLocation, on_delete=models.CASCADE)
    slot_id = models.UUIDField(default=uuid.uuid4, editable=False, null=True, blank=True, unique=True)
    floorzone_number = models.CharField(max_length=10, null=True, blank=True)
    is_available = models.BooleanField(default=True)

STATUS_CHOICES = [
    ('Active', 'Active'),
    ('Reserved', 'Reserved'),
    ('Overdue', 'Overdue'),
    ('Cancelled', 'Cancelled'),
    ('Complete', 'Complete'),
]

class Reservation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    slot = models.ForeignKey(ParkingSlot, on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    last_park_in = models.DateTimeField(null=True, blank=True)
    last_park_out = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')

    # Car info (now required)
    vehicle_make = models.CharField(max_length=50)
    vehicle_model = models.CharField(max_length=50)
    plate_number = models.CharField(max_length=20, unique=True)
    vehicle_type = models.CharField(max_length=20)

