from django.shortcuts import render
from rest_framework import generics
from .models import *
from .serializers import *
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

class CreateListingView(generics.ListCreateAPIView):
    serializer_class = ListingSerialiser
    permission_classes = [isAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Listing.objects.filter(author=user)
    
    def perform_create(self, serializer):
        serializer.save(donor=self.request.user)

class AllListingView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        listings = Listing.objects.all()
        food_types = request.query_params.getList("food_types")

        if food_types:
            listings = listings.filter(food_types__id__in=food_types).distinct()

        serializer = ListingSerialiser(listings, many=True)
        return Response(serializer.data)
    
class ListingDetailView(generics.RetrieveAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerialiser
    permission_classes = [IsAuthenticated]
    lookup_fields = "slug"

class DeleteListingView(generics.DestroyAPIView):
    serializer_class = ListingDetailView
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Listing.objects.filter(donor=user)

class FoodTypeView(generics.ListAPIView):
    queryset = FoodType.objects.all()
    serializer_class = FoodTypeSerialiser
    permission_classes = [IsAuthenticated]