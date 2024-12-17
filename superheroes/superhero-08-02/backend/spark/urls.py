"""
URL configuration for spark project.

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
from .views import HomeAPIView
from django.contrib.auth import views as auth_views
from django.urls import path, include
from spark import views
import debug_toolbar

urlpatterns = [
    path('api/home/', HomeAPIView.as_view(), name='api-home'),
    path('', views.home_view, name='home'),
    path('admin/', admin.site.urls),
    path('__debug__/', include('debug_toolbar.urls')),
    path('accounts/login/', views.login_view, name='login'),
    path('accounts/logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('accounts/signup/', views.signup_view, name='signup'),
    path('profile/', views.profile_redirect, name='profile_redirect'),
    path('profile/<str:username>/', views.profile_view, name='profile'),
    path('add_github_username/', views.add_github_username, name='add_github_username'),
    path('github/login/', views.github_login, name='github_login'),
    path('github/callback/', views.github_callback, name='github_callback'),
    path('github/unlink/', views.github_unlink, name='github_unlink'),
    path('miro/add_token/', views.add_miro_token_to_profile, name='add_miro_token_to_profile'),
    path('miro/delete_token/', views.delete_miro_token, name='delete_miro_token'),
    path('spark/create/', views.create_spark_project, name='create_spark_project'),
    path('spark/<int:id>/', views.spark_project_view, name='spark_project_view'),
    path('spark/<int:id>/delete/', views.delete_spark_project, name='delete_spark_project'),
    path('spark/<int:project_id>/add_member/', views.add_member_to_spark_project, name='add_member_to_spark_project'),
    path('spark/<int:project_id>/add_miro_board_id/', views.add_miro_board_id_to_spark_project, name='add_miro_board_id_to_spark_project'),
]

handler404 = 'spark.views.handler404'