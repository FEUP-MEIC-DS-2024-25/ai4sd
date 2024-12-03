import os
import google.generativeai as genai
from utils.utils_misc import get_env_variable

def repository_as_prompt(repoDir="files", mdResponse="prompt_feedback"):
    key = get_env_variable("GEMINI_PRIVATE_KEY", "Gemini key not found.")
    genai.configure(api_key=key)

    model = genai.GenerativeModel(model_name="gemini-1.5-flash")

    if not os.path.exists(repoDir):
        raise FileNotFoundError(f"No repository found at: {repoDir}")

    if not os.path.exists(mdResponse):
        os.makedirs(mdResponse)

    file_text = ""
    for root, _, files in os.walk(repoDir):
        for file in files:
            with open(os.path.join(root, file), 'r', encoding='utf-8') as file:
                file_text += file.read()
                file_text += "\n\n"

    response = model.generate_content(f"Can you find any architecture patterns within this code?: {file_text}\n. Please highlight relevant parts of the code.")
    output_file_path = os.path.join(mdResponse, f"response.md")
    with open(output_file_path, 'w', encoding='utf-8') as answer:
        answer.write(response.text)