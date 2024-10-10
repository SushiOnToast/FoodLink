from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# URL patterns for the Django application
urlpatterns = [
    path('admin/', admin.site.urls),  # Admin interface URL
    path('api/', include('api.urls')),  # Include URLs from the 'api' app
    path("api-auth/", include("rest_framework.urls")),  # Include DRF authentication URLs
]

# Serve media files during development if DEBUG is True
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
