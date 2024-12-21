from typing import Union

from communication.llm import LLM
from .llms.gemini import Gemini
from .llms.groq import Groq

class LLMService():

    def __init__(self, submodel_name: Union[str, None]):
        self.LLMS: dict[str, LLM] = {
            "gemini": Gemini(),
            "groq": Groq(submodel_name)
        }

    def run_model(self, model_name: str, repo_dir, md_response) -> None:
        self.LLMS.get(model_name).run(repo_dir, md_response)
