from django.urls import path
from .views import *

urlpatterns = [
    path("", AllResourceView.as_view(), name="all_resources"),  # List all resources
    path(
        "create/", CreateResourceView.as_view(), name="create_resource"
    ),  # Create a new resource
    path(
        "<int:pk>/", ResourceDetailView.as_view(), name="resource_detail"
    ),  # Retrieve a specific resource
    path(
        "<int:pk>/edit/", UpdateResourceView.as_view(), name="edit_resource"
    ),  # Edit a specific resource
    path(
        "<int:pk>/delete/", DeleteResourceView.as_view(), name="delete_resource"
    ),  # Delete a specific resource
    path(
        "categories/", CategoryView.as_view(), name="categories"
    ),  # List all categories
]
