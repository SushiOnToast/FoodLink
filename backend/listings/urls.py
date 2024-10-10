from django.urls import path
from .views import *
from requests.views import DonorListingWithRequestView
from django.conf import settings
from django.conf.urls.static import static

# URL patterns for the listings app
urlpatterns = [
    # Route for creating a new listing
    path("", CreateListingView.as_view(), name="create_listing"),
    # Route for retrieving all listings
    path("all/", AllListingView.as_view(), name="all_listings"),
    # Route for retrieving food types
    path("food_types/", FoodTypeView.as_view(), name="food_types"),
    # Route for deleting a specific listing by primary key (pk)
    path("delete/<int:pk>/", DeleteListingView.as_view(), name="delete_listing"),
    # Route for retrieving details of a specific listing by primary key (pk)
    path("<int:pk>/", ListingDetailView.as_view(), name="listing_details"),
    # Route for retrieving donor listings with requests
    path("requests/", DonorListingWithRequestView.as_view(), name="requests"),
    # Route for editing a specific listing by primary key (pk)
    path("<int:pk>/edit/", UpdateListingView.as_view(), name="edit_listing"),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
