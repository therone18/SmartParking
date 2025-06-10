from django.db import models
from django.contrib.auth.models import User

class ParkingLocation(models.Model):
    name = models.CharField(max_length=100)
    address = models.TextField()
    total_slots = models.PositiveIntegerField()
    google_maps_url = models.URLField(blank=True, null=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)

    def __str__(self):
        return self.name

class ParkingSlot(models.Model):
    location = models.ForeignKey(ParkingLocation, on_delete=models.CASCADE)
    slot_number = models.CharField(max_length=10)
    is_available = models.BooleanField(default=True)

class Reservation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    slot = models.ForeignKey(ParkingSlot, on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    last_park_in = models.DateTimeField(null=True, blank=True)
    last_park_out = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, default='active')
    
    #Car info
    vehicle_make = models.CharField(max_length=50, blank=True, null=True)
    vehicle_model = models.CharField(max_length=50, blank=True, null=True)
    plate_number = models.CharField(max_length=20, blank=True, null=True)
    vehicle_type = models.CharField(max_length=20, blank=True, null=True)
