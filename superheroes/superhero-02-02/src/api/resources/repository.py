import re
import shutil
import os, sys
sys.path.append(os.path.dirname((os.path.abspath(__file__))))

from zipfile import *
from urllib.parse import unquote

from flask import jsonify, abort, request
from flask_restful import Resource

from fetch import download_files_from_repo
from comm import repository_as_prompt
from utils.utils_misc import get_env_variable

class Repository:
    def __init__(self):
        self.FILES_DIR = get_env_variable("FILES_DIR", "FILES_DIR key not found")
        self.PROMPT_DIR = get_env_variable("PROMPT_DIR", "PROMPT_DIR key not found")

    def process_prompt_response(self):
        repository_as_prompt(self.FILES_DIR, self.PROMPT_DIR)
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


class RemoteRepository(Resource, Repository):
    def get(self, repo):
        if not repo:
            abort(400, "Parameter is missing")

        repo = unquote(repo)

        pattern = r'(?:git@github\.com:|https://github\.com/)([^/]+)/([^/]+)\.git$'
    
        match = re.search(pattern, repo)
        if match:
            owner = match.group(1)
            repo = match.group(2) 
        else:
            abort(
                400,
                "Invalid repository format. Please provide a valid GitHub repository.",
            )

        url = f"https://api.github.com/repos/{owner}/{repo}/contents/"

        try:
            download_files_from_repo(url)
        except Exception as e:
            abort(
                500,
                f"Failed to fetch repository contents: {e}",
            )

        content = self.process_prompt_response()

        return jsonify({"data": content})
    

class LocalRepository(Resource, Repository):
    def post(self):
        file = request.files['file']

        os.makedirs(self.FILES_DIR, exist_ok=True)

        zip_file = file.stream._file
        zipfile_ob = ZipFile(zip_file)
        zipfile_ob.extractall(self.FILES_DIR)
        zip_file.close()

        self.clean_files(self.FILES_DIR)
        content = self.process_prompt_response()

        return jsonify({"data": content})
    
    def clean_files(self, dir):
        files_to_delete = []

        for root, _, files in os.walk(dir):
            for file in files:
                if not file.endswith(".py"):
                    files_to_delete.append(os.path.join(root, file))

        for file in files_to_delete:
            os.remove(file)