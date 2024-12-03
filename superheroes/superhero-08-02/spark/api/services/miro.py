import os, random, requests, re

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
        url = f"{self.BASE_URL}/boards/{board_id}/tags"

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
        url = f"{self.BASE_URL}/boards/{board_id}/tags"

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
        url = f"{self.BASE_URL}/boards/{board_id}/tags"

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

        url = f"{self.BASE_URL}/boards/{board_id}/items"

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
        url = f"{self.BASE_URL}/boards/{board_id}/items/{note_id}?tag_id={tag_id}"

        headers = {
            "accept": "application/json",
            "authorization": f"Bearer {self.bearer_token}"
        }

        response = requests.post(url, headers=headers)
        return response


    def extract_lists_from_response(response):
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
        url = f"{self.BASE_URL}/boards/{board_id}/sticky_notes/{note_id}"

        payload = { "position": { "x": x } }

        response = requests.patch(url, json=payload, headers = self.headers)
        return response.json()


    def get_iteration_tasks(self, board_id, sticky_notes_dict):
        url = f"{self.BASE_URL}/boards/{board_id}/items"

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
            tags_info = self.get_tags_from_notes(task_id)
            priority_tasks.append(tags_info["priority_tag"])
            size_tasks.append(tags_info["size_tag"])

        return iteration_tasks, priority_tasks, size_tasks
                

    def get_tags_from_notes(self, board_id, note_id):

        url = f"{self.BASE_URL}/boards/{board_id}/items/{note_id}/tags"

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
    
def main():
    miroAPI = MiroAPI()

if __name__ == "__main__":
    main()