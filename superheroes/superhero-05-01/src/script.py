# import ollama
# import vertexai
# from vertexai.generative_models import GenerativeModel
# from google.oauth2 import service_account
from os import environ
import google.generativeai as genai

import sys

def clear():
    print("\033[H\033[J")

clear()

prompt1 =  """
Make a thorough analysis of the following files and their code, and identify ALL possible vulnerabilities:\n
"""

prompt2 = """\n
Please give answer in a JSON format with the following fields, for each vulnerability in the code:
title: <Title of the vulnerability>
description: <Small description of the vulnerability>
file: <File where the vulnerability is located>
lines: <Line numbers of the code that is vulnerable>
fix: <How to fix the vulnerability>

Only provide the JSON array of vulnerabilities.
DO NOT WRAP OR FORMAT THE JSON IN A CODE BLOCK.
Please try to be synthetic in your answers.
"""

# with open('etc/gemini_token', 'r') as file:
#   gemini_token = file.read().strip()

gemini_token = "AIzaSyAtSSHni87FP3Hy3GIsE3bQkwnJV5dz4-E"


def run_online(files):
  # credentials = service_account.Credentials.from_service_account_file('wardenai-bbe86d6d2916.json')
  # vertexai.init(
  #     project="wardenai",
  #     credentials=credentials,
  # )

  filesStr = ""

  for file in files:
    filesStr += file['name'] + ":\n"
    filesStr += file['content']
    filesStr += "\n\n"

  genai.configure(api_key=gemini_token)

  model = genai.GenerativeModel("gemini-1.5-flash-002")
  response = model.generate_content(prompt1 + filesStr + prompt2).text

  print(response)

  return response

# def run_offline(file):
#   response = ollama.chat(model='llama3.1', messages=[
#     {
#       'role': 'user',
#       'content': prompt1 + file + prompt2
#     },
#   ])

#   return response['message']['content']

# if __name__ == '__main__':
#   with open(sys.argv[1], 'r') as file:
#     prompt = file.read()

#   s = input("Do you want to run the model online? (y/n): ")

#   if s == 'y':
#     run_online(prompt)
#   if s == 'n':
#     run_offline(prompt)