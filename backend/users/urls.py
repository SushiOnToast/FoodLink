from django.urls import path
from .views import *

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("profile/<str:username>/", ProfileView.as_view(), name="user_profile"),
    path(
        "profile/<str:username>/edit/", UpdateProfileView.as_view(), name="edit_profile"
    ),
    path("donors/", DonorLocationView.as_view(), name="donors"),
]
