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
            return response.json()
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
                    fields(first: 20) {
                        nodes {
                            ... on ProjectV2SingleSelectField {
                                name
                                options {
                                    name
                                }
                            }
                        }
                    }
                }
            }
        }
        """
                
        variables = {"id": id}

        response = self.send_request(query, variables)
        
        if response and "data" in response and "node" in response['data']:
            project = response['data']['node']
            fields = project['fields']['nodes']

            status_list = [field for field in fields if field and field['name'] == 'Status'][0]['options']
            cleaned_status_list = [status['name'] for status in status_list]

            project_info = { 
                'title': project['title'],
                'url': project['url'],
                'status_list': cleaned_status_list
            }

            return project_info
        
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
    
    def update_tasks_to_iteration_backlog(self, project_data, iteration_tasks, priority_tasks, size_tasks):

        project_field = self.get_project_fields("PVT_kwDOCtw04M4Ap0aW")

        status_info = self.extract_field_info(project_field, "Status")
        priority_info = self.extract_field_info(project_field, "Priority")
        size_info = self.extract_field_info(project_field, "Size")

        for i in range(len(iteration_tasks)):
            print(f"Updating to GitHub: {iteration_tasks[i]}...")
            task_name = iteration_tasks[i]
            priority_task = priority_tasks[i]
            size_task = size_tasks[i]

            task_id = None
            for item in project_data['data']['node']['items']['nodes']:
                if item and item.get('content') and item['content'].get('title') == task_name:

                    task_id = item['id']
                    break

            if not task_id:
                print(f"Task '{task_name}' not found in project data. Skipping...")
                continue

            iteration_backlog_id = status_info['options'].get("🔖 Iteration Backlog", None) # We need to see this later!
            priority_id = priority_info['options'].get(priority_task, None) 
            size_id = size_info['options'].get(size_task, None) 

            if not iteration_backlog_id or not priority_id or not size_id:
                print(f"Missing field options for task '{task_name}'. Skipping...")
                continue

            self.update_field(task_id, iteration_backlog_id, status_info['field_id'], task_name)

            self.update_field(task_id, priority_id, priority_info['field_id'], task_name)

            self.update_field(task_id, size_id, size_info['field_id'], task_name)
        

    def update_field(self, task_id, new_option_id, status_field_id, task_name):
        update_query = f"""
        mutation {{
            updateProjectV2ItemFieldValue(input: {{
                projectId: "PVT_kwDOCtw04M4Ap0aW",  
                itemId: "{task_id}",  # ID da task
                fieldId: "{status_field_id}", 
                value: {{
                    singleSelectOptionId: "{new_option_id}"  
                }}
            }}) {{
                projectV2Item {{
                    id
                }}
            }}
        }}
        """
        self.send_request(update_query)
        

    def get_project_fields(self, project_id):

        query = """
        query ($id: ID!) {
            node(id: $id) {
                ... on ProjectV2 {
                title
                url
                fields(first: 20) {
                    nodes {
                    __typename
                    ... on ProjectV2FieldCommon {
                        id
                        name
                    }
                    ... on ProjectV2SingleSelectField {
                        options {
                        id
                        name
                        }
                    }
                    }
                }
                }
            }
            }
            """
        
        variables = {"id": project_id}
        response = self.send_request(query, variables)
        
        if response and "data" in response and "node" in response["data"]:
            project = response["data"]["node"]
            fields = project["fields"]["nodes"]

            processed_fields = {}
            for field in fields:
                if field:
                    options = None
                    if field["__typename"] == "ProjectV2SingleSelectField" and "options" in field:
                        options = {option["name"]: option["id"] for option in field["options"]}
                    processed_fields[field["name"]] = {"id": field["id"], "options": options}
            
            project_info = {
                "title": project["title"],
                "fields": processed_fields
            }
            
            return project_info

        return None
    
    def extract_field_info(self,project_data, field_name):

        fields = project_data.get('fields', {})
        field = fields.get(field_name, None)

        if not field:
            raise ValueError(f"Field '{field_name}' not found in project data.")

        field_id = field.get('id')

        options = field.get('options', {})
        option_ids = {option_name: option_id for option_name, option_id in options.items()} if options else {}

        return {
            'field_id': field_id,
            'options': option_ids
        }

    def get_project_data(self, project_id):

        query = """
        query ($id: ID!) {
        node(id: $id) {
            ... on ProjectV2 {
            items(first: 20) {
                nodes {
                id  
                fieldValues(first: 8) {
                    nodes {
                    ... on ProjectV2ItemFieldTextValue {
                        text
                        field {
                        ... on ProjectV2FieldCommon {
                            name
                        }
                        }
                    }
                    ... on ProjectV2ItemFieldDateValue {
                        date
                        field {
                        ... on ProjectV2FieldCommon {
                            name
                        }
                        }
                    }
                    ... on ProjectV2ItemFieldSingleSelectValue {
                        name
                        field {
                        ... on ProjectV2FieldCommon {
                            name
                        }
                        }
                    }
                    }
                }
                content {
                    ... on DraftIssue {
                    title
                    body
                    }
                    ... on Issue {
                    title
                    assignees(first: 10) {
                        nodes {
                        login
                        }
                    }
                    }
                    ... on PullRequest {
                    title
                    assignees(first: 10) {
                        nodes {
                        login
                        }
                    }
                    }
                }
                }
            }
            }
        }
        }
        """

        return self.send_request(query, {"id": project_id})       