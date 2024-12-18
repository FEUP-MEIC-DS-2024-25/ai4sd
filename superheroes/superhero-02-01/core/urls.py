from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_project, name='create_project'),
    path('diagram/<int:project_id>/', views.view_project, name='view_project'),
    path('diagram/<int:project_id>/edit/', views.edit_project, name='edit_project'),
    path('diagram/<int:project_id>/delete/', views.delete_project, name='delete_project'),
    path('projects/', views.list_projects, name='list_projects'),

]
