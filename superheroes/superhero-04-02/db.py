import firebase_admin
from firebase_admin import credentials, firestore
import os
from dotenv import load_dotenv

load_dotenv()


FIREBASE = "superhero-04-02.json"


def get_firebase():
    try:
        cred = credentials.Certificate(FIREBASE)
        firebase_admin.initialize_app(cred, {
            'databaseURL': "https://hero-alliance-feup-ds-24-25.firebaseio.com"
        })
        return firestore.client()
    except Exception as e:
        print(f"Error accessing firebase: {e}")
        return None


db = get_firebase()

