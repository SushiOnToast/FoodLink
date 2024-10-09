from rest_framework import serializers
from .models import *
from requests.serializers import RequestSerilialiser

class FoodTypeSerialiser(serializers.ModelSerializer):
    class Meta:
        model = FoodType
        fields = ["id", "name"]


class ListingSerialiser(serializers.ModelSerializer):
    donor_username = serializers.ReadOnlyField(source="donor.username")
    food_types = FoodTypeSerialiser(many=True, read_only=True)
    food_type_ids = serializers.PrimaryKeyRelatedField(
        queryset=FoodType.objects.all(),
        source="food_types",
        many=True,
        write_only=True,
    )
    requests = RequestSerilialiser(many=True, read_only=True)
    listing_latitude = serializers.FloatField(source="donor.latitude", read_only=True)
    listing_longitude = serializers.FloatField(source="donor.longitude", read_only=True)
    cover_image = serializers.ImageField(allow_null=True, required=False)  # Add this field

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
            "cover_image",  # Include the cover image
        ]
        extra_kwargs = {
            "donor": {"read_only": True},
            "created_at": {"read_only": True},
            "special_notes": {"required": False, "allow_blank": True},
        }
