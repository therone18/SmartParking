from rest_framework import generics, status, permissions
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from core.models import ParkingSlot, Reservation
from core.serializers import ParkingSlotSerializer


class ParkingSlotListView(generics.ListAPIView):
    """
    Get all slots for a specific location.
    """
    serializer_class = ParkingSlotSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        location_id = self.kwargs['location_id']
        return ParkingSlot.objects.filter(location_id=location_id)


class ParkingSlotCreateView(generics.CreateAPIView):
    """
    Admin-only: Create a new parking slot.
    """
    queryset = ParkingSlot.objects.all()
    serializer_class = ParkingSlotSerializer
    permission_classes = [permissions.IsAdminUser]


class ParkingSlotUpdateView(generics.UpdateAPIView):
    """
    Admin-only: Update parking slot details.
    """
    queryset = ParkingSlot.objects.all()
    serializer_class = ParkingSlotSerializer
    permission_classes = [permissions.IsAdminUser]


class ParkingSlotDeleteView(generics.DestroyAPIView):
    """
    Admin-only: Delete a parking slot, only if it has no reservations.
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


class LockSlotView(generics.UpdateAPIView):
    """
    Admin-only: Lock a specific parking slot.
    """
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        slot = get_object_or_404(ParkingSlot, pk=pk)
        slot.locked = True
        slot.save()
        return Response({"message": f"Slot {slot.slot_id} locked."})


class UnlockSlotView(generics.UpdateAPIView):
    """
    Admin-only: Unlock a specific parking slot.
    """
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        slot = get_object_or_404(ParkingSlot, pk=pk)
        slot.locked = False
        slot.save()
        return Response({"message": f"Slot {slot.slot_id} unlocked."})
