"""
URL configuration for spark project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('api/', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('api/', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('api/blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from .views import *
from django.urls import path, include
import debug_toolbar

urlpatterns = [
    path('', HomeAPIView.as_view(), name='home'),
    path('admin/', admin.site.urls),
    path('__debug__/', include('debug_toolbar.urls')),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('logout/', LogoutAPIView.as_view(), name='logout'),
    path('user-status/', UserStatusAPIView.as_view(), name='user-status'),
    path('signup/', SignupAPIView.as_view(), name='signup'),
    path('profile/', ProfileAPIView.as_view(), name='profile-redirect'),
    path('profile/<str:username>/', ProfileAPIView.as_view(), name='profile'),
    path('add-github-username/', AddGitHubUsernameAPIView.as_view(), name='add-github-username'),
    path('github/login/', GitHubLoginAPIView.as_view(), name='github-login'),
    path('github/callback/', GitHubCallbackAPIView.as_view(), name='github-callback'),
    path('github/unlink/', GitHubUnlinkAPIView.as_view(), name='github-unlink'),
    path('miro/add-token/', AddMiroTokenToProfileAPIView.as_view(), name='add-miro-token-to-profile'),
    path('miro/delete-token/', DeleteMiroTokenFromProfileAPIView.as_view(), name='delete-miro-token-from-profile'),
    path('spark/create/', CreateSparkProjectAPIView.as_view(), name='create-spark-project'),
    path('spark/<int:id>/', SparkProjectAPIView.as_view(), name='spark-project'),
    path('spark/<int:id>/delete/', DeleteSparkProjectAPIView.as_view(), name='delete-spark-project'),
    path('spark/<int:project_id>/add-member/', AddMemberToSparkProjectAPIView.as_view(), name='add-member-to-spark-project'),
    path('spark/<int:project_id>/add-miro-board-id/', AddMiroBoardIdToSparkProjectAPIView.as_view(), name='add-miro-board-id-to-spark-project'),
]

handler404 = 'spark.views.handler404'