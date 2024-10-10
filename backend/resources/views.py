from rest_framework import generics
from .models import *
from .serializers import *
from rest_framework.permissions import IsAuthenticated

class CreateResourceView(generics.ListCreateAPIView):
    serializer_class = ResourceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Resource.objects.filter(author=self.request.user)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class AllResourceView(generics.ListAPIView):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        category_ids = self.request.query_params.getlist('categories[]')  # Get the list of category IDs
        if category_ids:
            queryset = queryset.filter(categories__id__in=category_ids).distinct()
        return queryset

class ResourceDetailView(generics.RetrieveAPIView):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    permission_classes = [IsAuthenticated]

class UpdateResourceView(generics.UpdateAPIView):
    serializer_class = ResourceUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Resource.objects.filter(author=self.request.user)

class DeleteResourceView(generics.DestroyAPIView):
    serializer_class = ResourceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Resource.objects.filter(author=self.request.user)


class CategoryView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]