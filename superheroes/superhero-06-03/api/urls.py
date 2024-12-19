# api/urls.py

from django.urls import path
from .views import ReviewView, ReportsView

urlpatterns = [
    path('get-review/', ReviewView.as_view(), name='get-review'),
    path('get-client-reports/', ReportsView.as_view(), name='get-client-reports')
]

