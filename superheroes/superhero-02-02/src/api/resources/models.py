import os, sys
sys.path.append(os.path.dirname((os.path.abspath(__file__))))

from flask import jsonify
from flask_restful import Resource

from communication.llms.groq import Groq

class Models(Resource):
    def get(self):
        groq = Groq()
        return jsonify({"data": groq.get_models()})