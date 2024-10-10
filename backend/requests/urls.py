from django.urls import path
from .views import *

urlpatterns = [
    # URL pattern to retrieve all requests related to a specific listing
    path(
        "listing/<int:listing_id>/",
        ListingRequestListView.as_view(),
        name="list_request",
    ),
    # URL pattern to retrieve the details of a specific request by its primary key
    path("<int:pk>/", RequestDetailView.as_view(), name="request_detail"),
    # URL pattern to create a new request for a specific listing
    path(
        "listing/<int:listing_id>/create/",
        ListingRequestCreateView.as_view(),
        name="create_request",
    ),
    # URL pattern to retrieve all requests made by the recipient
    path("recipient/", RecipientRequestListView.as_view(), name="recipient_requests"),
]
