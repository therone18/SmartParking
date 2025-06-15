from django.db import models
from django.contrib.auth.models import User
import uuid

class ParkingLocation(models.Model):
    """
    A physical location that contains multiple parking slots.
    """
    name = models.CharField(max_length=100)
    address = models.TextField()
    slots = models.PositiveSmallIntegerField()
    google_maps_url = models.URLField(blank=True, null=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)

    def __str__(self):
        return self.name

    @property
    def slot_ids(self):
        return list(self.parkingslot_set.values_list('slot_id', flat=True))


class ParkingSlot(models.Model):
    """
    Represents an individual parking slot within a location.
    """
    location = models.ForeignKey(ParkingLocation, on_delete=models.CASCADE)
    slot_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    floorzone_number = models.CharField(max_length=10, blank=True, null=True)
    is_available = models.BooleanField(default=True)
    locked = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.location.name} - {self.slot_id}"


class Reservation(models.Model):
    """
    Stores user reservations for specific parking slots.
    """
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Processing', 'Processing'),
        ('Reserved', 'Reserved'),
        ('Active', 'Active'),
        ('Overdue', 'Overdue'),
        ('Checked-out', 'Checked-out'),
        ('Cancelled', 'Cancelled'),
        ('Complete', 'Complete'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    slot = models.ForeignKey(ParkingSlot, on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    last_park_in = models.DateTimeField(blank=True, null=True)
    last_park_out = models.DateTimeField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    receipt = models.ImageField(upload_to='receipts/', blank=True, null=True)

    # Required vehicle information
    vehicle_make = models.CharField(max_length=50)
    vehicle_model = models.CharField(max_length=50)
    plate_number = models.CharField(max_length=20, unique=True)
    vehicle_type = models.CharField(max_length=20)

    def __str__(self):
        return f"Reservation #{self.id} ({self.status})"
