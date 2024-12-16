from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai
import os
import re
import markdown
from io import BytesIO
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Chargement des variables d'environnement
load_dotenv()

# Initialisation de l'API Google Generative AI avec la clé API
genai.configure(api_key=os.environ["API_KEY"])

# Création de l'application FastAPI
app = FastAPI()
 

# Autoriser les requêtes CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialisation du modèle au démarrage de l'application
model = None

@app.on_event("startup")
async def startup():
    global model
    model = genai.GenerativeModel(
        model_name="gemini-1.5-pro",
        system_instruction=(
            "You are a chatbot that is only used to generate unit tests based on the code we give and only the code of unit test, you can also answer different questions in verification and validation field ONLY, you speak in English by default, give short answer by default but if the user needs more details you make it longer. Be polite."
        )
    )

# Route POST pour envoyer un fichier et un prompt
@app.post("/api/chat-with-file")
async def chat_with_file(
    prompt: str = Form(...),  # Récupérer le prompt depuis le formulaire
    file: UploadFile = None   # Récupérer le fichier téléchargé, s'il existe
):

    try:
        # Si un fichier est fourni, on l'enregistre temporairement
        if file:
            # Lire le contenu du fichier téléchargé
            file_contents = await file.read()

            # Sauvegarder le fichier temporairement ou l'utiliser directement comme un fichier binaire
            file_bytes = BytesIO(file_contents)

            mime_type = file.content_type if file.content_type != "application/octet-stream" else "text/plain"

            # Télécharger le fichier avec l'API Google, en passant le type MIME
            myfile = genai.upload_file(file_bytes, mime_type=mime_type)

            result = model.generate_content([myfile, "\n\n", prompt])

        else:
            result = model.generate_content([prompt])

        # Extraction de la réponse texte
        markdown_response = result.text

        # Conversion du Markdown en HTML
        html_response = markdown.markdown(markdown_response, extensions=['fenced_code']).replace('\n', '&#10;')

        return JSONResponse(content={"response": html_response})

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la génération de contenu: {str(e)}")

# Récupération du port à utiliser
host = "0.0.0.0"  # Cette adresse permet d'écouter toutes les interfaces réseau.
port = int(os.getenv("PORT", 8080))  # Utiliser le port fourni par Google Cloud ou 8000 par défaut.

# Lancer l'application
if __name__ == "__main__":
    uvicorn.run(app, host=host, port=port)
