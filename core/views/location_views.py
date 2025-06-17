# core/views/location_views.py

from rest_framework import generics, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from core.models import ParkingLocation, ParkingSlot, Reservation
from core.serializers import (
    ParkingLocationSerializer,
    ParkingLocationWithSlotsSerializer,
    ReservationSerializer,
)


class ParkingLocationListCreateView(generics.ListCreateAPIView):
    queryset = ParkingLocation.objects.all()
    serializer_class = ParkingLocationSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]


class ParkingLocationDetailView(generics.RetrieveAPIView):
    queryset = ParkingLocation.objects.all()
    serializer_class = ParkingLocationWithSlotsSerializer 
    permission_classes = [permissions.AllowAny]

    # Optional: your custom destroy logic (can be kept or moved to a different view)
    def destroy(self, request, *args, **kwargs):
        location = self.get_object()
        slots = location.parkingslot_set.all()

        for slot in slots:
            if Reservation.objects.filter(slot=slot).exists():
                return Response(
                    {"error": "Cannot delete location: some slots have reservations."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        if slots.exists():
            return Response(
                {"error": "Cannot delete location: it still has parking slots."},
                status=status.HTTP_400_BAD_REQUEST
            )

        return super().destroy(request, *args, **kwargs)

class ParkingLocationSearchView(APIView):
    def get(self, request):
        query = request.query_params.get("q", "")
        locations = ParkingLocation.objects.filter(name__icontains=query)
        serializer = ParkingLocationSerializer(locations, many=True)
        return Response(serializer.data)


class LocationReservationsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request, pk):
        location = get_object_or_404(ParkingLocation, pk=pk)
        slots = ParkingSlot.objects.filter(location=location)
        reservations = Reservation.objects.filter(slot__in=slots)
        serializer = ReservationSerializer(reservations, many=True)
        return Response(serializer.data)


class AdminLocationDashboardView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        locations = ParkingLocation.objects.prefetch_related("parkingslot_set").all()
        serializer = ParkingLocationWithSlotsSerializer(locations, many=True)
        return Response(serializer.data)


class TestCORSView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        return Response({"message": "CORS is working!"})