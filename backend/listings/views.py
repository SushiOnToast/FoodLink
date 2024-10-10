from django.shortcuts import render
from rest_framework import generics
from .models import *
from .serializers import *
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


class CreateListingView(generics.ListCreateAPIView):
    """View for creating a new listing."""

    serializer_class = ListingSerialiser
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Return listings associated with the authenticated user
        user = self.request.user
        return Listing.objects.filter(donor=user)

    def perform_create(self, serializer):
        # Save the listing with the authenticated user as the donor
        serializer.save(donor=self.request.user)


class AllListingView(generics.ListAPIView):
    """View for retrieving all listings, optionally filtered by food types."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get the list of food type IDs from the query parameters
        food_types = request.query_params.getlist("food_types")
        listings = Listing.objects.all()

        # Filter listings based on selected food types if provided
        if food_types:
            listings = listings.filter(food_types__id__in=food_types).distinct()

        # Serialize and return the listings
        serializer = ListingSerialiser(listings, many=True)
        return Response(serializer.data)


class ListingDetailView(generics.RetrieveAPIView):
    """View for retrieving the details of a specific listing."""

    queryset = Listing.objects.all()
    serializer_class = ListingSerialiser
    permission_classes = [IsAuthenticated]


class DeleteListingView(generics.DestroyAPIView):
    """View for deleting a specific listing."""

    serializer_class = ListingSerialiser
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Return listings associated with the authenticated user
        user = self.request.user
        return Listing.objects.filter(donor=user)


class UpdateListingView(generics.UpdateAPIView):
    """View for updating a specific listing."""

    serializer_class = UpdateListingSerialiser
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Return listings associated with the authenticated user
        user = self.request.user
        return Listing.objects.filter(donor=user)


class FoodTypeView(generics.ListAPIView):
    """View for retrieving all food types."""

    queryset = FoodType.objects.all()
    serializer_class = FoodTypeSerialiser
    permission_classes = [IsAuthenticated]
