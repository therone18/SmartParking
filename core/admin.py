from django.contrib import admin

from django.contrib import admin
from .models import ParkingLocation, ParkingSlot, Reservation

admin.site.register(ParkingLocation)
admin.site.register(ParkingSlot)
admin.site.register(Reservation)

