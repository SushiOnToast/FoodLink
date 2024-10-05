from rest_framework import serializers
from .models import *

class RequestSerilialiser(serializers.ModelSerializer):
    class Meta:
        model = Request
        fields = "__all__"