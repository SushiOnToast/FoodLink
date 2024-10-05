from django.db import models
from django.utils.text import slugify
from users.models import User


class FoodType(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Listing(models.Model):

    name = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField(default=0)
    special_notes = models.TextField()
    donor = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    food_types = models.ManyToManyField(FoodType, blank=True)

    def __str__(self):
        return self.name