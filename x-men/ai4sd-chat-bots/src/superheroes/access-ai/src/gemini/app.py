from flask import Flask, request, jsonify
import google.generativeai as genai
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Configure Google Gemini API
genai.configure(api_key="AIzaSyBvDsp1QE9LGstzOA0yeVgvVqDriULfMr8")  # Replace with your API key

# Define the path to the directory containing the files
DIRECTORY_PATH = os.path.dirname(__file__)  # Directory containing HTML, CSS, and JS files
PROMPTS_PATH = os.path.join(DIRECTORY_PATH, 'prompts')  # Path to the 'prompts' folder

# Variable to track if it's the first call
first_call_done = False

def read_all_files(directory_path):
    content = ""
    try:
        for root, _, files in os.walk(directory_path):
            if 'frontend' in root:  # Skip folders named 'frontend'
                continue
            for file in files:
                if file.endswith(('.html', '.css', '.js')):  # Only process HTML, CSS, and JS files
                    file_path = os.path.join(root, file)
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content += f"\n\n--- {file} ---\n\n" + f.read()
    except Exception as e:
        return str(e), None
    return None, content

def read_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        return str(e)

@app.route('/submit', methods=['POST'])
def submit():
    global first_call_done  # Use the global variable to track the first call

    data = request.get_json()
    user_text = data.get('textInput', '')

    # Read all HTML, CSS, and JS files in the directory, skipping the 'frontend' folder
    error, file_content = read_all_files(DIRECTORY_PATH)
    if error:
        return jsonify({'error': f"Error reading files: {error}"}), 500

    # Prepare the prompt to send to Gemini
    full_prompt = user_text + "\n\n" + file_content

    if not first_call_done:
        # Primeira chamada - lê Context_prompt.txt da pasta 'prompts'
        context_file_path = os.path.join(PROMPTS_PATH, 'Context_prompt.txt')
        context_prompt = read_file(context_file_path)

        if isinstance(context_prompt, str) and context_prompt.startswith("Error"):
            return jsonify({'error': f"Error reading Context_prompt.txt: {context_prompt}"}), 500

        full_prompt = f"{context_prompt}\n\n{full_prompt}"  # Include Context_prompt.txt only on the first call
        first_call_done = True  # Mark that the first call has been made
    else:
        # Subsequent calls - lê os arquivos da pasta 'prompts'
        motor_file_path = os.path.join(PROMPTS_PATH, 'Motor_Prompt.txt')
        motor_prompt = read_file(motor_file_path)

        usability_file_path = os.path.join(PROMPTS_PATH, 'Usability_Prompt.txt')
        usability_prompt = read_file(usability_file_path)

        vision_file_path = os.path.join(PROMPTS_PATH, 'Vision_Prompt.txt')
        vision_prompt = read_file(vision_file_path)

        # Check if any file failed to load
        if isinstance(motor_prompt, str) and motor_prompt.startswith("Error"):
            return jsonify({'error': f"Error reading Motor_Prompt.txt: {motor_prompt}"}), 500
        if isinstance(usability_prompt, str) and usability_prompt.startswith("Error"):
            return jsonify({'error': f"Error reading Usability_Prompt.txt: {usability_prompt}"}), 500
        if isinstance(vision_prompt, str) and vision_prompt.startswith("Error"):
            return jsonify({'error': f"Error reading Vision_Prompt.txt: {vision_prompt}"}), 500

        # Combine the new prompts for subsequent calls
        full_prompt = f"{motor_prompt}\n\n{usability_prompt}\n\n{vision_prompt}\n\n{full_prompt}"

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
