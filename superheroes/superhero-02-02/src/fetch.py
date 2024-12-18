import os
import requests
import logging
from dotenv import load_dotenv
import coloredlogs
from utils.github_auth import get_installation_access_token
from utils.utils_misc import get_env_variable

load_dotenv()
coloredlogs.install(level="INFO")
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

REPO_OWNER = "MRita443"
REPO_NAME = "IA-OnePizza"

# GitHub API endpoint to fetch repository contents
API_BASE_URL = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/contents/"

# Get GitHub API installation access token
GITHUB_TOKEN = get_installation_access_token(REPO_OWNER, REPO_NAME)

if not GITHUB_TOKEN:
    raise ValueError(
        f"GitHub token not found. Please ensure the SARA app is installed for the user {REPO_OWNER}."
    )

headers = {"Authorization": f"token {GITHUB_TOKEN}"}


def get_files_metadata(url, py_files=[]):
    logger.info("Fetching contents from URL: %s", url)
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        contents = response.json()
        logger.info("Found %d items in the repository.", len(contents))

        for content in contents:
            if content["type"] == "file" and content["name"].endswith(".py"):
                py_files.append(
                    {"name": content["name"], "download_url": content["download_url"]}
                )
                logger.info("Found Python file: %s", content['name'])
            elif content["type"] == "dir":
                # Recursive call to fetch contents of subdirectories
                logger.info("Entering directory: %s", content['name'])
                get_files_metadata(content["url"], py_files)
    else:
        logger.error(
            "Failed to fetch contents from URL: %s with status code %d", url, response.status_code
        )
        response.raise_for_status()

    return py_files


def download_file(file_info, download_dir):
    logger.info("Downloading file: %s", file_info['name'])
    response = requests.get(file_info["download_url"])
    if response.status_code == 200:
        file_path = os.path.join(download_dir, file_info["name"])
        with open(file_path, "wb") as file:
            file.write(response.content)
    else:
        logger.error(
            "Failed to download: %s with status code %d", file_info['name'], response.status_code
        )


def download_files_from_repo(url):
    download_dir = get_env_variable("FILES_DIR", "Download directory info not found. Please set the FILES_DIR environment variable.")
    os.makedirs(download_dir, exist_ok=True)

    py_files = get_files_metadata(url)

    for file_info in py_files:
        download_file(file_info, download_dir)


if __name__ == "__main__":
    download_files_from_repo(API_BASE_URL)
