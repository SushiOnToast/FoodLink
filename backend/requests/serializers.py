from rest_framework import serializers
from .models import Request
from listings.models import Listing
from users.models import User


class RequestSerializer(serializers.ModelSerializer):
    """Serializer for handling requests related to food listings."""

    # Read-only fields to get related data from the listing and recipient
    listing_name = serializers.CharField(source="listing.name", read_only=True)
    recipient_name = serializers.CharField(source="recipient.username", read_only=True)
    listing_latitude = serializers.FloatField(
        source="listing.donor.latitude", read_only=True
    )
    listing_longitude = serializers.FloatField(
        source="listing.donor.longitude", read_only=True
    )
    recipient_latitude = serializers.FloatField(
        source="recipient.latitude", read_only=True
    )
    recipient_longitude = serializers.FloatField(
        source="recipient.longitude", read_only=True
    )

    class Meta:
        model = Request
        fields = [
            "id",
            "quantity_requested",
            "additional_notes",
            "listing_name",
            "recipient_name",
            "listing_latitude",
            "listing_longitude",
            "recipient_latitude",
            "recipient_longitude",
            "status",
        ]

    def validate_quantity_requested(self, value):
        """Validate that the quantity requested is greater than zero."""
        if value <= 0:
            raise serializers.ValidationError(
                "Quantity requested must be greater than zero."
            )
        return value
