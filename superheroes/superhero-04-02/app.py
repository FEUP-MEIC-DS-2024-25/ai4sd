from flask import Flask, render_template
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv
from gemini import *
from api import *


load_dotenv()
api_key = os.getenv("API_KEY", None)

genai.configure(api_key=api_key)

app = Flask(__name__)

CORS(app)

app.register_blueprint(blueprint=blueprint)

app.register_blueprint(api)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
