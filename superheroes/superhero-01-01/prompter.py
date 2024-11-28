import os
import google.generativeai as genai
import json

from dotenv import load_dotenv

load_dotenv(dotenv_path="PATH/TO/ENV")
api_key = os.environ.get("API_KEY")
output_dir = "../backend"
prompt = '''Evaluate the following code according to Good Coding Practices and suggest changes where necessary. Do not generate new code, simply point out errors and suggest changes using this JSON format:
        output: {
            "programmingLanguage": "text",
            "issues": [
                {
                    "title": "title",
                    "description": "explanation"
                    "risk level": risk level
                },   {
                    "title": "title",
                    "description": "explanation"
                    "risk level": risk level
                }
            ],
            "feedback": "feedback",
            "evaluation": evaluation
        }
        programming language: the programming language in the given code file
        title: a short title which aptly summarizes the identified problem
        description: a short description which explains the problem
        risk level: "Minor", "Moderate", "Major", "Severe" (pick one)
        evaluation: "Very Bad", "Bad", "Satisfactory", "Good", "Very Good" (pick one)
        
        When creating the JSON, the problems should be sorted by risk level, with the most problematic
        being at the top and the least problematic at the bottom.
        
    '''

def request_evaluation(file):
    if api_key is not None:
        genai.configure(api_key=api_key)

        model = genai.GenerativeModel("gemini-1.5-flash")
        sample_file = genai.upload_file(file)
        response = model.generate_content([prompt, sample_file])

        data = None
        if response.text.startswith("```json"):
            output = response.text[7:].lstrip()
            output = output[:-4].rstrip()
            print(output)
            data = json.loads(output)
            with open(output_dir + "/output.json","w") as json_file:
                json.dump(data, json_file, indent=4)

        if data is not None:
            print("Code has been sucessfully evaluated with the following results:\n")
            print("Programming Language: " + data["programmingLanguage"] + "\n")
            print("Evaluation: " + data["evaluation"] + "\n")
    else:
        print("API_KEY not found!")