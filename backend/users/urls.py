from django.urls import path
from .views import RegisterView, ProfileView, UpdateProfileView, DonorLocationView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # URL pattern for user registration
    path("register/", RegisterView.as_view(), name="register"),
    # URL pattern for viewing a user's profile by username
    path("profile/<str:username>/", ProfileView.as_view(), name="user_profile"),
    # URL pattern for editing a user's profile
    path(
        "profile/<str:username>/edit/", UpdateProfileView.as_view(), name="edit_profile"
    ),
    # URL pattern for listing all donors
    path("donors/", DonorLocationView.as_view(), name="donors"),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

