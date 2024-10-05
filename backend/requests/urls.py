from django.urls import path
from .views import *

urlpatterns = [
    path("", RequestListCreateView.as_view(), name="request-list-create"),
]