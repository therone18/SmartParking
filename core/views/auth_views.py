from rest_framework import generics, permissions
from rest_framework.response import Response
from django.contrib.auth.models import User
from core.serializers import RegisterSerializer, UserSerializer


class RegisterView(generics.CreateAPIView):
    """
    Public endpoint to register a new user.
    Accepts: username, email, password
    Returns: Basic user info
    """
    queryset = User.objects.all()
    serializer_class = RegisterSerializer


class ProfileView(generics.RetrieveAPIView):
    """
    Returns the currently authenticated user's profile.
    Requires Authorization header (Token or Session).
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class ProfileUpdateView(generics.UpdateAPIView):
    """
    Allows authenticated users to update their own profile.
    Accepts: first_name, last_name, email
    (Username and password are not updatable here.)
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user
