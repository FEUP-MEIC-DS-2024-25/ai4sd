# AIzaSyBvDsp1QE9LGstzOA0yeVgvVqDriULfMr8
# instalar o flask pip install flask
# instalar o flask_cors pip install flask_cors
# instalar o google generative ai pip install google-generativeai


# app.py
from flask import Flask, request, jsonify
import google.generativeai as genai
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Configure Google Gemini API
genai.configure(api_key="AIzaSyBvDsp1QE9LGstzOA0yeVgvVqDriULfMr8")

# Define the path to the file in the same folder
FILE_PATH = os.path.join(os.path.dirname(__file__), "your_file.html")  # Replace with your actual file name



@app.route('/submit', methods=['POST'])
def submit():
    data = request.get_json()
    user_text = data.get('textInput', '')

    # Read additional text from the file
    file_content = ""
    try:
        with open(FILE_PATH, 'r') as f:
            file_content = f.read()
    except Exception as e:
        return jsonify({'error': f"Error reading file: {str(e)}"}), 500

    # Combine user input and file content for the Gemini prompt
    full_prompt = f"{user_text}\n\n{file_content}"

    # Send the prompt to Gemini
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(full_prompt)
        gemini_response = response.text
    except Exception as e:
        return jsonify({'error': f"Error fetching Gemini response: {str(e)}"}), 500

    return jsonify({'response': gemini_response})


if __name__ == '__main__':
    app.run(debug=True)