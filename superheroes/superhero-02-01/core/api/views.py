from rest_framework.decorators import action
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from core.models import Project
from core.api.serializer import ProjectSerializer
from core.forms import ProjectForm, ProjectEditForm

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    @action(detail=False, methods=['post'])
    def create_project(self, request):
        form = ProjectForm(request.POST)
        if form.is_valid():
            form.save()
            return Response({'status': 'Project created'}, status=status.HTTP_201_CREATED)
        else:
            return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)


    @action(detail=True, methods=['post'])
    def edit_project(self, request, pk=None):
        project = self.get_object()
        form = ProjectEditForm(request.POST, instance=project)
        if form.is_valid():
            form.save()
            return Response({'status': 'Project updated'}, status=status.HTTP_200_OK)
        else:
            return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)
