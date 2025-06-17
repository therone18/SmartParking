from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.utils.timezone import now, timedelta

from core.models import Reservation, ParkingLocation, ParkingSlot


class SlotUtilizationSummaryView(APIView):
    """
    Admin-only:
    Returns slot utilization statistics for each parking location over the past 7 days.
    Utilization per day = (# of reservations that day) / (total slots at that location).
    """
    permission_classes = [IsAdminUser]

    def get(self, request):
        today = now().date()
        past_days = [today - timedelta(days=i) for i in range(7)]
        data = []

        for location in ParkingLocation.objects.all():
            total_slots = ParkingSlot.objects.filter(location=location).count()

            for date in reversed(past_days):  # Oldest to newest
                day_reservations = Reservation.objects.filter(
                    slot__location=location,
                    start_time__date=date
                ).count()

                utilization = (day_reservations / total_slots) if total_slots else 0

                data.append({
                    "location_id": location.id,
                    "location_name": location.name,
                    "date": date,
                    "total_slots": total_slots,
                    "reservations": day_reservations,
                    "utilization_rate": round(utilization, 2),  # as decimal (e.g. 0.75)
                })

        return Response(data)


class OverallSlotUtilizationView(APIView):
    """
    Admin-only:
    Returns current overall slot utilization across all locations.
    Based on how many slots are currently 'Reserved' or 'Active'.
    """
    permission_classes = [IsAdminUser]

    def get(self, request):
        total_slots = ParkingSlot.objects.count()
        active_reservations = Reservation.objects.filter(
            status__in=["Reserved", "Active"]
        ).count()

        utilization_rate = (active_reservations / total_slots) if total_slots else 0

        return Response({
            "total_locations": ParkingLocation.objects.count(),
            "total_slots": total_slots,
            "active_reservations": active_reservations,
            "utilization_rate": round(utilization_rate, 2),
        })


class DailySummaryView(APIView):
    """
    Admin-only:
    Returns total number of reservations per day over the past 7 days.
    """
    permission_classes = [IsAdminUser]

    def get(self, request):
        today = now().date()
        summary = []

        for i in range(7):
            day = today - timedelta(days=i)
            count = Reservation.objects.filter(start_time__date=day).count()
            summary.append({
                "date": day,
                "total_reservations": count
            })

        return Response(summary[::-1])  # Reverse to show oldest to newest


class SlotActiveSummaryView(APIView):
    """
    Admin-only:
    Returns the count of reservations currently marked as 'Active'.
    """
    permission_classes = [IsAdminUser]

    def get(self, request):
        active_count = Reservation.objects.filter(status="Active").count()
        return Response({"active_slots": active_count})


class OverdueSlotSummaryView(APIView):
    """
    Admin-only:
    Returns the count of reservations that are currently 'Overdue'.
    """
    permission_classes = [IsAdminUser]

    def get(self, request):
        overdue_count = Reservation.objects.filter(status="Overdue").count()
        return Response({"overdue_slots": overdue_count})
