from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from rest_framework import status
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

from core.models import Reservation
from core.serializers import UserSerializer, ReservationSerializer


class UserListView(APIView):
    """
    Admin-only: Returns a list of all users.
    """
    permission_classes = [IsAdminUser]

    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)


class DeactivateUserView(APIView):
    """
    Admin-only: Deactivates a user account.
    """
    permission_classes = [IsAdminUser]

    def post(self, request, id):
        user = get_object_or_404(User, id=id)
        user.is_active = False
        user.save()
        return Response({'message': 'User deactivated successfully.'})


class ReactivateUserView(APIView):
    """
    Admin-only: Reactivates a user account.
    """
    permission_classes = [IsAdminUser]

    def post(self, request, id):
        user = get_object_or_404(User, id=id)
        user.is_active = True
        user.save()
        return Response({'message': 'User reactivated successfully.'})


class ApproveReservationView(APIView):
    """
    Admin-only: Approves a reservation, only if it is in 'Processing' status and has a receipt.
    """
    permission_classes = [IsAdminUser]

    def post(self, request, pk):
        reservation = get_object_or_404(Reservation, pk=pk)

        if reservation.status != "Processing":
            return Response(
                {'detail': 'Only "Processing" reservations can be approved.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not reservation.receipt:
            return Response(
                {'detail': 'Cannot approve reservation without a receipt.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        reservation.status = "Reserved"
        reservation.save()
        serializer = ReservationSerializer(reservation)
        return Response(serializer.data, status=status.HTTP_200_OK)

