import requests
import json

class GitHubGraphQLAPI:

    _instances = {} # One instance per different token

    # Singleton pattern
    def __new__(cls, token):
        if token not in cls._instances:
            instance = super(GitHubGraphQLAPI, cls).__new__(cls)
            cls._instances[token] = instance
        return cls._instances[token]

    def __init__(self, token):
        if hasattr(self, '_initialized') and self._initialized:
            return
        
        self.headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json',
        }
        self.session = requests.Session()
        self.session.headers.update(self.headers)
        self._initialized = True

    BASE_URL = 'https://api.github.com/graphql'


    def send_request(self, query, variables = None):

        data = {
            'query': query,
            'variables': variables or {}
        }

        response = self.session.post(self.BASE_URL, headers=self.headers, json=data)
        if response.status_code == 200:
            data = response.json()
            data = json.dumps(data, indent=2)
            return data
        else:
            print(f"Error: {response.status_code}")

        return None
        
        
    def fetch_all_pages(self, query, variables = None, entity = ''):
        all_pages = []
        variables['cursor'] = None

        while True:
            result = self.send_request(query, variables)

            if not result:
                print("No result returned from API.")
                break

            if 'errors' in result:
                print('GraphQL Errors:', result['errors'])
                break

            # Ensure expected structure
            if 'data' in result and entity in result['data']:
                
                projects = result['data'][entity]['projectsV2']['nodes']
                all_pages.extend([project for project in projects if project['closed'] == False]) # Only open projects
            
                page_info = result['data'][entity]['projectsV2']['pageInfo']
                if page_info['hasNextPage']:
                    variables['cursor'] = page_info['endCursor']
                else:
                    break
            else:
                print("Error fetching data.")
                break

        return all_pages

    
    def get_project(self, id):
        
        query = """
        query ($id: ID!) {
            node(id: $id) {
                ... on ProjectV2 {
                    title
                    url
                }
            }
        }
        """
                
        variables = {"id": id}

        response = self.send_request(query, variables)
        
        if response and "data" in response and "node" in response['data']:
            return response['data']['node']
        
        return None

    def get_organization_projects(self, org):
        
        query = """
        query ($org: String!, $cursor: String) {
            organization(login: $org) {
                projectsV2(first: 100, after: $cursor) {
                    pageInfo {
                        hasNextPage
                        endCursor
                    }
                    nodes {
                        id
                        title
                        url
                        closed
                    }
                }
            }
        }
        """

        variables = {'org': org, "cursor": None}

        return self.fetch_all_pages(query, variables, 'organization')
    
    def get_user_projects(self, username):

        query = """
        query ($username: String!, $cursor: String) {
          user(login: $username) {
            projectsV2(first: 100, after: $cursor) {
                
                pageInfo {
                    hasNextPage
                    endCursor
                }
                nodes {
                    id
                    title
                    url
                    closed
                }
            }
          }
        }   
        """
        
        variables = {"username": username, "cursor": None}

        return self.fetch_all_pages(query, variables, 'user')

    def get_project_columns():
        # Query to get the columns of a project -> Usar API do GitHub para ser dinâmico 

        columns = ['📋 Product Backlog', '🔖 Iteration Backlog', '🏗 In progress', '✅ Done']    
        return columns

