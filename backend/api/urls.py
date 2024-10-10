from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from .serializers import CustomTokenObtainPairView  # Explicitly import the custom view

urlpatterns = [
    # Route for obtaining JWT tokens using the custom serializer
    path("token/", CustomTokenObtainPairView.as_view(), name="get_token"),
    # Route for refreshing JWT tokens
    path("token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    # Include user-related URLs
    path("users/", include("users.urls")),
    # Include listing-related URLs
    path("listings/", include("listings.urls")),
    # Include request-related URLs
    path("requests/", include("requests.urls")),
    # Include resource-related URLs
    path("resources/", include("resources.urls")),
]
