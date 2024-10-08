from django.urls import path
from .views import *

urlpatterns = [
    path("listing/<int:listing_id>/", ListingRequestListView.as_view(), name="list_request"),
    path("<int:pk>/", RequestDetailView.as_view(), name="request_detail"),
    path("listing/<int:listing_id>/create", ListingRequestCreateView.as_view(), name="create_request"),
    path("recipient/", RecipientRequestListView.as_view(), name="recipient_requests"),
]