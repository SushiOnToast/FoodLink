from django.shortcuts import render
from .models import *
from rest_framework import generics
from .serializers import *

class RequestListCreateView(generics.ListCreateAPIView):
    queryset = Request.objects.all()
    serializer_class = RequestSerilialiser

    class RequestDetailView(generics.RetrieveUpdateDestroyAPIView):
        queryset = Request.objects.all()
        serializer_class = RequestSerilialiser

