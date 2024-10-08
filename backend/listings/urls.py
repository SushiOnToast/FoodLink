from django.urls import path
from .views import *
from requests.views import DonorListingWithRequestView

urlpatterns = [
    path("", CreateListingView.as_view(), name="create_listing"),
    path("all/", AllListingView.as_view(), name="all_listings"),
    path("food_types/", FoodTypeView.as_view(), name="food_types"),
    path("delete/<int:pk>/", DeleteListingView.as_view(), name="delete_listing"),
    path("<int:pk>/", ListingDetailView.as_view(), name="listing_details"),
    path("requests/", DonorListingWithRequestView.as_view(), name="requests"),
]