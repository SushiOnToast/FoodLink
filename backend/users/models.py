from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    ROLE_CHOICES = [
        ("donor", "Donor"),
        ("recipient", "Recipient"),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default="recipient")
    about = models.CharField(max_length=1000, null=True) # for donors

    # latitude and longitude
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    profile_picture = models.ImageField(upload_to="profile_pictures/", null=True, blank=True, default="profile_pictures/default.png")
    

