import firebase_admin
from firebase_admin import credentials, firestore, auth
# Path to your Firebase service account key JSON file
# Initialize Firebase App
firebase_app = firebase_admin.initialize_app()

# Firestore Database
db = firestore.client()