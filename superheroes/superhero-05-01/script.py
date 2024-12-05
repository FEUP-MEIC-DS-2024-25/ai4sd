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
Make a thorough analysis of the following code and identify ALL possible vulnerabilities:
Code:"""

prompt2 = """
Please give answer in a JSON format with the following fields, for each vulnerability in the code:
title: <Title of the vulnerability>
description: <Small description of the vulnerability>
lines: <Lines of code that are vulnerable>
fix: <How to fix the vulnerability>

Only provide the JSON array of vulnerabilities.

Please try to be synthetic in your answers.
"""


def run_online(file):
  # credentials = service_account.Credentials.from_service_account_file('wardenai-bbe86d6d2916.json')
  # vertexai.init(
  #     project="wardenai",
  #     credentials=credentials,
  # )

  genai.configure(api_key="AIzaSyAtSSHni87FP3Hy3GIsE3bQkwnJV5dz4-E")

  model = genai.GenerativeModel("gemini-1.5-flash-002")
  response = model.generate_content(prompt1 + file + prompt2).text

  print(resposnse)

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