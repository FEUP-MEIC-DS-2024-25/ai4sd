import firebase_admin
from firebase_admin import credentials, firestore, auth

# Path to your Firebase service account key JSON file
FIREBASE_CREDENTIALS = 'app/dst06g02-sevice_account.json'

# Initialize Firebase App
cred = credentials.Certificate(FIREBASE_CREDENTIALS)
firebase_app = firebase_admin.initialize_app(cred)

# Firestore Database
db = firestore.client()