from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import IsAdminUser, AllowAny
from django.db import connection
from django.db.models import Count
from django.utils.timezone import now, timedelta
from rest_framework.parsers import MultiPartParser
from django.shortcuts import get_object_or_404
from rest_framework.decorators import action
from django.contrib.auth.models import User
from .models import ParkingLocation, ParkingSlot, Reservation
from django.utils.timezone import now
from .serializers import (
    RegisterSerializer,
    UserSerializer,
    ParkingLocationSerializer,
    ParkingSlotSerializer,
    ReservationSerializer,
    SlotUtilizationSerializer,
    ParkingLocationWithSlotsSerializer
)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

class ProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user
    
class ProfileUpdateView(generics.UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class ParkingLocationListCreateView(generics.ListCreateAPIView):
    queryset = ParkingLocation.objects.all()
    serializer_class = ParkingLocationSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]
    
class ParkingLocationDetailView(generics.RetrieveAPIView):
    queryset = ParkingLocation.objects.all()
    serializer_class = ParkingLocationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
class ParkingLocationUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ParkingLocation.objects.all()
    serializer_class = ParkingLocationSerializer
    permission_classes = [permissions.IsAdminUser]
    
class LocationReservationsView(APIView):
    permission_classes = [permissions.IsAdminUser]  # Change as needed

    def get(self, request, pk):
        try:
            location = ParkingLocation.objects.get(pk=pk)
        except ParkingLocation.DoesNotExist:
            return Response({"error": "Location not found"}, status=404)

        slots = ParkingSlot.objects.filter(location=location)
        reservations = Reservation.objects.filter(slot__in=slots)
        serializer = ReservationSerializer(reservations, many=True)
        return Response(serializer.data)
    

class ParkingLocationSearchView(ListAPIView):
    serializer_class = ParkingLocationSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        query = self.request.query_params.get('q')
        if query:
            return ParkingLocation.objects.filter(name__icontains=query)
        return ParkingLocation.objects.all()

class UsersByLocationView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, id):
        try:
            location = ParkingLocation.objects.get(id=id)
            reservations = Reservation.objects.filter(slot__location=location)
            user_ids = reservations.values_list("user_id", flat=True).distinct()
            users = User.objects.filter(id__in=user_ids)
            serializer = UserSerializer(users, many=True)
            return Response(serializer.data)
        except ParkingLocation.DoesNotExist:
            return Response({"error": "Location not found"}, status=404)
    
class ReservationCreateView(generics.CreateAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Save the reservation with the current user
        reservation = serializer.save(user=self.request.user)

        # Mark the selected slot as unavailable
        reservation.slot.is_available = False
        reservation.slot.save()

class ReservationDetailView(RetrieveAPIView):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Reservation.objects.filter(user=user)


class MyReservationsView(generics.ListAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Reservation.objects.filter(user=self.request.user)

from django.utils.timezone import now

class ReservationCheckInView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            reservation = Reservation.objects.get(id=pk, user=request.user)
            reservation.last_park_in = now()
            reservation.save()
            return Response({"message": "Checked in"}, status=200)
        except Reservation.DoesNotExist:
            return Response({"error": "Reservation not found"}, status=404)


class ReservationCheckOutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            reservation = Reservation.objects.get(id=pk, user=request.user)
            reservation.last_park_out = now()
            reservation.save()
            return Response({"message": "Checked out"}, status=200)
        except Reservation.DoesNotExist:
            return Response({"error": "Reservation not found"}, status=404)

class AllReservationsView(generics.ListAPIView):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAdminUser]
    
class ReservationsByLocationView(ListAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        location_id = self.kwargs['id']
        return Reservation.objects.filter(location__id=location_id)

class ReservationDeleteView(generics.DestroyAPIView):
    queryset = Reservation.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        try:
            reservation = self.get_object()
            slot = reservation.slot
            slot.is_available = True 
            slot.save()
            reservation.delete()
            return Response({"message": "Reservation cancelled, slot marked available."}, status=status.HTTP_200_OK)
        except Reservation.DoesNotExist:
            return Response({"error": "Reservation not found."}, status=status.HTTP_404_NOT_FOUND)
        
class ReservationCheckInView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            reservation = Reservation.objects.get(id=pk, user=request.user)
            reservation.last_park_in = now()
            reservation.save()
            return Response({"message": "Check-in successful", "checked_in_at": reservation.last_park_in}, status=200)
        except Reservation.DoesNotExist:
            return Response({"error": "Reservation not found or not yours."}, status=404)
        
class ReservationCheckOutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            reservation = Reservation.objects.get(id=pk, user=request.user)
        except Reservation.DoesNotExist:
            return Response({"error": "Reservation not found."}, status=status.HTTP_404_NOT_FOUND)

        reservation.last_park_out = now()
        reservation.save()

        # Optionally, make slot available again
        reservation.slot.is_available = True
        reservation.slot.save()

        return Response({"message": "Check-out successful", "checked_out_at": reservation.last_park_out}, status=200)



from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from core.models import Reservation


class ReservationStatusUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, pk):
        try:
            reservation = Reservation.objects.get(id=pk)
        except Reservation.DoesNotExist:
            return Response({"error": "Reservation not found."}, status=status.HTTP_404_NOT_FOUND)

        # Permission check
        if request.user != reservation.user and not request.user.is_staff:
            return Response({"error": "You do not have permission to update this reservation."}, status=403)

        new_status = request.data.get("status")
        allowed_statuses = ["Active", "Reserved", "Overdue", "Cancelled", "Complete"]

        if not new_status:
            return Response({"error": "Status is required."}, status=400)

        if new_status not in allowed_statuses:
            return Response({"error": f"Invalid status. Allowed: {', '.join(allowed_statuses)}."}, status=400)

        if not request.user.is_staff and new_status != "Cancelled":
            return Response({"error": "You can only cancel your own reservations."}, status=403)

        reservation.status = new_status
        reservation.save()

        if new_status in ["Cancelled", "Complete"]:
            reservation.slot.is_available = True
            reservation.slot.save()

        return Response({
            "message": f"Status updated to '{new_status}'.",
            "status": reservation.status
        }, status=200)






class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]
    
