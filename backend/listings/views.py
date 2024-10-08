from django.shortcuts import render
from rest_framework import generics
from .models import *
from .serializers import *
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response


class CreateListingView(generics.ListCreateAPIView):
    serializer_class = ListingSerialiser
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Listing.objects.filter(donor=user)

    def perform_create(self, serializer):
        serializer.save(donor=self.request.user)


class AllListingView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        food_types = request.query_params.getlist("food_types")
        listings = Listing.objects.all()

        if food_types:
            listings = listings.filter(food_types__id__in=food_types).distinct()

        serializer = ListingSerialiser(listings, many=True)
        return Response(serializer.data)


class ListingDetailView(generics.RetrieveAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerialiser
    permission_classes = [IsAuthenticated]


class DeleteListingView(generics.DestroyAPIView):
    serializer_class = ListingSerialiser
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Listing.objects.filter(donor=user)


class FoodTypeView(generics.ListAPIView):
    queryset = FoodType.objects.all()
    serializer_class = FoodTypeSerialiser
    permission_classes = [IsAuthenticated]
