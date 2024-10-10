from rest_framework import generics
from .models import *
from .serializers import *
from rest_framework.permissions import IsAuthenticated


class CreateResourceView(generics.ListCreateAPIView):
    """
    View to create a new resource. Only authenticated users can create resources.
    The author of the resource is automatically set to the current user.
    """

    serializer_class = ResourceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Return resources authored by the current user
        return Resource.objects.filter(author=self.request.user)

    def perform_create(self, serializer):
        # Save the resource with the current user as the author
        serializer.save(author=self.request.user)


class AllResourceView(generics.ListAPIView):
    """
    View to list all resources. Only authenticated users can access this view.
    Resources can be filtered by category IDs passed as query parameters.
    """

    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Retrieve all resources and filter by category IDs if provided
        queryset = super().get_queryset()
        category_ids = self.request.query_params.getlist(
            "categories[]"
        )  # Get the list of category IDs
        if category_ids:
            # Filter resources that belong to the specified categories
            queryset = queryset.filter(categories__id__in=category_ids).distinct()
        return queryset


class ResourceDetailView(generics.RetrieveAPIView):
    """
    View to retrieve the details of a specific resource. Only authenticated users can access this view.
    """

    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    permission_classes = [IsAuthenticated]


class UpdateResourceView(generics.UpdateAPIView):
    """
    View to update an existing resource. Only authenticated users can update their own resources.
    """

    serializer_class = ResourceUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Return resources authored by the current user for update
        return Resource.objects.filter(author=self.request.user)


class DeleteResourceView(generics.DestroyAPIView):
    """
    View to delete an existing resource. Only authenticated users can delete their own resources.
    """

    serializer_class = ResourceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Return resources authored by the current user for deletion
        return Resource.objects.filter(author=self.request.user)


class CategoryView(generics.ListAPIView):
    """
    View to list all categories. Only authenticated users can access this view.
    """

    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
