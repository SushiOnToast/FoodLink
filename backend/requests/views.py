from django.shortcuts import get_object_or_404
from .models import *
from rest_framework import generics
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from .serializers import *
from listings.models import Listing
from listings.serializers import ListingSerialiser


class ListingRequestListView(generics.ListAPIView):
    """
    View to retrieve all requests associated with a specific listing.
    """

    permission_classes = [IsAuthenticated]
    serializer_class = RequestSerializer

    def get_queryset(self):
        listing_id = self.kwargs["listing_id"]
        return Request.objects.filter(listing_id=listing_id)


class RequestDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    View to retrieve, update, or delete a specific request by its primary key.
    """

    queryset = Request.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = RequestSerializer


class ListingRequestCreateView(generics.CreateAPIView):
    """
    View to create a new request for a specific listing.
    Checks if the requested quantity is available and reduces the listing quantity accordingly.
    """

    permission_classes = [IsAuthenticated]
    serializer_class = RequestSerializer

    def perform_create(self, serializer):
        listing_id = self.kwargs.get("listing_id")
        listing = get_object_or_404(Listing, id=listing_id)
        recipient = self.request.user

        quantity_requested = serializer.validated_data.get("quantity_requested")

        # Check if the requested quantity is available
        if listing.quantity < quantity_requested:
            raise ValidationError("Requested quantity exceeds available quantity")

        # Reduce the listing quantity
        listing.quantity -= quantity_requested
        listing.save()

        # Save request with listing and recipient
        serializer.save(listing=listing, recipient=recipient)


class DonorListingWithRequestView(generics.ListAPIView):
    """
    View to retrieve all requests made on listings created by the authenticated donor,
    excluding rejected requests.
    """

    serializer_class = RequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        donor_listings = Listing.objects.filter(donor=user)
        return Request.objects.filter(listing__in=donor_listings).exclude(
            status=Request.REJECTED
        )


class RecipientRequestListView(generics.ListAPIView):
    """
    View to retrieve all requests made by the authenticated recipient.
    """

    serializer_class = RequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Filter requests where the recipient is the current user
        return Request.objects.filter(recipient=user)
