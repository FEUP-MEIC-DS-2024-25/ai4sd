FROM python:3.11-alpine

WORKDIR /app

# Install FastAPI and Uvicorn (ASGI server)
RUN pip install --no-cache-dir fastapi uvicorn google-generativeai python-dotenv google-cloud-secret-manager

# Set environment variable for Cloud Run to expect the port
ENV PORT 8080
ENV GCP_PROJECT_ID hero-alliance-feup-ds-24-25 

# Copy the superheroes folder as well
# COPY ../superheroes /superheroes
COPY . .

# Expose the correct port
EXPOSE 8080

# Run the FastAPI app with Uvicorn
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8080"]