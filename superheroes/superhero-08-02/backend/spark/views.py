from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import login
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404, redirect
from api.services.gemini import geminiAPI
from api.services.github_rest import githubRestAPI
from api.services.github_graphql import GitHubGraphQLAPI
from api.services.miro import MiroAPI
from .forms import MyUserCreationForm, SparkProjectSerializer
from .models import SparkProject, Profile
import requests, json
from django.contrib.auth import authenticate, login
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import logout
from rest_framework.views import APIView
from rest_framework.response import Response

class UserStatusAPIView(APIView):
    def get(self, request):
        if not request.user.is_authenticated:
            return Response({"is_authenticated": False})
        return Response({"is_authenticated": True})

class LogoutAPIView(APIView):
    def post(self, request):
        logout(request)
        return Response({"message": "User logged out successfully."}, status=status.HTTP_200_OK)

class HomeAPIView(APIView):
    def get(self, request):

        projects = []

        if not request.user.is_authenticated:
            return Response({'username': None, 'isAuthenticated': False, 'projects': projects}, status=status.HTTP_200_OK)
 
        profile = request.user.profile
        projects = profile.owned_projects.all()

        return Response({'username': request.user.username, 'isAuthenticated': True, 'projects': SparkProjectSerializer(projects, many=True).data}, status=status.HTTP_200_OK)
    

class ProfileAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, username = None):
        if username:
            user = get_object_or_404(User, username = username)
        else:
            if not request.user.is_authenticated:
                return Response({'error': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)
            user = request.user

        profile = user.profile
        is_own_profile = request.user == user

        return Response({'username': user.username, 'is_own_profile': is_own_profile, 'github_username': profile.github_username, 'github_token': bool(profile.github_token), 'miro_token': bool(profile.miro_token)}, status=status.HTTP_200_OK)
    
    
class LoginAPIView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({'error': 'Username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return Response({'username': user.username, 'isAuthenticated': True, 'message': 'User logged in successfully.'}, status=status.HTTP_200_OK)
        
        return Response({'isAuthenticated':False, 'error': 'Invalid username or password.'}, status=status.HTTP_400_BAD_REQUEST)


class SignupAPIView(APIView):
    def post(self, request):
        form = MyUserCreationForm(data = request.data)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return Response({'success': True, 'message': 'User registered and logged in.'}, status=status.HTTP_201_CREATED)
        
        return Response({'success': False, 'errors': form.errors}, status=status.HTTP_400_BAD_REQUEST)
    

class SparkProjectAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        # Ensure the user is authenticated and a member of the project
        project = get_object_or_404(SparkProject, id=id, members=request.user.profile)

        # Prepare project data for JSON response
        project_data = {
            "id": project.id,
            "name": project.name,
            "description": project.description,
            "github_project_link": project.github_project_link or None,
            "miro_board_id": project.miro_board_id or None,
            "miro_board_link": project.miro_board_url or None,
            "owner": project.owner.user.username,
            "members": [member.user.username for member in project.members.all()],
        }

        return Response(project_data, status=status.HTTP_200_OK)

class CreateSparkProjectAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        if SparkProject.objects.filter(github_project_link=request.data.get('github_project_link')).exists():
            return Response({'errors': 'Project with this GitHub link already exists.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if SparkProject.objects.filter(miro_board_id=request.data.get('miro_board_id')).exists():
            return Response({'errors': 'Project with this Miro board ID already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = SparkProjectSerializer(data=request.data)

        if serializer.is_valid():
            profile = request.user.profile
            project = serializer.save(owner=profile)
            project.members.add(profile)
            return Response({'message': 'Project created successfully.', 'project_id': project.id}, status=status.HTTP_201_CREATED)
        
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    

class DeleteSparkProjectAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, id):
        project = get_object_or_404(SparkProject, id = id, owner = request.user.profile)
        project.delete()
        return Response({'message': 'Project deleted successfully.'}, status=status.HTTP_200_OK)


class AddMemberToSparkProjectAPIView(APIView):
    def post(self, request, project_id):
        username = request.data.get('username')
        project = get_object_or_404(SparkProject, id = project_id, owner = request.user.profile)

        try:
            user = User.objects.get(username = username)
            profile = user.profile
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        if user in project.members.all():
            return Response({'error': 'User is already a member.'}, status=status.HTTP_400_BAD_REQUEST)
        
        project.members.add(profile)
        return Response({'message': 'User added to the project.'}, status=status.HTTP_200_OK)

class GitHubLoginAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        redirect_uri = "http://localhost:8000/github/callback"
        scopes = "repo user admin:org project"
        auth_url, state = githubRestAPI.generate_auth_url(redirect_uri, scopes)
        request.session['github_state'] = state
        return Response({'auth_url': auth_url}, status=status.HTTP_200_OK)
    
class GitHubCallbackAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        code = request.GET.get('code')
        state = request.GET.get('state')

        # Prevent CSRF attacks
        if state != request.session['github_state']:
            return Response({'error': 'Invalid state parameter.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            access_token = githubRestAPI.exchange_code_for_token(code)
        except requests.RequestException:
            return Response({'error': 'Failed to obtain access token.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user_data = githubRestAPI.get_user_data(access_token)
            github_username = user_data.get('login')
        except requests.RequestException:
            return Response({'error': 'Failed to fetch GitHub username.'}, status=status.HTTP_400_BAD_REQUEST)

        profile = request.user.profile
        profile.github_token = access_token
        profile.github_username = github_username
        profile.save()

        frontend_url = "http://localhost:3000/profile"
        return redirect(frontend_url)


class CheckGitHubTokenValidityAPIView(APIView):
    def get(self, request):
        profile = request.user.profile
        access_token = profile.github_token

        if not access_token:
            return Response({'error': 'No GitHub account linked.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            if githubRestAPI.check_token(access_token):
                return Response({'message': 'GitHub token is valid.'}, status=status.HTTP_200_OK)
            
            return Response({'error': 'GitHub token is invalid.'}, status=status.HTTP_400_BAD_REQUEST)
        
        except requests.RequestException:
            return Response({'error': 'Error while checking GitHub token.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GitHubUnlinkAPIView(APIView):
    def post(self, request):
        profile = request.user.profile
        access_token = profile.github_token

        if not access_token:
            return Response({'error': 'No GitHub account linked.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            if not githubRestAPI.check_token(access_token) or githubRestAPI.revoke_token(access_token):
                profile.github_token = None
                profile.github_username = None
                profile.save()
                return Response({'message': 'GitHub account unlinked successfully.'}, status=status.HTTP_200_OK)
            
            return Response({'error': 'Failed to unlink GitHub account.'}, status=status.HTTP_400_BAD_REQUEST)
        
        except requests.RequestException:
            return Response({'error': 'Error while revoking GitHub token.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AddGitHubUsernameAPIView(APIView):
    def post(self, request):
        github_username = request.data.get('github_username')

        if github_username:
            profile = request.user.profile
            profile.github_username = github_username
            profile.save()

            return Response({'message': 'GitHub username added successfully.'}, status=status.HTTP_200_OK)

        return Response({'error': 'GitHub username is required.'}, status=status.HTTP_400_BAD_REQUEST)


class AddGitHubTokenAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        github_token = request.data.get('github_token')

        if github_token:
            profile = request.user.profile
            profile.github_token = github_token
            profile.save()

            return Response({'message': 'GitHub token added successfully.'}, status=status.HTTP_200_OK)

        return Response({'error': 'GitHub token is required.'}, status=status.HTTP_400_BAD_REQUEST)


class AddMiroTokenToProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        miro_token = request.data.get('miro_token')

        if miro_token:
            profile = request.user.profile
            profile.miro_token = miro_token
            profile.save()

            return Response({'message': 'Miro token added successfully.'}, status=status.HTTP_200_OK)

        return Response({'error': 'Miro token is required.'}, status=status.HTTP_400_BAD_REQUEST)
    

class DeleteMiroTokenFromProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        profile = request.user.profile
        profile.miro_token = None
        profile.save()

        return Response({'message': 'Miro token deleted successfully.'}, status=status.HTTP_200_OK)


class AddMiroBoardIdToSparkProjectAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, project_id):
        miro_board_id = request.data.get('miro_board_id')
        project = get_object_or_404(SparkProject, id = project_id, owner = request.user.profile)

        if miro_board_id:
            project.miro_board_id = miro_board_id
            project.save()

        return Response({'message': 'Miro board ID added successfully.'}, status=status.HTTP_200_OK)
    
class BacklogToMiroAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, project_id):
        project = get_object_or_404(SparkProject, id = project_id, owner = request.user.profile)
        miro_token = request.user.profile.miro_token
        miro_board_id = project.miro_board_id
        github_token = request.user.profile.github_token

        if not miro_token:
            print("Miro token is required.")
            return Response({'error': 'Miro token is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not miro_board_id:
            print("Miro board ID is required.")
            return Response({'error': 'Miro board ID is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not github_token:
            print("GitHub token is required.")
            return Response({'error': 'GitHub token is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        miro_api = MiroAPI(miro_token)
        github_graphql = GitHubGraphQLAPI(github_token)
        github_project_data = github_graphql.get_project_data("PVT_kwDOCtw04M4Ap0aW") # Hardcoded project ID
        project_data_prompt = json.dumps(github_project_data)
        
        prompt = (
            "Based on the provided project data, " + project_data_prompt + """\n
            Consider only the tasks currently in the 'Product Backlog' status.
            Identify the tasks that should be moved to the 'Iteration Backlog' for the upcoming iteration, prioritizing tasks with the highest impact.
            Leave tasks not selected in their current status and do not modify their position.
            Provide the response in a Python list with the names of all the tasks in the backlog. 
            Additionally, provide two more Python lists with the priorities of the tasks and their sizes for all the tasks in the backlog in the same order.
            Finally, provide one more Python list with the names of the tasks that should be moved to the 'Iteration Backlog'.
            Don't give an explanation, just the lists.
            """
        )   

        gemini_response = geminiAPI.prompt_gemini(prompt)
        miro_api.backlogToMiro(miro_board_id, gemini_response)

        project.github_project_data = github_project_data
        project.save()

        return Response({'message': 'Product backlog moved to Miro successfully.'}, status=status.HTTP_200_OK)
        

class SprintInMiroAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, project_id):
        project = get_object_or_404(SparkProject, id = project_id, owner = request.user.profile)
        miro_token = request.user.profile.miro_token
        miro_board_id = project.miro_board_id

        if not miro_token:
            return Response({'error': 'Miro token is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not miro_board_id:
            return Response({'error': 'Miro board ID is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        miro_api = MiroAPI(miro_token)
        miro_api.sprintInMiro(miro_board_id)

        return Response({'message': 'Sprint in Miro started successfully.'}, status=status.HTTP_200_OK)

class SprintToGitHubAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, project_id):
        project = get_object_or_404(SparkProject, id = project_id, owner = request.user.profile)
        github_token = request.user.profile.github_token
        miro_token = request.user.profile.miro_token

        if not github_token:
            return Response({'error': 'GitHub token is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not project.github_project_link:
            return Response({'error': 'GitHub project link is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not project.miro_board_id:
            return Response({'error': 'Miro board ID is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not miro_token:
            return Response({'error': 'Miro token is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        miroAPI = MiroAPI(request.user.profile.miro_token)
        github_grapqhl = GitHubGraphQLAPI(github_token)
        iteration_tasks, priority_tasks, size_tasks = miroAPI.sprintToGitHub(project.miro_board_id)
        github_grapqhl.update_tasks_to_iteration_backlog(project.github_project_data, iteration_tasks, priority_tasks, size_tasks)

        return Response({'message': 'Sprint in GitHub started successfully.'}, status=status.HTTP_200_OK)
    
def handler404(request, exception):
    return JsonResponse({'error': 'Page not found.', "status_code": 404}, status=404)