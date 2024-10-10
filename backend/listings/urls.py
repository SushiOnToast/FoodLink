from django.urls import path
from .views import *
from requests.views import DonorListingWithRequestView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("", CreateListingView.as_view(), name="create_listing"),
    path("all/", AllListingView.as_view(), name="all_listings"),
    path("food_types/", FoodTypeView.as_view(), name="food_types"),
    path("delete/<int:pk>/", DeleteListingView.as_view(), name="delete_listing"),
    path("<int:pk>/", ListingDetailView.as_view(), name="listing_details"),
    path("requests/", DonorListingWithRequestView.as_view(), name="requests"),
    path("<int:pk>/edit/", UpdateListingView.as_view(), name="edit_listing"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)