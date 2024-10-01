from rest_framework import generics, permissions
from .models import *
from .serializers import *


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerialiser
    permission_classes = [permissions.AllowAny]


class ProfileView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerialiser
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = "username"


class UpdateProfileView(generics.UpdateAPIView):
    serializer_class = UpdateProfileSerialiser
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class DonorLocationView(generics.ListAPIView):
    queryset = User.objects.filter(role="donor")
    serializer_class = UserSerialiser
    permission_classes = [permissions.IsAuthenticated]
