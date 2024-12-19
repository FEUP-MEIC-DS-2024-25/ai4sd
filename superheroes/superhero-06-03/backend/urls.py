from django.contrib import admin
from django.urls import path, include
from api.views import ReviewView
from api.api_router import APIRouter

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),  # Include the API app's URLs
    path('', APIRouter.as_view())
]
