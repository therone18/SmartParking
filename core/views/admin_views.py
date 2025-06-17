from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from rest_framework import status
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

from core.models import Reservation, ParkingLocation
from core.serializers import UserSerializer, ReservationSerializer


class UserListView(APIView):
    """
    Admin-only: Returns a list of all registered users.
    """
    permission_classes = [IsAdminUser]

    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)


class DeactivateUserView(APIView):
    """
    Admin-only: Deactivates the selected user account.
    """
    permission_classes = [IsAdminUser]

    def post(self, request, id):
        user = get_object_or_404(User, id=id)
        user.is_active = False
        user.save()
        return Response({'message': 'User deactivated successfully.'}, status=status.HTTP_200_OK)


class ReactivateUserView(APIView):
    """
    Admin-only: Reactivates a previously deactivated user account.
    """
    permission_classes = [IsAdminUser]

    def post(self, request, id):
        user = get_object_or_404(User, id=id)
        user.is_active = True
        user.save()
        return Response({'message': 'User reactivated successfully.'}, status=status.HTTP_200_OK)


class ApproveReservationView(APIView):
    """
    Admin-only: Approves a reservation that is currently 'Processing' and has a receipt uploaded.
    """
    permission_classes = [IsAdminUser]

    def post(self, request, pk):
        reservation = get_object_or_404(Reservation, pk=pk)

        # Only allow approval if status is 'Processing'
        if reservation.status != "Processing":
            return Response(
                {'detail': 'Only reservations with status "Processing" can be approved.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Ensure a receipt is attached
        if not reservation.receipt:
            return Response(
                {'detail': 'Cannot approve reservation without a receipt.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Update status to Reserved
        reservation.status = "Reserved"
        reservation.save()

        serializer = ReservationSerializer(reservation)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AdminDeleteLocationView(APIView):
    """
    Admin-only: Deletes a specific parking location if it has no reservations or slots.
    """
    permission_classes = [IsAdminUser]

    def delete(self, request, pk):
        location = get_object_or_404(ParkingLocation, pk=pk)

        # Check if location has related reservations
        if location.reservation_set.exists():
            return Response(
                {"detail": "Cannot delete a location with existing reservations."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if location has slots
        if location.parkingslot_set.exists():
            return Response(
                {"detail": "Please delete all slots in this location before deletion."},
                status=status.HTTP_400_BAD_REQUEST
            )

        location.delete()
        return Response(
            {"message": "Location deleted successfully."},
            status=status.HTTP_200_OK
        )