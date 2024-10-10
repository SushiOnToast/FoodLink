from rest_framework import serializers
from .models import *
from requests.serializers import *


class FoodTypeSerialiser(serializers.ModelSerializer):
    class Meta:
        model = FoodType
        fields = ["id", "name"]  # Fields to be serialized for FoodType


class ListingSerialiser(serializers.ModelSerializer):
    # Read-only field to get the username of the donor
    donor_username = serializers.ReadOnlyField(source="donor.username")

    # Food types associated with the listing, serialized using FoodTypeSerialiser
    food_types = FoodTypeSerialiser(many=True, read_only=True)

    # Field for writing food type IDs, allowing the creation of associations
    food_type_ids = serializers.PrimaryKeyRelatedField(
        queryset=FoodType.objects.all(),
        source="food_types",
        many=True,
        write_only=True,
    )

    # Requests associated with the listing, serialized using RequestSerilialiser
    requests = RequestSerializer(many=True, read_only=True)

    # Latitude and longitude of the donor, read-only
    listing_latitude = serializers.FloatField(source="donor.latitude", read_only=True)
    listing_longitude = serializers.FloatField(source="donor.longitude", read_only=True)

    # Cover image for the listing, optional
    cover_image = serializers.ImageField(allow_null=True, required=False)

    class Meta:
        model = Listing
        fields = [
            "id",
            "name",
            "quantity",
            "special_notes",
            "donor",
            "donor_username",
            "created_at",
            "food_types",
            "food_type_ids",
            "requests",
            "listing_latitude",
            "listing_longitude",
            "cover_image",
        ]
        extra_kwargs = {
            "donor": {"read_only": True},  # Donor information should not be writable
            "created_at": {"read_only": True},  # Creation date should not be writable
            "special_notes": {
                "required": False,
                "allow_blank": True,
            },  # Allow blank special notes
        }


class UpdateListingSerialiser(serializers.ModelSerializer):
    # Food types associated with the listing, serialized using FoodTypeSerialiser
    food_types = FoodTypeSerialiser(many=True, read_only=True)

    # Field for writing food type IDs, allowing the creation of associations
    food_type_ids = serializers.PrimaryKeyRelatedField(
        queryset=FoodType.objects.all(),
        source="food_types",
        many=True,
        write_only=True,
    )

    # Cover image for the listing, optional
    cover_image = serializers.ImageField(allow_null=True, required=False)

    class Meta:
        model = Listing
        fields = [
            "name",
            "quantity",
            "special_notes",
            "food_types",
            "food_type_ids",
            "cover_image",
        ]
