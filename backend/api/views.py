import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(["GET"])
def get_directions(request):
    # extracting parameters from the request
    origin_lat = request.query_params.get("origin_lat")
    origin_lon = request.query_params.get("origin_lon")
    destination_lat = request.query_params.get("destination_lat")
    destination_lon = request.query_params.get("destination_lon")

    # Mapbox directions API url
    url = url = f"https://api.mapbox.com/directions/v5/mapbox/driving/{origin_lon},{origin_lat};{destination_lon},{destination_lat}"

    params = {
        "access_token": "pk.eyJ1Ijoic3VzaGlvbnRvYXN0IiwiYSI6ImNtMW0wM2VnazBoOWMycHF0NGhwdGk4OXIifQ.mfTvxz6r8ESIZCKVibTTJQ",
        "geometries": "geojson",
        "steps": "true",
        "unit": "metric",
    }

    response = requests.get(url, params=params)

    if response.status_code == 200:
        return Response(response.json, status=status.HTTP_200_OK)
    else:
        return Response(response.json, status=response.status_code)
    
    
    