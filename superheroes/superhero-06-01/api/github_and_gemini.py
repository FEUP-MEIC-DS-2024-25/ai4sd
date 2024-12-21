from utils.github_api import *
from utils.gemini_api import *

# Example usage
repo_owner = "Davide64-dev"
repo_name = "FEUP_RCOM_FileTransfer"

# Fetch commits
commits = get_commits(repo_owner, repo_name)

# Send the formatted prompt to the Gemini API
response = send_prompt(f"I will send you commits, and you will answer in 6 lines the architectural patterns:\n{commits}\n")

# Print the response
print("Response from Gemini:")
print(response)
