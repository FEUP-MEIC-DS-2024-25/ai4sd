from django import forms
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from .models import SparkProject

class MyUserCreationForm(UserCreationForm):

    username = forms.CharField(label='Username', min_length=5, max_length=30, required=True)
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
    password2 = forms.CharField(label='Password confirmation', widget=forms.PasswordInput)

    def username_clean(self):
        username = self.cleaned_data['username'].lower()
        new = User.objects.filter(username=username)
        if new.count():
            raise forms.ValidationError('This username is already in use.')
        return username
    
    def clean_password2(self):
        password1 = self.cleaned_data['password1']
        password2 = self.cleaned_data['password2']
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError('Passwords don\'t match.')
        return password2
    
    def save(self, commit=True):
        user = super(MyUserCreationForm, self).save(commit=False)
        user.username = self.cleaned_data['username']
        user.set_password(self.cleaned_data['password1'])
        if commit:
            user.save()
        return user
    
class MyAuthenticationForm(forms.Form):
    username = forms.CharField(label='Username', required=True)
    password = forms.CharField(label='Password', widget=forms.PasswordInput, required=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.user = None
    
    def clean(self):
        username = self.cleaned_data.get('username')
        password = self.cleaned_data.get('password')

        if not username or not password:
            raise forms.ValidationError('Both fields are required.')

        self.user = authenticate(username = username, password = password)
        if self.user is None:
            raise forms.ValidationError('Invalid login credentials.')
        
        return self.cleaned_data
    
    def get_user(self):
        return self.user
    
class SparkProjectForm(forms.ModelForm):
    class Meta:
        model = SparkProject
        fields = ['name', 'description', 'github_project_link', 'miro_board_id']

        widgest = {
            'name': forms.TextInput(attrs={'class': 'form-control'}),
            'description': forms.Textarea(attrs={'class': 'form-control'}),
            'github_project_link': forms.URLInput(attrs={'class': 'form-control'}),
            'miro_board_id': forms.URLInput(attrs={'class': 'form-control'}),
        }
