from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.utils.timezone import now, timedelta

from core.models import Reservation, ParkingLocation, ParkingSlot


class SlotUtilizationSummaryView(APIView):
    """
    Returns utilization stats per location for the last 7 days.
    Utilization is calculated as: (# of reservations) / (total slots at that location).
    """
    permission_classes = [IsAdminUser]

    def get(self, request):
        today = now().date()
        past_days = [today - timedelta(days=i) for i in range(7)]
        data = []

        for location in ParkingLocation.objects.all():
            total_slots = ParkingSlot.objects.filter(location=location).count()

            for date in reversed(past_days):
                day_reservations = Reservation.objects.filter(
                    slot__location=location,
                    start_time__date=date
                ).count()

                utilization = (
                    day_reservations / total_slots if total_slots else 0
                )

                data.append({
                    "location_id": location.id,
                    "location_name": location.name,
                    "date": date,
                    "total_slots": total_slots,
                    "reservations": day_reservations,
                    "utilization_rate": round(utilization, 2),
                })

        return Response(data)


class OverallSlotUtilizationView(APIView):
    """
    Returns overall slot utilization across all locations based on current active/reserved reservations.
    """
    permission_classes = [IsAdminUser]

    def get(self, request):
        locations = ParkingLocation.objects.all()
        total_slots = ParkingSlot.objects.count()
        active_reservations = Reservation.objects.filter(
            status__in=["Reserved", "Active"]
        ).count()

        utilization_rate = (
            active_reservations / total_slots if total_slots else 0
        )

        return Response({
            "total_locations": locations.count(),
            "total_slots": total_slots,
            "active_reservations": active_reservations,
            "utilization_rate": round(utilization_rate, 2)
        })

class DailySummaryView(APIView):
    """
    Returns the number of reservations made per day for the last 7 days.
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

        return Response(summary[::-1])  # Oldest to newest


class SlotActiveSummaryView(APIView):
    """
    Returns the number of currently active reservations (status='Active').
    """
    permission_classes = [IsAdminUser]

    def get(self, request):
        active_count = Reservation.objects.filter(status="Active").count()
        return Response({"active_slots": active_count})


class OverdueSlotSummaryView(APIView):
    """
    Returns the number of overdue reservations (status='Overdue').
    """
    permission_classes = [IsAdminUser]

    def get(self, request):
        overdue_count = Reservation.objects.filter(status="Overdue").count()
        return Response({"overdue_slots": overdue_count})
