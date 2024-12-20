import os
import textwrap
from pathlib import Path
from dotenv import load_dotenv
from openai import OpenAI
from google.cloud import secretmanager
import subprocess
import re
from .parser import parser_code
from rest_framework.response import Response

# env_path = Path(__file__).resolve().parent.parent / '.env' / '.keys'
# load_dotenv(dotenv_path=env_path)

def access_secret_version(version_id="latest"):
    try:
        client = secretmanager.SecretManagerServiceClient()
        name = f"projects/hero-alliance-feup-ds-24-25/secrets/superhero-02-01-secret/versions/latest"
        response = client.access_secret_version(request={"name": name})
        payload = response.payload.data.decode("UTF-8")
        print(f"Success accessing secret {name}")
        return payload
    except Exception as e:
        print(f"Error accessing secret version: {e}")
        return "teste"

try:
    OPENAI_API_KEY = access_secret_version()
except Exception as e:
    print(f"Error setting OPENAI_API_KEY: {e}")
    OPENAI_API_KEY = "teste"

client = OpenAI(
    api_key=OPENAI_API_KEY
)


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
    try:
        result = parser_code(repo_path)  # Note: there's also a variable name mismatch here
        if result:
            return result
        else:
            return Response({"error": "Failed to process repository data."}, status=500)
    except Exception as e:
        return Response({"error": f"Unexpected error: {str(e)}"}, status=500)



def generate_response(query, code):
    try:
        # Validate inputs
        if not code or not isinstance(code, str):
            print("Invalid code input")
            return None

        # Initialize OpenAI client
        try:
            api_key = access_secret_version()
            client = OpenAI(api_key=api_key)
        except Exception as e:
            print(f"Failed to initialize OpenAI client: {str(e)}")
            return None

        # Print debug info
        print(f"Making OpenAI request with code length: {len(code)}")

        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a helpful assistant skilled in code analysis, architectural patterns recognition and UML code generation."},
                {"role": "user", "content": f"""
                Question: {query}

                Project to analyze:
                ```
                {code}
                ```

                Simple mockup for you to add info to it and have a starting point:
                ```
                {UML_SYNTAX_TEMPLATE}
                ```
                """}
            ],
            model="gpt-3.5-turbo",
        )

        # Verify response
        if not response or not hasattr(response, 'choices'):
            print("Invalid response from OpenAI")
            return None

        return response

    except Exception as e:
        print(f"Error in generate_response: {str(e)}")
        return None



def format_response(response):
    if response is None:
        return "Error: Failed to get response from OpenAI", ""

    try:
        if not hasattr(response, 'choices') or not response.choices:
            return "Error: Invalid response format from OpenAI", ""

        content = response.choices[0].message.content
        if not content:
            return "Error: Empty response content", ""

        content = content.replace('\\n', '\n')

        # Find the UML code block
        code_blocks = re.findall(r'```(?:plantuml)?(.*?)```', content, re.DOTALL)

        # Extract code and description
        code = code_blocks[0].strip() if code_blocks else ''
        description = re.sub(r'```.*?```', '', content, flags=re.DOTALL).strip()

        return description, code

    except Exception as e:
        return f"Error formatting response: {str(e)}", ""



def generate_description_uml(repo_url):
    try:
        # Collect and validate code
        code = collect(repo_url)
        if code is None:
            return "Failed to collect repository data", ""

        # Print debug info
        print(f"Collected code successfully, length: {len(str(code))}")

        # Generate response
        query = "Detect all the architectural patterns of this project, describe them and generate UML class diagram (give the code)"
        response = generate_response(query, str(code))

        if response is None:
            return "Failed to get response from OpenAI", ""

        # Format response
        description, uml_code = format_response(response)

        # Print debug info
        print(f"Generated description length: {len(description)}, UML code length: {len(uml_code)}")

        return description, uml_code

    except Exception as e:
        error_msg = f"Error in generate_description_uml: {str(e)}"
        print(error_msg)
        return error_msg, ""

