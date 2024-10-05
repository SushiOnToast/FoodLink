from rest_framework import serializers
from .models import *

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
        ]
        extra_kwargs = {
            "donor": {"read_only": True},
            "created_at": {"read_only": True},
            "special_notes": {"required": False, "allow_blank": True},  
        }
