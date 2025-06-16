from django.urls import path
from core import views

urlpatterns = [

    # -------------------------------
    # Auth & User Management
    # -------------------------------
    path('register/', views.RegisterView.as_view(), name='register'),
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('profile/update/', views.ProfileUpdateView.as_view(), name='profile-update'),

    path('users/', views.UserListView.as_view(), name='user-list'),
    path('users/<int:id>/deactivate/', views.DeactivateUserView.as_view(), name='deactivate-user'),
    path('users/<int:id>/reactivate/', views.ReactivateUserView.as_view(), name='reactivate-user'),

    # -------------------------------
    # Parking Locations
    # -------------------------------
    path('locations/', views.ParkingLocationListCreateView.as_view(), name='location-list-create'),
    path('locations/search/', views.ParkingLocationSearchView.as_view(), name='location-search'),
    path('locations/<int:pk>/', views.ParkingLocationDetailView.as_view(), name='location-detail'),
    #path('locations/<int:id>/users/', views.UsersByLocationView.as_view(), name='location-users'),
    path('locations/<int:pk>/reservations/', views.LocationReservationsView.as_view(), name='location-reservations'),
    path('locations-dashboard/', views.AdminLocationDashboardView.as_view(), name='admin-location-dashboard'),

    # -------------------------------
    # Parking Slots
    # -------------------------------
    path('slots/<int:location_id>/', views.ParkingSlotListView.as_view(), name='slot-list'),
    path('slots/create/', views.ParkingSlotCreateView.as_view(), name='create-slot'),
    path('slots/<int:pk>/update/', views.ParkingSlotUpdateView.as_view(), name='slot-update'),
    path('slots/<int:pk>/delete/', views.ParkingSlotDeleteView.as_view(), name='slot-delete'),
    path('slots/<int:pk>/lock/', views.LockSlotView.as_view(), name='lock-slot'),
    path('slots/<int:pk>/unlock/', views.UnlockSlotView.as_view(), name='unlock-slot'),

    # -------------------------------
    # Reservations
    # -------------------------------
    path('reservations/', views.ReservationCreateView.as_view(), name='reservation-create'),
    path('reservations/me/', views.MyReservationsView.as_view(), name='my-reservations'),
    path('reservations/all/', views.AllReservationsView.as_view(), name='all-reservations'),
    path('reservations/<int:pk>/', views.ReservationDetailView.as_view(), name='reservation-detail'),

    path('reservations/<int:pk>/status/', views.ReservationStatusUpdateView.as_view(), name='reservation-status-update'),
    path('reservations/<int:pk>/upload-receipt/', views.UploadReceiptView.as_view(), name='upload-receipt'),
    path('reservations/<int:pk>/approve/', views.ApproveReservationView.as_view(), name='reservation-approve'),

    path('reservations/<int:pk>/in/', views.ReservationCheckInView.as_view(), name='reservation-checkin'),
    path('reservations/<int:pk>/out/', views.ReservationCheckOutView.as_view(), name='reservation-checkout'),

    # -------------------------------
    # Summaries / Analytics
    # -------------------------------
    path('summary/slot-utilization/', views.SlotUtilizationSummaryView.as_view(), name='slot-utilization-summary'),
    path('summary/slot-utilization/overall/', views.OverallSlotUtilizationView.as_view(), name='overall-slot-utilization'),
    path('summary/daily/', views.DailySummaryView.as_view(), name='daily-summary'),
    path('summary/slot-active/', views.SlotActiveSummaryView.as_view(), name='slot-active-summary'),
    path('summary/slot-overdue/', views.OverdueSlotSummaryView.as_view(), name='slot-overdue-summary'),

    # -------------------------------
    # System
    # -------------------------------
    #path('system/healthcheck/', views.HealthCheckView.as_view(), name='health-check'),
    
    path("test-cors/", views.TestCORSView.as_view(), name="test-cors"),
]
