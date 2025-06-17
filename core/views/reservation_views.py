from rest_framework import generics, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils.timezone import now
from django.shortcuts import get_object_or_404

from core.models import Reservation, ParkingSlot
from core.serializers import ReservationSerializer, ReservationListSerializer


class ReservationCreateView(generics.CreateAPIView):
    """
    Create a reservation for an available slot.
    Automatically marks the slot as unavailable.
    """
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        reservation = serializer.save(user=self.request.user)
        reservation.slot.is_available = False
        reservation.slot.save()


class MyReservationsView(generics.ListAPIView):
    """
    List all reservations of the authenticated user.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        reservations = Reservation.objects.filter(user=request.user).order_by('-created_at')
        serializer = ReservationListSerializer(reservations, many=True)
        return Response({"data": serializer.data})


class AllReservationsView(generics.ListAPIView):
    """
    Admin-only: View all reservations in the system.
    """
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAdminUser]


class ReservationDetailView(generics.RetrieveAPIView):
    """
    Retrieve details of a specific reservation.
    """
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]


class ReservationDeleteView(generics.DestroyAPIView):
    """
    Cancel a reservation and free up the associated slot.
    Users can cancel their own; Admins can cancel any.
    """
    queryset = Reservation.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        reservation = self.get_object()
        if reservation.user != request.user and not request.user.is_staff:
            return Response({"error": "Not authorized to delete this reservation."}, status=403)

        reservation.slot.is_available = True
        reservation.slot.save()
        reservation.delete()

        return Response({"message": "Reservation cancelled, slot marked available."}, status=200)


class ReservationCheckInView(APIView):
    """
    Mark check-in time for a reservation.
    Only the reservation owner may check in.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        reservation = get_object_or_404(Reservation, id=pk, user=request.user)
        reservation.last_park_in = now()
        reservation.save()
        return Response({"message": "Checked in"}, status=200)


class ReservationCheckOutView(APIView):
    """
    Mark check-out time for a reservation.
    Frees up the associated slot.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        reservation = get_object_or_404(Reservation, id=pk, user=request.user)
        reservation.last_park_out = now()
        reservation.slot.is_available = True
        reservation.slot.save()
        reservation.save()
        return Response({
            "message": "Check-out successful",
            "checked_out_at": reservation.last_park_out
        }, status=200)


class ReservationStatusUpdateView(APIView):
    """
    Update reservation status.
    - Users: can only cancel their own reservations.
    - Admins: can update to any allowed status.
    """
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, pk):
        reservation = get_object_or_404(Reservation, id=pk)

        if request.user != reservation.user and not request.user.is_staff:
            return Response({"error": "You do not have permission to update this reservation."}, status=403)

        new_status = request.data.get("status")
        allowed_statuses = ["Active", "Reserved", "Overdue", "Cancelled", "Complete"]

        if not new_status:
            return Response({"error": "Status is required."}, status=400)
        if new_status not in allowed_statuses:
            return Response({
                "error": f"Invalid status. Allowed: {', '.join(allowed_statuses)}."
            }, status=400)
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
        })


class UploadReceiptView(APIView):
    """
    Upload a payment receipt for a reservation.
    Automatically sets status to 'Processing'.
    """
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        reservation = get_object_or_404(Reservation, pk=pk)

        if reservation.user != request.user:
            return Response({'detail': 'Not allowed.'}, status=403)
        if 'receipt' not in request.FILES:
            return Response({'detail': 'No receipt uploaded.'}, status=400)

        reservation.receipt = request.FILES['receipt']
        reservation.status = 'Processing'
        reservation.save()

        return Response({'detail': 'Receipt uploaded successfully.'}, status=200)


class ApproveReservationView(APIView):
    """
    Admin: Approve a reservation that has a receipt and is in 'Processing' status.
    Sets status to 'Reserved'.
    """
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        reservation = get_object_or_404(Reservation, pk=pk)

        if reservation.status != "Processing":
            return Response({'detail': 'Only "Processing" reservations can be approved.'}, status=400)

        if not reservation.receipt:
            return Response({'detail': 'Cannot approve reservation without a receipt.'}, status=400)

        reservation.status = "Reserved"
        reservation.save()
        serializer = ReservationSerializer(reservation)
        return Response(serializer.data, status=200)
