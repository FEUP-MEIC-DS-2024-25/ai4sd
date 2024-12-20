import re
import shutil
import os, sys
sys.path.append(os.path.dirname((os.path.abspath(__file__))))

from typing import Union

from zipfile import *

from flask import jsonify, abort, request
from flask_restful import Resource


from utils.utils_misc import get_env_variable

from communication.service import LLMService

class Repository:
    def __init__(self):
        self.FILES_DIR = get_env_variable("FILES_DIR", "FILES_DIR key not found")
        self.PROMPT_DIR = get_env_variable("PROMPT_DIR", "PROMPT_DIR key not found")

    def process_prompt_response(self, model_name: str, submodel_name: Union[str, None] = None):
        service = LLMService(submodel_name)
        service.run_model(model_name, self.FILES_DIR, self.PROMPT_DIR)

        content = self.__get_prompt_content()
        self.__clean_dirs()

        return content
    
    def __get_prompt_content(self):
        content = ""

        try:
            with open(os.path.join(self.PROMPT_DIR, "response.md"), "r", encoding="UTF-8") as f:
                content = f.read()
        except FileNotFoundError:
            abort(500, "Response file not found.")

        return content

    def __clean_dirs(self):
        shutil.rmtree(self.FILES_DIR)
        shutil.rmtree(self.PROMPT_DIR)



class LocalRepository(Resource, Repository):
    def post(self):
        file = request.files['file']
        llm =  request.form['llm']

        os.makedirs(self.FILES_DIR, exist_ok=True)

        zip_file = file.stream._file
        zipfile_ob = ZipFile(zip_file)
        zipfile_ob.extractall(self.FILES_DIR)
        zip_file.close()

        self.clean_files(self.FILES_DIR)

        content = None

        # if llm has '/' is because llm has multiple models to choose from
        # e.g. groq/llama ; groq/gemma
        if "/" in llm:
            [llm_name, model_subname] = llm.split("/")
            content = self.process_prompt_response(llm_name, model_subname)
        else:
            content = self.process_prompt_response(llm)

        return jsonify({"data": content})
    
    def clean_files(self, dir):
        files_to_delete = []

        for root, _, files in os.walk(dir):
            for file in files:
                if not file.endswith(".py"):
                    files_to_delete.append(os.path.join(root, file))

        for file in files_to_delete:
            os.remove(file)