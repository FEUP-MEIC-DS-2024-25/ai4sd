from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .utils.ai_interaction import get_chat_history, change_expertise

from . import views

urlpatterns = [
    path("get_content/", views.get_content, name="get_content"),
    path("get_chat_history/", get_chat_history, name="get_chat_history"),
    path("change_expertise/", change_expertise, name="change_expertise"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)