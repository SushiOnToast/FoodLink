from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from .serializers import *


urlpatterns = [
    path("token/", CustomTokenObtainPairView.as_view(), name="get_token"),
    path("token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path('users/', include('users.urls')),
    path('listings/', include('listings.urls')),
    path('requests/', include('requests.urls')),
]