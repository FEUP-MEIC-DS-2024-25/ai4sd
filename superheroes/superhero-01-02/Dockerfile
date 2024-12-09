# Étape 1 : Utiliser une image Python officielle comme base
FROM python:3.11-slim

# Étape 2 : Définir le répertoire de travail
WORKDIR /app

# Étape 3 : Copier les fichiers nécessaires dans l'image
COPY . /app

# Étape 4 : Installer les dépendances
RUN pip install --no-cache-dir -r requirements.txt

# Étape 5 : Exposer le port que FastAPI utilise (8000 par défaut)
EXPOSE 8080

# Étape 6 : Commande pour lancer l'application avec uvicorn
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8080"]
