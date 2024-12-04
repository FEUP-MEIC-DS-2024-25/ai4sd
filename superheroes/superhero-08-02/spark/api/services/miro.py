import os, random, requests, re
from github_graphql import GitHubGraphQLAPI
from gemini import GeminiAPI

import json
from dotenv import load_dotenv
load_dotenv()

class MiroAPI:

    _instances = {} # One instance per different token

    # Singleton pattern
    def __new__(cls, token):
        if token not in cls._instances:
            instance = super(MiroAPI, cls).__new__(cls)
            cls._instances[token] = instance
        return cls._instances[token]

    def __init__(self, token):
        if hasattr(self, '_initialized') and self._initialized:
            return
        
        self.headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "authorization": f"Bearer {token}"
        }
        
        self.bearer_token = token
        self.existing_sticky_notes = [] # this probably has to be passed by parameter

    BASE_URL = 'https://api.miro.com/v2/boards'


    def check_overlap(self, new_x, new_y, width):

        for note in self.existing_sticky_notes:
            existing_x, existing_y, existing_width = note

            if not (new_x + width/2 <= existing_x - existing_width/2 or
            new_x - width/2 >= existing_x + existing_width/2 or
            new_y + width/2 <= existing_y - existing_width/2 or
            new_y - width/2 >= existing_y + existing_width/2):

                return True  
        return False 


    def create_sticky_note(self, board_id, content):

        url = f'{self.BASE_URL}/{board_id}/sticky_notes'

        color = ["gray", "light_yellow", "yellow", "orange", "light_green",
                "green", "dark_green", "cyan", "light_pink", "pink", "violet",
                "red", "light_blue", "blue", "dark_blue", "black"]
        
        width = 1000
        random_color = random.choice(color)

        max_attempts = 100
        last_x, last_y = 0, 0  

        for _ in range(max_attempts):
            x = random.randint(-3500 + width/2, -width/2)
            y = random.randint(-1850 + width/2, 2600 - width/2)
            last_x, last_y = x, y 

            if not self.check_overlap(x, y, width):
                self.existing_sticky_notes.append((x, y, width))
                
                payload = {
                    "data": { "content": content },
                    "style": {
                        "fillColor": random_color,
                        "textAlign": "center",
                        "textAlignVertical": "middle"
                    },
                    "position": {
                        "x": x,
                        "y": y,
                    },
                    "geometry": { "width": width }
                }
                
                response = requests.post(url, json = payload, headers = self.headers)
                return response.json()

        # If the loop ends without finding a valid position
        payload = {
            "data": { "content": content },
            "style": {
                "fillColor": random_color,
                "textAlign": "center",
                "textAlignVertical": "middle"
            },
            "position": {
                "x": last_x,
                "y": last_y,
            },
            "geometry": { "width": width }
        }
        
        response = requests.post(url, json=payload, headers = self.headers)
        return response.json()


    def create_priority_tag(self, board_id, content):
        url = f"{self.BASE_URL}/{board_id}/tags"

        color = None
        if content == "High":
            color = "red"
        elif content == "Medium":
            color = "yellow"
        elif content == "Low":
            color = "green"

        payload = {
            "fillColor": color,
            "title": content
        }
        
        response = requests.post(url, json=payload, headers = self.headers)
        return response.json()


    def create_size_tag(self, board_id, size):
        url = f"{self.BASE_URL}/{board_id}/tags"

        size = int(size)
        color = None
        if size <= 3:
            color = "blue"
        elif 3 < size <= 5:
            color = "green"
        elif 5 < size <= 8:
            color = "yellow"
        elif 8 < size <= 13:
            color = "red"
        elif size > 13:
            color = "magenta"

        payload = {
            "fillColor": color,
            "title": size 
        }
        
        response = requests.post(url, json = payload, headers = self.headers)
        return response.json()


    # Return a dictionary with the tags of the board and their respective IDs
    def get_tag_id(self, board_id):
        url = f"{self.BASE_URL}/{board_id}/tags"

        headers = {
            "accept": "application/json",
            "authorization": f"Bearer {self.bearer_token}"
        }

        response = requests.get(url, headers=headers)
        data = response.json()

        # Create the dictionary from the response
        tag_dict = {tag['title']: int(tag['id']) for tag in data['data']}
        return tag_dict


    # Return dictionary with the sticky notes of the board and their respective IDs
    def get_sticky_notes_id(self, board_id):

        url = f"{self.BASE_URL}/{board_id}/items?limit=50"

        headers = {
            "accept": "application/json",
            "authorization": f"Bearer {self.bearer_token}"
        }

        response = requests.get(url, headers=headers)
        data = response.json()
        sticky_notes_dict = {}
        for item in data['data']:
            if item['type'] == 'sticky_note':
                content = re.sub(r'<.*?>', '', item['data']['content'])
                sticky_notes_dict[content] = int(item['id'])

        return sticky_notes_dict


    def attach_note_to_tag(self, board_id,  note_id, tag_id):
        url = f"{self.BASE_URL}/{board_id}/items/{note_id}?tag_id={tag_id}"

        headers = {
            "accept": "application/json",
            "authorization": f"Bearer {self.bearer_token}"
        }

        response = requests.post(url, headers=headers)
        return response


    def extract_lists_from_response(self,response):
        matches = re.findall(r'\[([^\]]*?)\]', response)
        
        if matches and len(matches) >= 3:
            result_lists = []
            for match in matches:
                items_list = [item.strip().strip("'\"") for item in match.split(',')]
                result_lists.append(items_list)
            
            return result_lists[0], result_lists[1], result_lists[2], result_lists[3]
        else:
            print("Not enough valid lists found in the response.")
            return [], [], []
        

    def update_sticky_note(self, board_id, note_id):
        width = 1000
        x = random.randint(width/2, 3500 - width/2)
        url = f"{self.BASE_URL}/{board_id}/sticky_notes/{note_id}"

        payload = { "position": { "x": x } }

        response = requests.patch(url, json=payload, headers = self.headers)
        return response.json()


    def get_iteration_tasks(self, board_id, sticky_notes_dict):
        url = f"{self.BASE_URL}/{board_id}/items?limit=50"

        headers = {
            "accept": "application/json",
            "authorization": f"Bearer {self.bearer_token}"
        }

        response = requests.get(url, headers=headers)
        data = response.json()
        
        iteration_tasks = []
        priority_tasks = []
        size_tasks = []

        for item in data['data']:
            if item['type'] == 'sticky_note' and item['position']['x'] > 0:
                content = re.sub(r'<.*?>', '', item['data']['content'])
                iteration_tasks.append(content)
        
        for task in iteration_tasks:
            task_id = sticky_notes_dict[task]
            tags_info = self.get_tags_from_notes("uXjVLQTokqg%3D", task_id)
            priority_tasks.append(tags_info["priority_tag"])
            size_tasks.append(tags_info["size_tag"])

        return iteration_tasks, priority_tasks, size_tasks
                

    def get_tags_from_notes(self, board_id, note_id):

        url = f"{self.BASE_URL}/{board_id}/items/{note_id}/tags"

        headers = {
            "accept": "application/json",
            "authorization": f"Bearer {self.bearer_token}"
        }

        response = requests.get(url, headers=headers)
        data = response.json()

        priority_tag = None
        size_tag = None

        for tag in data['tags']:
            if tag['title'].isdigit():
                size_tag = tag['title'] 
            else:
                priority_tag = tag['title']

        return {
            "priority_tag": priority_tag,
            "size_tag": size_tag
        }
    
    def create_miro_template(self, board_id):
        url_rect = f"{self.BASE_URL}/{board_id}/shapes"

        url_text = f"{self.BASE_URL}/{board_id}/texts"

        headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "authorization": f"Bearer {self.bearer_token}"
        }

        left_rectangle_payload = {
            "data": { "shape": "rectangle" },
            "style": {
                "borderOpacity": "1",
                "borderWidth": "12"
            },
            "geometry": {
                "height": 4430,
                "width": 3850
            },
            "position": {
                "x": -1950,
                "y": 330
            }
        }
        
        right_rectangle_payload = {
            "data": { "shape": "rectangle" },
            "style": {
                "borderOpacity": "1",
                "borderWidth": "12"
            },
            "geometry": {
                "height": 4430,
                "width": 3850
            },
            "position": {
                "x": 1900,
                "y": 330
            }
        }

        min_left_rectangle_payload = {
            "data": { "shape": "rectangle" },
            "style": {
                "borderOpacity": "1",
                "borderWidth": "12"
            },
            "geometry": {
                "height": 700,
                "width": 3850
            },
            "position": {
                "x": -1950,
                "y": -2220
            }
        }

        min_right_rectangle_payload = {
            "data": { "shape": "rectangle" },
            "style": {
                "borderOpacity": "1",
                "borderWidth": "12"
            },
            "geometry": {
                "height": 700,
                "width": 3850
            },
            "position": {
                "x": 1900,
                "y": -2220
            }
        }

        top_rectangle_payload = {
            "data": { "shape": "rectangle" },
            "style": {
                "borderOpacity": "1",
                "borderWidth": "12",
                "fillColor": "#FEF445",
                "borderColor": "#FAC710"
            },
            "geometry": {
                "height": 650,
                "width": 7700
            },
            "position": {
                "x": 0,
                "y":-3100
            }
        }

        miro_text_payload = {
            "data": { "content": "Miro's Board - SPARK" },
            "style": {
                "fontFamily": "fredoka_one",
                "fontSize": "288"
            },
            "geometry": { "width": 4000 },
            "position": {
                "y": -3100,
                "x": -700
            }
        }

        # Product Backlog
        miro_pb_text_payload = {
            "data": { "content": "📋 <strong>Product Backlog </strong>" },
            "style": {
                "fontFamily": "open_sans",
                "fontSize": "200",
                "fillOpacity": "1"
            },
            "geometry": { "width": 4000 },
            "position": {
                "y": -2200,
                "x": -910
            }
        }

        # Iteration Backlog
        miro_ib_text_payload = {
            "data": { "content": "🔖 <strong>Iteration Backlog </strong>" },
            "style": {
                "fontFamily": "open_sans",
                "fontSize": "200",
                "fillOpacity": "1"
            },
            "geometry": { "width": 4000 },
            "position": {
                "y": -2200,
                "x": 2900
            }
        }

        requests.post(url_rect, json=left_rectangle_payload, headers=headers)

        requests.post(url_rect, json=right_rectangle_payload, headers=headers)

        requests.post(url_rect, json=min_left_rectangle_payload, headers=headers)       
    
        requests.post(url_rect, json=min_right_rectangle_payload, headers=headers)

        requests.post(url_rect, json=top_rectangle_payload, headers=headers)

        requests.post(url_text, json=miro_text_payload, headers=headers)

        requests.post(url_text, json=miro_pb_text_payload, headers=headers)

        requests.post(url_text, json=miro_ib_text_payload, headers=headers)