class ParkingSlotListView(generics.ListAPIView):
    serializer_class = ParkingSlotSerializer
    permission_classes = [permissions.IsAuthenticated]  # or AllowAny for testing

    def get_queryset(self):
        location_id = self.kwargs['location_id']
        return ParkingSlot.objects.filter(location_id=location_id)
    

class ParkingSlotCreateView(generics.CreateAPIView):
    queryset = ParkingSlot.objects.all()
    serializer_class = ParkingSlotSerializer
    permission_classes = [permissions.IsAdminUser]  # Only admins can create slots

class ParkingSlotDeleteView(generics.DestroyAPIView):
    queryset = ParkingSlot.objects.all()
    serializer_class = ParkingSlotSerializer
    permission_classes = [permissions.IsAdminUser]

    def delete(self, request, *args, **kwargs):
        slot = self.get_object()
        if Reservation.objects.filter(slot=slot).exists():
            return Response(
                {"error": "Cannot delete: Slot has existing reservations."},
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().delete(request, *args, **kwargs)
    
class ParkingSlotUpdateView(generics.RetrieveUpdateAPIView):
    queryset = ParkingSlot.objects.all()
    serializer_class = ParkingSlotSerializer
    permission_classes = [permissions.IsAdminUser]
    
class SlotUtilizationSummaryView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        today = now().date()
        seven_days_ago = today - timedelta(days=6)

        data = []

        for location in ParkingLocation.objects.all():
            total_slots = ParkingSlot.objects.filter(location=location).count()

            for day_offset in range(7):  # Last 7 days
                day = seven_days_ago + timedelta(days=day_offset)
                start = day
                end = day + timedelta(days=1)

                reservations_count = Reservation.objects.filter(
                    slot__location=location,
                    start_time__gte=start,
                    start_time__lt=end
                ).count()

                utilization_rate = (
                    reservations_count / total_slots if total_slots > 0 else 0
                )

                data.append({
                    "location_id": location.id,
                    "location_name": location.name,
                    "date": day,
                    "total_slots": total_slots,
                    "reservations": reservations_count,
                    "utilization_rate": round(utilization_rate, 2),
                })

        serializer = SlotUtilizationSerializer(data, many=True)
        return Response(serializer.data)

class OverallSlotUtilizationView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        today = now().date()
        days = 7
        start_date = today - timedelta(days=days - 1)
        end_date = today

        total_locations = ParkingLocation.objects.count()
        total_slots = ParkingSlot.objects.count()

        reservations = Reservation.objects.filter(
            start_time__date__range=(start_date, end_date)
        ).count()

        total_possible_reservations = total_slots * days
        avg_utilization_rate = (
            reservations / total_possible_reservations
            if total_possible_reservations > 0 else 0
        )

        return Response({
            "total_locations": total_locations,
            "total_slots": total_slots,
            "total_reservations": reservations,
            "average_utilization_rate": round(avg_utilization_rate, 2),
            "date_range": {
                "start": str(start_date),
                "end": str(end_date)
            }
        })   

class DailySummaryView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        today = now().date()
        days = 7
        start_date = today - timedelta(days=days - 1)

        results = []

        for i in range(days):
            day = start_date + timedelta(days=i)
            reservations = Reservation.objects.filter(start_time__date=day)
            
            results.append({
                "date": str(day),
                "total_reservations": reservations.count(),
                "active_reservations": reservations.filter(status="Active").count(),
                "completed_reservations": reservations.filter(status="Complete").count(),
                "cancelled_reservations": reservations.filter(status="Cancelled").count(),
                "overdue_reservations": reservations.filter(status="Overdue").count(),
            })

        return Response(results)
  
class SlotActiveSummaryView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        data = []

        locations = ParkingLocation.objects.all()

        for location in locations:
            slots = ParkingSlot.objects.filter(location=location)
            total_slots = slots.count()
            available_slots = slots.filter(is_available=True).count()
            active_slots = total_slots - available_slots

            data.append({
                "location_id": location.id,
                "location_name": location.name,
                "total_slots": total_slots,
                "active_slots": active_slots,
                "available_slots": available_slots
            })

        return Response(data)  

class OverdueSlotSummaryView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        current_time = now()
        data = []

        locations = ParkingLocation.objects.all()

        for location in locations:
            slots = ParkingSlot.objects.filter(location=location)
            overdue_reservations = Reservation.objects.filter(
                slot__in=slots,
                end_time__lt=current_time,
                last_park_out__isnull=True
            )

            data.append({
                "location_id": location.id,
                "location_name": location.name,
                "overdue_count": overdue_reservations.count(),
                "overdue_reservations": [
                    {
                        "reservation_id": r.id,
                        "user": r.user.email,
                        "slot_id": r.slot.id,
                        "start_time": r.start_time,
                        "end_time": r.end_time
                    } for r in overdue_reservations
                ]
            })

        return Response(data)


class HealthCheckView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        db_status = 'ok'
        try:
            connection.ensure_connection()
        except Exception:
            db_status = 'unavailable'

        return Response({
            "status": "ok",
            "message": "System is healthy",
            "time": now(),
            "database": db_status
        }, status=200)

class DeactivateUserView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, id):
        try:
            user = User.objects.get(pk=id)
            if not user.is_active:
                return Response({"message": "User is already deactivated."}, status=status.HTTP_400_BAD_REQUEST)

            user.is_active = False
            user.save()
            return Response({"message": f"User '{user.username}' has been deactivated."}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        
class ReactivateUserView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, id):
        try:
            user = User.objects.get(pk=id)
            if user.is_active:
                return Response({"message": "User is already active."}, status=status.HTTP_400_BAD_REQUEST)

            user.is_active = True
            user.save()
            return Response({"message": f"User '{user.username}' has been reactivated."}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        

class UploadReceiptView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        reservation = get_object_or_404(Reservation, pk=pk)

        # Ensure the reservation belongs to the logged-in user
        if reservation.user != request.user:
            return Response({'detail': 'Not allowed.'}, status=status.HTTP_403_FORBIDDEN)

        # Ensure the file is in the request
        if 'receipt' not in request.FILES:
            return Response({'detail': 'No receipt uploaded.'}, status=status.HTTP_400_BAD_REQUEST)

        # Save the receipt
        reservation.receipt = request.FILES['receipt']
        reservation.status = 'processing'  # If you have status tracking
        reservation.save()

        return Response({'detail': 'Receipt uploaded successfully.'}, status=status.HTTP_200_OK)

class LockSlotView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        slot = generics.get_object_or_404(ParkingSlot, pk=pk)
        slot.locked = True
        slot.save()
        return Response({"detail": "Slot locked successfully."}, status=status.HTTP_200_OK)

class UnlockSlotView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        slot = generics.get_object_or_404(ParkingSlot, pk=pk)
        slot.locked = False
        slot.save()
        return Response({"detail": "Slot unlocked successfully."}, status=status.HTTP_200_OK)
    


class AdminLocationDashboardView(generics.ListAPIView):
    permission_classes = [permissions.IsAdminUser]
    serializer_class = ParkingLocationWithSlotsSerializer
    queryset = ParkingLocation.objects.all()

class ApproveReservationView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        try:
            reservation = Reservation.objects.get(pk=pk)
        except Reservation.DoesNotExist:
            return Response({'detail': 'Reservation not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Status must be "Processing"
        if reservation.status != "Processing":
            return Response({'detail': 'Only "Processing" reservations can be approved.'}, status=status.HTTP_400_BAD_REQUEST)

        # Must have uploaded receipt
        if not reservation.receipt:
            return Response({'detail': 'Cannot approve reservation without a receipt.'}, status=status.HTTP_400_BAD_REQUEST)

        reservation.status = "Reserved"
        reservation.save()

        serializer = ReservationSerializer(reservation)
        return Response(serializer.data, status=status.HTTP_200_OK)
