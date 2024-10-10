from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom serializer for obtaining JWT tokens, extending the default
    TokenObtainPairSerializer to include additional user information in the token.
    """

    @classmethod
    def get_token(cls, user):
        """
        Generates a new token for the given user, adding custom claims.

        Args:
            user: The user instance for which the token is being generated.

        Returns:
            Token: A JWT token with custom claims.
        """
        token = super().get_token(user)

        # Add custom claims to the token
        token["role"] = user.role  # Include the user's role in the token

        return token


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Custom view for obtaining JWT tokens, using the custom serializer to include
    additional claims in the generated token.
    """

    # Specify the custom serializer class
    serializer_class = CustomTokenObtainPairSerializer