def main():
    #------TEST FUNCTIONS------
    flag = False # (FALSE) - Just to test the MIRO -> GITHUB API functionality
    MIRO_TOKEN = os.getenv('MIRO_TOKEN')    
    miro_api = MiroAPI(MIRO_TOKEN)

    GITHUB_TOKEN = os.getenv('GITHUB_TOKEN')
    github_api = GitHubGraphQLAPI(GITHUB_TOKEN)

    query = """
        {
        node(id: "PVT_kwDOCtw04M4Ap0aW") {
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

    # Send the request to the API to get the project data
    project_data = github_api.send_request(query)

    if flag:
        # 1. Get Project data from github 
        # Query to get the project data
        

        # 2. Gemini choose tasks to move to the 'Iteration Backlog'

        geminiAPI = GeminiAPI()

        prompt = (
            "Based on the provided project data, " + project_data + """\n
            Identify the tasks that should be moved to the 'Iteration Backlog' for the upcoming iteration, prioritizing tasks with the highest impact.
            Leave tasks not selected in their current status and do not modify their position.
            Provide the response in a Python list with the names of all the tasks in the backlog. 
            Additionally, provide two more Python lists with the priorities of the tasks and their sizes for all the tasks in the backlog in the same order.
            Finally, provide one more Python list with the names of the tasks that should be moved to the 'Iteration Backlog'.
            Don't give an explanation, just the lists.
            """
        )
        
        gemini_response = geminiAPI.prompt_gemini(prompt)

        # 3. Create sticky notes in Miro for the tasks that should be moved to the 'Iteration Backlog'
        print("Extracting lists from gemini response...")
    

        print("Creating Miro template...")
        miro_api.create_miro_template("uXjVLQTokqg%3D")

        lists = miro_api.extract_lists_from_response(gemini_response)
        all_tasks = lists[0]
        priorities = lists[1]
        sizes = lists[2]
        iteration_tasks = lists[3]

        print("Creating sticky notes...")
        for i in range(len(all_tasks)):
            miro_api.create_sticky_note("uXjVLQTokqg%3D", all_tasks[i])

        print("Creating priority tags...")
        for i in range(len(priorities)):
            miro_api.create_priority_tag("uXjVLQTokqg%3D", priorities[i])

        print("Creating size tags...")
        for i in range(len(sizes)):
            miro_api.create_size_tag("uXjVLQTokqg%3D", sizes[i])

        print("Attaching notes to tags...")
        tags_dict = miro_api.get_tag_id("uXjVLQTokqg%3D")
        sticky_notes_dict = miro_api.get_sticky_notes_id("uXjVLQTokqg%3D")

        for note in all_tasks:
            note_id = sticky_notes_dict[note]
            priority_id = tags_dict[priorities[all_tasks.index(note)]]
            size_id = tags_dict[sizes[all_tasks.index(note)]]

            miro_api.attach_note_to_tag("uXjVLQTokqg%3D", note_id, priority_id)
            miro_api.attach_note_to_tag("uXjVLQTokqg%3D", note_id, size_id)

        print("Updating sticky notes...")
        for note in iteration_tasks:
            note_id = sticky_notes_dict[note]
            miro_api.update_sticky_note("uXjVLQTokqg%3D", note_id)

        print("Miro is updated with the tasks for the upcoming iteration successfully!")

    # Get iteration tasks from Miro
    sticky_notes_dict = miro_api.get_sticky_notes_id("uXjVLQTokqg%3D")    

    iteration_tasks, priority_tasks, size_tasks = miro_api.get_iteration_tasks("uXjVLQTokqg%3D", sticky_notes_dict)

    project_fields = github_api.get_project_fields("PVT_kwDOCtw04M4Ap0aW")

    status_info = github_api.extract_field_info(project_fields, "Status")
    priority_info = github_api.extract_field_info(project_fields, "Priority")
    size_info = github_api.extract_field_info(project_fields, "Size")

    print("STATUS INFO:", status_info)
    print("PRIORITY INFO:", priority_info)
    print("SIZE INFO:", size_info)

    github_api.update_tasks_to_iteration_backlog(project_data, iteration_tasks)

if __name__ == "__main__":
    main()