from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """
    Custom User model that extends the default Django AbstractUser.
    Includes additional fields for user role, location, and profile information.
    """

    ROLE_CHOICES = [
        ("donor", "Donor"),  # User can be a donor
        ("recipient", "Recipient"),  # User can be a recipient
    ]

    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default="recipient")
    about = models.CharField(max_length=1000, null=True)  # Description for donors

    # Geographic coordinates for user location
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    # Profile picture with a default image
    profile_picture = models.ImageField(
        upload_to="profile_pictures/",
        null=True,
        blank=True,
        default="profile_pictures/default.png",
    )
