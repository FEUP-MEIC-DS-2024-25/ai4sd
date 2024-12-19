import os

from typing import Union
from abc import ABC, abstractmethod

class LLM(ABC):

    def check_folders(self, repoDir: str, mdResponse: str) -> Union[None, FileNotFoundError]:
        if not os.path.exists(repoDir):
            raise FileNotFoundError(f"No repository found at: {repoDir}")
        
        if not os.path.exists(mdResponse):
            os.makedirs(mdResponse)

    def get_file_contents(self, repoDir: str) -> str:
        file_text = ""

        for root, _, files in os.walk(repoDir):
            for file in files:
                with open(os.path.join(root, file), 'r', encoding='utf-8') as file:
                    file_text += file.read()
                    file_text += "\n\n"

        return file_text
    
    def response_to_md(self, response: str, mdResponse: str):
        output_file_path = os.path.join(mdResponse, f"response.md")
        
        with open(output_file_path, 'w', encoding='utf-8') as file:
            file.write(response)

    @abstractmethod
    def run(self, repoDir="files", mdResponse="prompt_feedback"):
        pass