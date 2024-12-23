from google.cloud import firestore
import firebase_admin
from firebase_admin import credentials, firestore
import os
from dotenv import load_dotenv

load_dotenv()


def get_firebase():
    try: 
        if not firebase_admin._apps:
            cred = credentials.ApplicationDefault()
            firebase_admin.initialize_app(cred)
            print("Firebase initialized using Application Default Credentials")
        return firestore.client()
    except Exception as e:
        print(f"Error initializing Firebase using ADC: {e}")
        if not os.getenv("GOOGLE_APPLICATION_CREDENTIALS"):
            os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "superhero-04-02.json"
        if "GOOGLE_APPLICATION_CREDENTIALS" in os.environ:
            try:
                cred_path = os.environ["GOOGLE_APPLICATION_CREDENTIALS"]
                if os.path.exists(cred_path):
                    print(f"Initializing Firebase using Service Account from {cred_path}")
                    cred = credentials.Certificate(cred_path)
                    if firebase_admin._apps:
                        print("Deinitializing existing Firebase app...")
                        firebase_admin.delete_app(firebase_admin.get_app())
                    print(f"Initializing Firebase using Service Account from {cred_path}")
                    firebase_admin.initialize_app(cred)
                    return firestore.client()
                else:
                    print("Error: the file specified in GOOGLE_APPLICATION_CREDENTIALS doesn't exist")
            except Exception as e:
                print(f"Error initializing Firebase from GOOGLE_APPLICATION_CREDENTIALS: {e}")
        return None
    
os.environ["ASSISTANT_ID"] = "superhero-04-02"

db = get_firebase()

# check if db is None
if db is None:
    print("Could not initialize Firebase. Exiting.")
    exit(1)


