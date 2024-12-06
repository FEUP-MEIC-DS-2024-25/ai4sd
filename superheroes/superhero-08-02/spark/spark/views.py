from django.shortcuts import render
from django.shortcuts import redirect
from django.contrib import messages
from django.contrib.auth import login
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods as require
from api.services.github_rest import githubRestAPI
from api.services.github_graphql import GitHubGraphQLAPI
from .forms import MyUserCreationForm, MyAuthenticationForm, SparkProjectForm
from .models import SparkProject
import requests

def home_view(request):
    projects = []
    spark_projects = []

    if (request.user.is_authenticated):
        profile = request.user.profile

        spark_projects = profile.owned_projects.all()

        api = GitHubGraphQLAPI(profile.github_token)
        # projects = api.get_organization_projects('FEUP-MEIC-DS-2024-25')
        # projects += api.get_user_projects(profile.github_username)
        projects = api.get_project('PVT_kwDOCtw04M4Ap0aW')
        print(projects)

    return render(request, 'home.html', {'projects': projects, 'spark_projects': spark_projects})

@login_required
def profile_redirect(request):
    return redirect('profile', request.user.username)

@login_required
def profile_view(request, username):

    user = get_object_or_404(User, username = username)
    profile = user.profile

    is_own_profile = request.user == user

    return render(request, 'account/profile.html', {'profile': profile, 'is_own_profile': is_own_profile, 'user': user})

@require(['GET', 'POST'])
def login_view(request):
    if request.method == 'POST':
        form = MyAuthenticationForm(data = request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('home')
    else:
        form = MyAuthenticationForm()

    return render(request, 'account/login.html', {'form': form})

@require(['GET', 'POST'])
def signup_view(request):

    if request.method == 'POST':
        form = MyUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('home')
    else:
        form = MyUserCreationForm()
        
    return render(request, 'account/signup.html', {'form': form})

def spark_project_view(request, id):
    project = get_object_or_404(SparkProject, id = id, members = request.user.profile)

    return render(request, 'spark/project.html', {'project': project})

@login_required
@require(['GET', 'POST'])
def create_spark_project(request):
    form = SparkProjectForm(request.POST)

    if form.is_valid():
        project = form.save(commit = False)
        project.owner = request.user.profile
        project.save()
        project.members.add(request.user.profile)
        return redirect('spark_project_view', project.id)

    return render(request, 'spark/create.html', {'form': form})

@login_required
@require(['POST'])
def delete_spark_project(request, id):
    project = get_object_or_404(SparkProject, id = id, owner = request.user.profile)
    
    if project.owner == request.user.profile:
        project.delete()

    return redirect('home')

@login_required
@require(['POST'])
def add_member_to_spark_project(request, project_id):

    if request.method == 'POST':
        username = request.POST.get('username')
        project = get_object_or_404(SparkProject, id = project_id, owner = request.user.profile)

        try:
            user = User.objects.get(username = username)
            profile = user.profile
        except User.DoesNotExist:
            messages.error(request, 'User not found.')
            return redirect('spark_project_view', project_id)
        
        if user in project.members.all():
            messages.error(request, 'User is already a member.')
            return redirect('spark_project_view', project_id)
        
        project.members.add(profile)
        return redirect('spark_project_view', project_id)
    
    return redirect('home')

@login_required
def github_login(request):

    redirect_uri = 'http://localhost:8000/github/callback'
    scopes = "repo user admin:org project"
    auth_url, state = githubRestAPI.generate_auth_url(redirect_uri, scopes)

    request.session['github_state'] = state

    return redirect(auth_url)

@login_required
def github_callback(request):
    code = request.GET.get('code')
    state = request.GET.get('state')

    # Prevent CSRF attacks
    if state != request.session['github_state']:
        print(state, request.session['github_state'])
        messages.error(request, 'Invalid state parameter.')
        return redirect('profile_redirect')
    
    try:
        access_token = githubRestAPI.exchange_code_for_token(code)
    except requests.RequestException:
        messages.error(request, 'Failed to obtain access token.')
        return redirect('profile_redirect')

    try:
        user_data = githubRestAPI.get_user_data(access_token)
        github_username = user_data.get('login')
    except requests.RequestException:
        messages.error(request, 'Failed to fetch GitHub username.')
        return redirect('profile_redirect')

    profile = request.user.profile
    profile.github_token = access_token
    profile.github_username = github_username
    profile.save()

    return redirect('profile_redirect')

@login_required
def check_github_token_validity(request):
    profile = request.user.profile
    access_token = profile.github_token

    if not access_token:
        messages.error(request, 'No GitHub account linked.')
        return redirect('profile_redirect')
    
    try:
        if githubRestAPI.check_token(access_token):
            messages.success(request, 'GitHub token is valid.')
        else:
            messages.error(request, 'GitHub token is invalid.')
    except requests.RequestException:
        messages.error(request, 'Error while checking GitHub token.')

    return redirect('profile_redirect')

@login_required
def github_unlink(request):
    profile = request.user.profile
    access_token = profile.github_token

    if not access_token:
        messages.error(request, 'No GitHub account linked.')
        return redirect('profile_redirect')
    
    try:
        if not githubRestAPI.check_token(access_token) or githubRestAPI.revoke_token(access_token):
            profile.github_token = None
            profile.github_username = None
            profile.save()
            messages.success(request, 'GitHub account unlinked.')
        else:
            messages.error(request, 'Failed to unlink GitHub account.')
    except requests.RequestException:
        messages.error(request, 'Error while revoking GitHub token.')

    return redirect('profile_redirect')
    

@login_required
@require(['POST'])
def add_github_username(request):
    github_username = request.POST.get('github_username')

    if github_username:
        profile = request.user.profile
        profile.github_username = github_username
        profile.save()

    return redirect('home')

@login_required
@require(['POST'])
def add_github_token(request):
    github_token = request.POST.get('github_token')

    if github_token:
        profile = request.user.profile
        profile.github_token = github_token
        profile.save()

    return redirect('home')

@login_required
@require(['POST'])
def add_miro_token_to_profile(request):
    miro_token = request.POST.get('miro_token')

    if miro_token:
        profile = request.user.profile
        profile.miro_token = miro_token
        profile.save()

    return redirect('profile_redirect')

@login_required
@require(['POST'])
def add_miro_board_id_to_spark_project(request, project_id):
    miro_board_id = request.POST.get('miro_board_id')
    project = get_object_or_404(SparkProject, id = project_id, owner = request.user.profile)

    if miro_board_id:
        project.miro_board_id = miro_board_id
        project.save()

    return redirect('spark_project_view', project_id)

@login_required
@require(['POST'])
def delete_miro_token(request):
    profile = request.user.profile
    profile.miro_token = None
    profile.save()

    return redirect('profile_redirect')

def handler404(request, exception):
    return redirect('home')