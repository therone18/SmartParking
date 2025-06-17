from django.db import models
from django.contrib.auth.models import User
import uuid

# ------------------------------
# Parking Location Model
# ------------------------------

class ParkingLocation(models.Model):
    """
    A physical parking area that holds multiple parking slots.
    """
    name = models.CharField(max_length=100)
    address = models.TextField()
    slots = models.PositiveSmallIntegerField()  # Total slot count (editable by admin)
    google_maps_url = models.URLField(blank=True, null=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)

    def __str__(self):
        return self.name

    @property
    def slot_ids(self):
        """
        Returns a list of all slot UUIDs under this location.
        """
        return list(self.parkingslot_set.values_list('slot_id', flat=True))


# ------------------------------
# Parking Slot Model
# ------------------------------

class ParkingSlot(models.Model):
    """
    Represents a unique parking slot assigned to a location.
    """
    location = models.ForeignKey(ParkingLocation, on_delete=models.CASCADE)
    slot_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)  # Human-friendly slot ID
    floorzone_number = models.CharField(max_length=10, blank=True, null=True)  # Optional Z1, L2, B1 etc.
    is_available = models.BooleanField(default=True)  # True = open for reservation
    locked = models.BooleanField(default=False)       # Admin lock overrides availability

    def __str__(self):
        return f"{self.location.name} - {self.slot_id}"


# ------------------------------
# Reservation Model
# ------------------------------

class Reservation(models.Model):
    """
    Stores user reservation details for a specific parking slot.
    """
    STATUS_CHOICES = [
        ('Pending', 'Pending'),           # Reservation created but no receipt uploaded yet
        ('Processing', 'Processing'),     # Receipt uploaded, awaiting admin approval
        ('Reserved', 'Reserved'),         # Reservation approved
        ('Active', 'Active'),             # Currently in use
        ('Overdue', 'Overdue'),           # Still parked past end_time
        ('Checked-out', 'Checked-out'),   # Manually marked as left
        ('Cancelled', 'Cancelled'),       # Cancelled by user/admin
        ('Complete', 'Complete'),         # Successfully completed
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    slot = models.ForeignKey(ParkingSlot, on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()

    # Actual parking times (for tracking real usage)
    last_park_in = models.DateTimeField(blank=True, null=True)
    last_park_out = models.DateTimeField(blank=True, null=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    receipt = models.ImageField(upload_to='receipts/', blank=True, null=True)

    # Required vehicle information
    vehicle_make = models.CharField(max_length=50)
    vehicle_model = models.CharField(max_length=50)
    plate_number = models.CharField(max_length=20, unique=True)
    vehicle_type = models.CharField(max_length=20)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Reservation #{self.id} ({self.status})"
