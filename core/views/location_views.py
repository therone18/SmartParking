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
    """
    GET: Public – List all parking locations.
    POST: Admin only – Create a new parking location.
    """
    queryset = ParkingLocation.objects.all()
    serializer_class = ParkingLocationSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]


class ParkingLocationDetailView(generics.RetrieveAPIView):
    """
    GET: Public – Retrieve a specific location with associated slots.
    """
    queryset = ParkingLocation.objects.all()
    serializer_class = ParkingLocationWithSlotsSerializer
    permission_classes = [permissions.AllowAny]

    # NOTE: Deletion logic moved to a dedicated admin-only view.
    # If needed, safely move destroy logic to a RetrieveUpdateDestroyView elsewhere.


class ParkingLocationSearchView(APIView):
    """
    GET: Search parking locations by name.
    Example: /api/locations/search/?q=Ayala
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        query = request.query_params.get("q", "")
        locations = ParkingLocation.objects.filter(name__icontains=query)
        serializer = ParkingLocationSerializer(locations, many=True)
        return Response(serializer.data)


class LocationReservationsView(APIView):
    """
    Admin only:
    GET: List all reservations for a given parking location.
    URL: /api/locations/<pk>/users/
    """
    permission_classes = [permissions.IsAdminUser]

    def get(self, request, pk):
        location = get_object_or_404(ParkingLocation, pk=pk)
        slots = ParkingSlot.objects.filter(location=location)
        reservations = Reservation.objects.filter(slot__in=slots)
        serializer = ReservationSerializer(reservations, many=True)
        return Response(serializer.data)


class AdminLocationDashboardView(APIView):
    """
    Admin only:
    GET: Return all locations with their associated slots.
    Used by admin panel for location-slot management.
    """
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        locations = ParkingLocation.objects.prefetch_related("parkingslot_set").all()
        serializer = ParkingLocationWithSlotsSerializer(locations, many=True)
        return Response(serializer.data)


class TestCORSView(APIView):
    """
    Public test endpoint to check if CORS is properly configured.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        return Response({"message": "CORS is working!"})
