import os
import textwrap
from pathlib import Path
from dotenv import load_dotenv
from openai import OpenAI
import subprocess
import re

env_path = Path(__file__).resolve().parent.parent / '.env' / '.keys'
load_dotenv(dotenv_path=env_path)

# Get the API key for Google generative AI (Gemini)
#GOOGLE_API_KEY = os.getenv('CLOUD_KEY')

# Get the OpenAI API key
# OPENAI_API_KEY = os.getenv('OPENAI')
OPENAI_API_KEY = "teste"
client = OpenAI(
    # This is the default and can be omitted
    api_key=OPENAI_API_KEY
)

# Initialize Google generative AI model
#genai.configure(api_key=GOOGLE_API_KEY)
#model = genai.GenerativeModel('gemini-pro')


UML_SYNTAX_TEMPLATE = """
        @startuml
        skinparam linetype ortho

        package "Package1" {
            class Class1 {
                + method1(Type1 param1)
                + method2(Type2 param2)
                + method3(Type3 param3)
            }
            
            class Class2 {
                - attribute1 : Type1
                - attribute2 : Type2
                + method1()
                + method2(Type1 param)
            }

            class Class3 {
                + method1(Type1 param1)
                + method2()
                + method3(Type2 param)
            }

            Class1 --> Class2 : Relation1
            Class3 --> Class1 : Relation2
            Class2 --> Class3 : Relation3
        }

        package "Package2" {
            class Component1
            class Component2
            class Component3
            class Component4

            Class3 --> Component1
            Class3 --> Component2
            Class3 --> Component3
            Class3 --> Component4
        }

        package "Package3" {
            class Manager1 {
                + operation1()
            }
            
            class Manager2 {
                + operation2()
                + operation3()
            }

            Class1 --> Manager1 : Relation4
            Manager1 --> Manager2 : Relation5
            (...)
        }
        (...)
        package "(...)

        @enduml

"""


# Extract information from the repository
def collect(repo_path):
    full_content = ""
    # run tree command to get the structure of the repository
    tree_output = subprocess.run(['tree', repo_path], capture_output=True, text=True).stdout
    full_content += f"### Repository Structure\n\n```\n{tree_output}\n```\n\n"
    # extract the README file content
    readme_path = os.path.join(repo_path, 'README.md')
    if os.path.exists(readme_path):
        with open(readme_path, 'r') as f:
            readme_content = f.read()
        full_content += f"### README.md\n\n{readme_content}\n\n"
    # extract all the code files from each file of every format except sql, and sqlite3 from all the folders
    # and acupulates to the full_content, the file names like "/core/models.py, /core/views.py"
    for root, dirs, files in os.walk(repo_path):
        if '.git' in dirs:
            dirs.remove('.git')
        for file in files:
            if file.endswith(('.py', '.js', '.java', '.html', '.css', '.cpp', '.c', '.h', '.hpp', '.go', '.rb', '.rs', '.swift', '.kt', '.m', '.php', '.pl', '.sh', '.swift', '.ts', '.dart', '.cs', '.fs', '.fsx', '.fsi', '.fsproj', '.vb', '.vbs', '.bas', '.clj', '.cljs', '.cljc', '.edn', '.scala', '.sc', '.groovy', '.gradle', '.kt', '.kts', '.kts', '.ktm', 'md')):
                if file != "README.md" and file != "readme.md":
                    full_content += f"### {os.path.join(root, file)}\n\n```{file.split('.')[-1]}\n"
                    with open(os.path.join(root, file), 'r') as f:
                        full_content += f.read()
                    full_content += "\n```\n\n"
    #print(full_content)
    return full_content



def generate_response(query, code):
    # Step 1: Retrieve documents from the database based on the query
    ## Not implemented for now

    # Step 2: Some context
    context = UML_SYNTAX_TEMPLATE

    # Step 3: Generate content using the generative model (RAG)
    #response = model.generate_content(f"Question: {query}, \n\nCode: {code}, \n\n UML CODE SYNTAX Context: {context}")
    #return response
    prompt = f"Question: {query}\n\nCode: {code}\n\n UML CODE SYNTAX Context: {context}"

    # Call OpenAI to generate a response
    response = client.chat.completions.create(
        messages=[
            {"role": "system", "content": "You are a helpful assistant skilled in code analysis, architectual patterns recognizer and UML code generation."},
            {"role": "user", "content": prompt}
        ],
        # messages=[
        #     {
        #         "role": "user",
        #         "content": "Say this is a test",
        #     }
        # ],
        model="gpt-3.5-turbo",
    )
    
    return response


def format_response(response):
    # Extract the content part from the response (this assumes response is a dict-like structure)
    content = response.choices[0].message.content
    
    # Replace escaped newlines (\n) with actual newlines
    content = content.replace('\\n', '\n')
    
    # Find the UML code block (text inside triple backticks)
    code_blocks = re.findall(r'```plantuml(.*?)```', content, re.DOTALL)
    
    # If a code block exists, we'll extract the first one (assuming there's only one UML code block)
    code = code_blocks[0].strip() if code_blocks else ''
    
    # Remove the code block from the content to get the description
    description = re.sub(r'```.*?```', '', content, flags=re.DOTALL).strip()
    
    # Ensure that the code block has proper newlines
    code = code.replace('\\n', '\n').strip()
    
    return description, code



def generate_description_uml(repo_path):
    code = collect(repo_path)
    query = "Find all the architectual patterns that you find in this code, describe them and generate UML class diagram (give the code) for the following project code, you have some context about uml syntax that you can use if you want."
    response = generate_response(query, code)
    print(response)
    description, code = format_response(response)
    return description, code

