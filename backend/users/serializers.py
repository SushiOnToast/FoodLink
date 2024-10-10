from rest_framework import serializers
from .models import User  # Import the User model


# Serializer for user registration
class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer used for user registration.
    It includes fields for creating a new user and handles password hashing.
    """

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
                "write_only": True,  # Password should not be read in responses
            },
        }

    def create(self, validated_data):
        """
        Create a new user instance with a hashed password.
        """
        password = validated_data.pop("password", None)
        user = User(**validated_data)

        if password:
            user.set_password(password)  # Hashes the password

        user.save()

        return user


# Serializer for viewing user profile
class UserSerializer(serializers.ModelSerializer):
    """
    Serializer used for retrieving user profile information.
    """

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
            "profile_picture",
        ]


# Serializer for updating user profile
class UpdateProfileSerializer(serializers.ModelSerializer):
    """
    Serializer used for updating user profile information.
    """

    class Meta:
        model = User
        fields = [
            "first_name",
            "username",
            "email",
            "about",
            "latitude",
            "longitude",
            "profile_picture",
        ]
