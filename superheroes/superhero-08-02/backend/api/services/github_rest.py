import requests, os
from django.utils.crypto import get_random_string

class GitHubRestAPI:

    def __init__(self):
        self.client_id = os.getenv('SPARK_CLIENT_ID')
        self.client_secret = os.getenv('SPARK_CLIENT_SECRET')


    BASE_URL = 'https://github.com'
    API_URL = 'https://api.github.com'
    
    def generate_auth_url(self, redirect_uri, scopes):
        state = get_random_string(length = 32)
        auth_url = (
            f'{self.BASE_URL}/login/oauth/authorize'
            f'?client_id={self.client_id}'
            f'&redirect_uri={redirect_uri}'
            f'&scope={scopes}'
            f'&state={state}'
        )

        return auth_url, state
    
    def exchange_code_for_token(self, code):
        token_url = f'{self.BASE_URL}/login/oauth/access_token'
        headers = {'Accept': 'application/json'}
        data = {
            'client_id': self.client_id,
            'client_secret': self.client_secret,
            'code': code,
        }

        response = requests.post(token_url, headers = headers, data = data)
        response.raise_for_status()
        return response.json().get('access_token')
    
    def get_user_data(self, access_token):
        user_url = f'{self.API_URL}/user'
        headers = {'Authorization': f'token {access_token}'}
        response = requests.get(user_url, headers = headers)
        response.raise_for_status()
        return response.json()
    
    def check_token(self, access_token) -> bool:
        check_url = f'{self.API_URL}/applications/{self.client_id}/token'
        auth = (self.client_id, self.client_secret)

        headers = { 'Accept': 'application/vnd.github.+json' }
        body = { 'access_token': access_token }

        response = requests.post(check_url, auth = auth, headers = headers, json = body)

        return response.status_code == 200
    
    def revoke_token(self, access_token):
        revoke_url = f'{self.API_URL}/applications/{self.client_id}/token'
        auth = (self.client_id, self.client_secret)

        headers = { 'Accept': 'application/vnd.github.+json' }
        body = { 'access_token': access_token }

        response = requests.delete(revoke_url, auth = auth, headers = headers, json = body)
        return response.status_code == 204

# Singleton instance
githubRestAPI = GitHubRestAPI()
