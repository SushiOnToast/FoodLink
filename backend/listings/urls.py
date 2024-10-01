from django.urls import path
from .views import *

urlpatterns = [
    path("", CreateListingView.as_view(), name="create_listing"),
    path("all/", AllListingView.as_view(), name="all_listings"),
    path("food_types/", FoodTypeView.as_view(), name="food_types"),
    path("<slug:slug>", ListingDetailView.as_view(), name="listing_details"),
    path("delete/<int:pk>/", DeleteListingView.as_view(), name="delete_listing"),
]