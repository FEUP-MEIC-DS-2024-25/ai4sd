import google.generativeai as genai
from dotenv import load_dotenv
import os

# Carregar as variáveis do ficheiro .env
load_dotenv()

# Aceder às variáveis de ambiente
my_secret = os.getenv('GEMINI_KEY')

#Read all the files needed
with open('./files/context.txt', 'r') as file:
    context = file.read()
with open('./files/tests.txt', 'r') as file:
    tests = file.read()

#Create the query 
query = "This is the context about what I expect my program to do:\n" + context + "\nThese are my tests:\n" + tests + "\n Can you select the most important tests based on the context that I provided you? Select a minimum of 4 tests. Give me only the code with the tests that you chose." 


#Define the key, the model and make the query to the gemini
genai.configure(api_key=my_secret)
model = genai.GenerativeModel("gemini-1.5-flash")
response = model.generate_content(query)

#Write the response into the tests_selected.txt file
with open('./files/tests_selected.txt', 'w') as file:
    file.write(response.text)