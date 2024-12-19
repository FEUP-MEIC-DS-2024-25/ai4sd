# api/urls.py

from django.urls import path
from .views import ReviewView

urlpatterns = [
    path('get-review/', ReviewView.as_view(), name='get-review'),
]

