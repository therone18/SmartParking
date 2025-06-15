from django.contrib import admin
from django.utils.html import format_html
from .models import ParkingLocation, ParkingSlot, Reservation

admin.site.register(ParkingLocation)
admin.site.register(ParkingSlot)

@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ['id', 'user',  'start_time', 'end_time', 'status', 'receipt']
    readonly_fields = ['receipt_preview']  # shows preview in detail view

    def receipt_preview(self, obj):
        if obj.receipt:
            return format_html('<img src="{}" width="200" />', obj.receipt.url)
        return "No receipt uploaded"

    receipt_preview.short_description = "Receipt Preview"

