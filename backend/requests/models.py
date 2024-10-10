from django.db import models
from users.models import User
from listings.models import Listing


class Request(models.Model):
    """Model representing a request for a food listing."""

    # Status choices for the request
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    DELIVERED = "delivered"

    recipient = models.ForeignKey(User, on_delete=models.CASCADE)
    listing = models.ForeignKey(
        Listing, on_delete=models.CASCADE, related_name="requests"
    )
    quantity_requested = models.PositiveIntegerField()
    status = models.CharField(
        max_length=20,
        choices=[
            (PENDING, "Pending"),
            (ACCEPTED, "Accepted"),
            (REJECTED, "Rejected"),
            (DELIVERED, "Delivered"),
        ],
        default=PENDING,  # Default status is 'pending'
    )
    additional_notes = models.TextField(blank=True, null=True)

    def __str__(self):
        # Return a string representation of the request
        return f"Request by {self.recipient.username} for {self.listing.name}"
