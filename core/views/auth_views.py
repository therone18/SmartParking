from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.contrib.auth.models import User
from core.serializers import RegisterSerializer, UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView


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

class ChangePasswordView(APIView):
    """
    Allows authenticated users to change their password.
    Requires: current_password, new_password.
    Automatically logs the user out after a successful password change.
    """
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request):
        user = request.user
        current = request.data.get("current_password")
        new = request.data.get("new_password")

        if not current or not new:
            return Response({"detail": "Both current and new password are required."}, status=400)

        if not user.check_password(current):
            return Response({"detail": "Current password is incorrect."}, status=400)

        # Update password
        user.set_password(new)
        user.save()

        # Invalidate current refresh token (logout)
        try:
            refresh_token = request.data.get("refresh")
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception:
            pass  # Token may already be expired or not sent, ignore silently

        return Response(
            {"detail": "Password updated successfully. Please log in again."},
            status=status.HTTP_200_OK,
        )