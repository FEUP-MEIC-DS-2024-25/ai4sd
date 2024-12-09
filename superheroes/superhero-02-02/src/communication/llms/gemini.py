import os, sys
sys.path.append(os.path.dirname((os.path.abspath(__file__))))

import google.generativeai as genai

from communication.llm import LLM
from utils.utils_misc import get_env_variable

class Gemini(LLM):

    def run(self, repoDir="files", mdResponse="prompt_feedback"):
        key = get_env_variable("GEMINI_PRIVATE_KEY", "Gemini key not found.")
        genai.configure(api_key=key)

        model = genai.GenerativeModel(model_name="gemini-1.5-flash")

        self.check_folders(repoDir, mdResponse)

        file_contents = self.get_file_contents(repoDir)

        response = model.generate_content(f"Can you find any architecture patterns within this code?: {file_contents}\n. Please highlight relevant parts of the code.")

        self.response_to_md(response.text, mdResponse)