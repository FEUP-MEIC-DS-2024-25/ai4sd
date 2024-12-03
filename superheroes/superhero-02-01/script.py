from dotenv import load_dotenv
import textwrap
import google.generativeai as genai
import os

from IPython.display import Markdown

# Specify the path to the .keys file
from pathlib import Path
env_path = Path('.env') / '.keys'

# Load the .keys file
load_dotenv(dotenv_path=env_path)

# Now you can access the API_KEY
def to_markdown(text):
  text = text.replace('•', '  *')
  return Markdown(textwrap.indent(text, '> ', predicate=lambda _: True))

load_dotenv()
GOOGLE_API_KEY = os.getenv('CLOUD_KEY')
genai.configure(api_key=GOOGLE_API_KEY)

# Selecting text model 
model = genai.GenerativeModel('gemini-pro')

# Write any prompt of your choice
response = model.generate_content("What is football?") 

to_markdown(response.text)

for chunk in response:
  print(chunk.text)
  print("_"*80)