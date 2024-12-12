import firebase_admin
from firebase_admin import credentials, firestore
import os
from dotenv import load_dotenv

load_dotenv()

json_cred = os.getenv("MY_FIREBASE_ADMIN", None)

if json_cred:
    # Inicializa o Firebase apenas se o JSON estiver definido
    cred = credentials.Certificate(json_cred)
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    print("Firebase started successfully!")
else:
    db = None
    print("MY_FIREBASE_ADMIN don't define")
