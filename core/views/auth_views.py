from rest_framework import generics, permissions
from rest_framework.response import Response
from django.contrib.auth.models import User
from core.serializers import RegisterSerializer, UserSerializer

class RegisterView(generics.CreateAPIView):
    """
    Public endpoint to register a new user.
    """
    queryset = User.objects.all()
    serializer_class = RegisterSerializer


class ProfileView(generics.RetrieveAPIView):
    """
    Returns the authenticated user's profile.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class ProfileUpdateView(generics.UpdateAPIView):
    """
    Allows authenticated users to update their own profile.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user
