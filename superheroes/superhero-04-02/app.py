from flask import Flask, render_template
from flask_cors import CORS
#from flask_sqlalchemy import SQLAlchemy
import google.generativeai as genai
import os
from dotenv import load_dotenv
from gemini import *
from api import *


load_dotenv()
api_key = os.getenv("API_KEY")

genai.configure(api_key=api_key)

app = Flask(__name__)
CORS(app, resources={r".*": {"origins": "*"}})

app.register_blueprint(blueprint=blueprint)

app.register_blueprint(api)

# @app.route("/")
# def home():
#     return render_template("index.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
