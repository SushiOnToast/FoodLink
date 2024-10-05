from django.db import models
from users.models import User
from listings.models import Listing

class Request(models.Model):
    recipient = models.ForeignKey(User, on_delete=models.CASCADE)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE)
    quantity_requested = models.PositiveIntegerField()
    status = models.CharField(max_length=20, choices=[
        ("pending", "Pending"),
        ("accepted", "Accepted"),
        ("rejected", "Rejected")
    ], default="pending")
    additional_notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Request by {self.recipient.username} for {self.listing.name}"