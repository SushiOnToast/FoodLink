from django.db import models
from users.models import User


class Category(models.Model):
    """
    Model representing a category for resources.
    """

    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Resource(models.Model):
    """
    Model representing a resource created by a user.
    Contains fields for title, content, author, categories, and creation date.
    """

    title = models.CharField(max_length=255)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    categories = models.ManyToManyField(Category)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
