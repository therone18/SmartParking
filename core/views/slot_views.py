from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from core.models import ParkingSlot, Reservation
from core.serializers import ParkingSlotSerializer


class ParkingSlotListView(generics.ListAPIView):
    """
    Authenticated:
    GET: List all parking slots for a specific location.
    URL: /api/locations/<location_id>/slots/
    """
    serializer_class = ParkingSlotSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        location_id = self.kwargs['location_id']
        return ParkingSlot.objects.filter(location_id=location_id)


class ParkingSlotCreateView(generics.CreateAPIView):
    """
    Admin only:
    POST: Create a new parking slot under a location.
    """
    queryset = ParkingSlot.objects.all()
    serializer_class = ParkingSlotSerializer
    permission_classes = [permissions.IsAdminUser]


class ParkingSlotUpdateView(generics.UpdateAPIView):
    """
    Admin only:
    PUT/PATCH: Update a parking slot (e.g. availability, floorzone).
    """
    queryset = ParkingSlot.objects.all()
    serializer_class = ParkingSlotSerializer
    permission_classes = [permissions.IsAdminUser]


class ParkingSlotDeleteView(generics.DestroyAPIView):
    """
    Admin only:
    DELETE: Delete a parking slot if it has no reservations.
    """
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


class LockSlotView(APIView):
    """
    Admin only:
    POST: Lock a specific parking slot to prevent reservations.
    URL: /api/slots/<pk>/lock/
    """
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        slot = get_object_or_404(ParkingSlot, pk=pk)
        slot.locked = True
        slot.save()
        return Response({"message": f"Slot '{slot.slot_id}' has been locked."}, status=200)


class UnlockSlotView(APIView):
    """
    Admin only:
    POST: Unlock a parking slot to allow reservations again.
    URL: /api/slots/<pk>/unlock/
    """
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        slot = get_object_or_404(ParkingSlot, pk=pk)
        slot.locked = False
        slot.save()
        return Response({"message": f"Slot '{slot.slot_id}' has been unlocked."}, status=200)
