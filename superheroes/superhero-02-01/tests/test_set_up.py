import unittest
import os
from dotenv import load_dotenv
import google.generativeai as genai
import textwrap

from IPython.display import Markdown

# Load the environment variables from the specified .env file
dotenv_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../.env/.keys'))
print(f"Loading environment from: {dotenv_path}")
load_dotenv(dotenv_path)

def to_markdown(text):
    text = text.replace('•', '  *')
    return Markdown(textwrap.indent(text, '> ', predicate=lambda _: True))

class TestScript(unittest.TestCase):

    def test_load_environment_variables(self):
        # Load the real environment variable
        GOOGLE_API_KEY = os.getenv('CLOUD_KEY')
        
        # Print the actual API key from the environment
        print(f"Api key: {GOOGLE_API_KEY}")
        
        # Assertions
        self.assertIsNotNone(GOOGLE_API_KEY, "CLOUD_KEY should not be None. Make sure it is set in the .env/.keys file.")
        self.assertEqual(GOOGLE_API_KEY, os.getenv('CLOUD_KEY'))



    def test_gemini_pro_response(self):
        # Load the real environment variable
        GOOGLE_API_KEY = os.getenv('CLOUD_KEY')

        # Check if the API key is loaded
        self.assertIsNotNone(GOOGLE_API_KEY, "CLOUD_KEY should not be None. Make sure it is set in the .env/.keys file.")

        # Configure the Generative AI model with the API key
        genai.configure(api_key=GOOGLE_API_KEY)

        # Select the model
        model = genai.GenerativeModel('gemini-pro')

        # Write a prompt for testing
        prompt = "What is football?"

        try:
            # Generate content using the real model
            response = model.generate_content("What is football?") 
            
            to_markdown(response.text)

            # Print the actual response content
            for chunk in response:
                print(f"Response: {chunk.text}")
                self.assertTrue(len(chunk.text) > 0, "The chunk of text should not be empty.")
                print("_" * 80)

            # Assert that the response contains at least one chunk of text
            self.assertTrue(all(hasattr(chunk, 'text') for chunk in response), "All chunks should have a 'text' attribute.")

        except Exception as e:
            self.fail(f"Failed to generate content from gemini-pro: {e}")

if __name__ == '__main__':
    unittest.main()
