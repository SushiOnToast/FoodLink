from rest_framework import generics, permissions
from .models import User  # Import the User model
from .serializers import (
    RegisterSerializer,
    UserSerializer,
    UpdateProfileSerializer,
)  # Import serializers


class RegisterView(generics.CreateAPIView):
    """
    View for user registration.
    Allows any user to register a new account.
    """

    queryset = User.objects.all()  # All User instances
    serializer_class = RegisterSerializer  # Serializer for registration
    permission_classes = [permissions.AllowAny]  # Allow any user to access this view


class ProfileView(generics.RetrieveAPIView):
    """
    View for retrieving a user's profile information.
    Only authenticated users can access their profile.
    """

    queryset = User.objects.all()  # All User instances
    serializer_class = UserSerializer  # Serializer for user profile
    permission_classes = [permissions.IsAuthenticated]  # Require authentication
    lookup_field = "username"  # Look up user by username


class UpdateProfileView(generics.UpdateAPIView):
    """
    View for updating a user's profile.
    Only authenticated users can update their own profile.
    """

    serializer_class = UpdateProfileSerializer  # Serializer for updating user profile
    permission_classes = [permissions.IsAuthenticated]  # Require authentication

    def get_object(self):
        """
        Retrieve the current user instance.
        """
        return self.request.user  # Return the authenticated user


class DonorLocationView(generics.ListAPIView):
    """
    View for listing all users with the role of donor.
    Only authenticated users can access this view.
    """

    queryset = User.objects.filter(role="donor")  # Filter users to only donors
    serializer_class = UserSerializer  # Serializer for user details
    permission_classes = [permissions.IsAuthenticated]  # Require authentication
