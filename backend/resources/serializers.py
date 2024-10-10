from rest_framework import serializers
from .models import Resource, Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class ResourceSerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source="author.username")
    category_ids = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="categories",
        many=True,
        write_only=True
    )
    categories = CategorySerializer(many=True, read_only=True)

    class Meta:
        model = Resource
        fields = ['id', 'title', 'content', 'author', 'author_username', 'categories', 'category_ids', 'created_at']
        extra_kwargs = {'author': {'read_only': True}}

class ResourceUpdateSerializer(serializers.ModelSerializer):
    category_ids = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="categories",
        many=True,
        write_only=True
    )
    categories = CategorySerializer(many=True, read_only=True)

    class Meta:
        model = Resource
        fields = [
            "title",
            "content",
            "categories",
            "category_ids",
        ]