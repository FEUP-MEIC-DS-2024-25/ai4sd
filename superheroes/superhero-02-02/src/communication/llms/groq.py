import os, sys
sys.path.append(os.path.dirname((os.path.abspath(__file__))))

import groq

from communication.llm import LLM
from utils.utils_misc import get_env_variable

class Groq(LLM):

    def __init__(self, model_name: str = "llama3-8b-8192"):
        key = get_env_variable("GROQ_PRIVATE_KEY", "GROQ key not found.")

        self.MODEL_NAME = model_name
        self.groq = groq.Groq(api_key=key)

    def run(self, repoDir="files", mdResponse="prompt_feedback"):
        self.check_folders(repoDir, mdResponse)
        file_contents = self.get_file_contents(repoDir)

        chat_completion = self.groq.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": f"Can you find any architecture patterns within this code?: {file_contents}\n. Please highlight relevant parts of the code."
                }
            ],
            model = self.MODEL_NAME
        )

        response = chat_completion.choices[0].message.content

        self.response_to_md(response, mdResponse)

    def get_models(self):
        MODELS_TO_IGNORE = [
            "whisper-large-v3",
            "llama-guard-3-8b",
            "distil-whisper-large-v3-en",
            "whisper-large-v3-turbo",
            "llama-3.3-70b-specdec"
        ]

        models = self.groq.models.list()
        models_names = list(map(lambda model: model.id, filter(lambda model: model.id not in MODELS_TO_IGNORE, models.data)))
        return models_names




