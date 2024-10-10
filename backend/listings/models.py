from django.db import models
from django.utils.text import slugify
from users.models import User


class FoodType(models.Model):
    # Represents a type of food (e.g., fruits, vegetables, etc.)
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name  # Return the name of the food type


class Listing(models.Model):
    # Represents a food listing by a donor
    name = models.CharField(max_length=255)  # Name of the listing
    quantity = models.PositiveIntegerField(
        default=0
    )  # Available quantity of the food item
    special_notes = models.TextField()  # Any special notes regarding the food item
    donor = models.ForeignKey(
        User, on_delete=models.CASCADE
    )  # The user who donates the food
    created_at = models.DateTimeField(
        auto_now_add=True
    )  # Timestamp of when the listing was created
    food_types = models.ManyToManyField(
        FoodType, blank=True
    )  # Types of food associated with this listing
    cover_image = models.ImageField(
        upload_to="listing_images/",
        null=True,
        blank=True,
        default="listing_images/default.png",
    )  # Cover image for the listing

    def __str__(self):
        return self.name  # Return the name of the listing
