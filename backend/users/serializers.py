from rest_framework import serializers
from .models import *


# serialiser that will be used for registration view
class RegisterSerialiser(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "username",
            "password",
            "email",
            "first_name",
            "role",
            "latitude",
            "longitude",
        ]
        extra_kwargs = {
            "password": {
                "write_only": True,
            },
        }

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        user = User(**validated_data)

        if password:
            user.set_password(password)  # hashes the password

        user.save()

        return user


# serialiser that will be used for profile viewing
class UserSerialiser(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "role",
            "about",
            "latitude",
            "longitude",      
        ]


class UpdateProfileSerialiser(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "first_name",
            "username",
            "email",
            "about",
            "latitude",
            "longitude",
        ]
