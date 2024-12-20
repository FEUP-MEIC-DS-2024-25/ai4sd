from django.urls import path
from .views import evaluate_code, export_evaluation

urlpatterns = [
    path('prompt', evaluate_code, name='evaluate_code'),
    path('export-evaluation', export_evaluation, name='export_evaluation'),
]
