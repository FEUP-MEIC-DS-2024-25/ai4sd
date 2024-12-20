"""
URL configuration for settings project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.urls.conf import include
from django.conf.urls.static import static
from django.conf import settings
from .api_router import router
from core.api import views
from django.urls import re_path



urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('core.urls')),
    path('api-auth/', include('rest_framework.urls')),
    path('api/', include(router.urls)),
    path('api/test/secret', views.test_key, name='test_key'),
    re_path(r'^api/repo/(?P<repository_name>[^/]+)/?(?P<path>.*)?$', views.get_repository_tree, name='get_repo'),
    path('api/list_repos/<str:repository_name>', views.list_subfolders, name='get_list_repos'),


]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)