from rest_framework.decorators import action
from rest_framework import viewsets
from rest_framework import status
from core.models import Project
from core.api.serializer import ProjectSerializer
from core.forms import ProjectForm, ProjectEditForm
from google.cloud import secretmanager
from google.cloud import storage
from rest_framework.decorators import api_view
from rest_framework.response import Response
from ..parser import parser_code

import logging

logger = logging.getLogger(__name__)

# Instantiates a client
storage_client = storage.Client()

# The name for the new bucket
bucket_name = "hero-alliance-nexus"

class TreeNode:
    def __init__(self, name, is_file=False):
        self.name = name
        self.is_file = is_file
        self.children = {}

    def to_dict(self):
        if self.is_file:
            return self.name
        return {
            name: child.to_dict()
            for name, child in sorted(self.children.items())
        }

    def to_markdown(self, level=0):
        indent = '  ' * level
        if self.is_file:
            return f"{indent}- {self.name}\n"
        markdown = f"{indent}- {self.name}/\n"
        for child in sorted(self.children.values(), key=lambda x: x.name):
            markdown += child.to_markdown(level + 1)
        return markdown


def build_tree(blobs):
    root = TreeNode("")

    for blob in blobs:
        path_parts = blob.name.split('/')
        current = root

        # Handle each part of the path
        for i, part in enumerate(path_parts):
            is_file = (i == len(path_parts) - 1)

            if part not in current.children:
                current.children[part] = TreeNode(part, is_file)

            current = current.children[part]

    return root



class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    @action(detail=False, methods=['post'])
    def create_project(self, request):
        form = ProjectForm(request.POST)
        if form.is_valid():
            project = form.save()
            return Response({'status': 'Project created', 'id': project.id}, status=status.HTTP_201_CREATED)
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


@api_view(['GET'])
def test_key(request):
    def access_secret_version(version_id="latest"):
        try:
            client = secretmanager.SecretManagerServiceClient()
            name = f"projects/hero-alliance-feup-ds-24-25/secrets/superhero-02-01-secret/versions/latest"
            response = client.access_secret_version(request={"name": name})
            payload = response.payload.data.decode("UTF-8")
            print(f"Success accessing secret {name}")
            return payload
        except Exception as e:
            print(f"Error accessing secret version: {e}")
            return "teste"

    try:
        OPENAI_API_KEY = access_secret_version()
    except Exception as e:
        print(f"Error setting OPENAI_API_KEY: {e}")
        OPENAI_API_KEY = "teste"

    if OPENAI_API_KEY == "teste":
        return Response({'status': 'Key is set as teste'}, status=status.HTTP_400_BAD_REQUEST)
    elif OPENAI_API_KEY and OPENAI_API_KEY != "teste":
        return Response({'status': 'Key is valid and set'}, status=status.HTTP_200_OK)
    else:
        return Response({'status': 'Key is not set'}, status=status.HTTP_400_BAD_REQUEST)


import mimetypes

# Define allowed file extensions for text/code files
ALLOWED_EXTENSIONS = {
    '.py', '.js', '.html', '.css', '.txt', '.md', '.json', '.xml', '.yml', '.yaml', '.sh'
}

@api_view(['GET'])
def get_repository_tree(request, repository_name, path=""):
    try:
        # Initialize the storage client
        storage_client = storage.Client()
        bucket = storage_client.bucket("hero-alliance-nexus")

        # Properly handle the path to avoid trailing slashes issues
        if path:
            full_path = f"{repository_name}/{path}".rstrip('/')
        else:
            full_path = f"{repository_name}".rstrip('/')

        # List all blobs with the repository prefix
        blobs = bucket.list_blobs(prefix=full_path + '/')

        # Function to recursively build the tree structure
        def build_tree(blobs):
            tree = {}
            for blob in blobs:
                parts = blob.name[len(full_path) + 1:].split('/')  # Extract relative path parts
                current = tree
                for part in parts[:-1]:  # Traverse or create folders
                    current = current.setdefault(part, {})
                if parts[-1]:  # Add file content if allowed
                    file_extension = f".{parts[-1].split('.')[-1]}"  # Get the file extension
                    if file_extension in ALLOWED_EXTENSIONS:
                        try:
                            current[parts[-1]] = blob.download_as_text()  # Get text content
                        except Exception:
                            current[parts[-1]] = "Error reading content as text"
            return tree

        # Build the tree structure
        tree = build_tree(blobs)

        # If the tree is empty, return an error
        if not tree:
            return Response({
                'error': f'Repository "{repository_name}" not found or empty'
            }, status=404)

        # Return the tree structure
        return Response(tree, status=200)

    except Exception as e:
        return Response({
            'error': f'Error retrieving repository tree: {str(e)}'
        }, status=500)




@api_view(['GET'])
def list_subfolders(request, repository_name):
    try:
        # Initialize the storage client
        storage_client = storage.Client()
        bucket = storage_client.bucket("hero-alliance-nexus")

        # List all blobs with the repository prefix
        blobs = bucket.list_blobs(prefix=f"{repository_name}/")

        # Extract unique subfolder names
        subfolders = set()
        for blob in blobs:
            # Remove the repository name prefix and get the next folder level
            relative_path = blob.name[len(repository_name) + 1:]
            if '/' in relative_path:
                subfolder = relative_path.split('/')[0]
                subfolders.add(subfolder)

        # Return the sorted list of subfolder names
        return Response({'subfolders': sorted(subfolders)}, status=200)

    except Exception as e:
        return Response({'error': f"Error listing subfolders: {str(e)}"}, status=500)



@api_view(['GET'])
def get_prompt(request, repository_name):
    try:
        # Call the parser_code function with the repository name
        result = parser_code(repository_name)

        # Return the processed data
        if result:
            return Response(result, status=200)
        else:
            return Response({"error": "Failed to process repository data."}, status=500)

    except Exception as e:
        return Response({"error": f"Unexpected error: {str(e)}"}, status=500)