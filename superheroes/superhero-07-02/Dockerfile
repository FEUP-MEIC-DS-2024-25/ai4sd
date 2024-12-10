FROM python:3.11-alpine

# Install FastAPI and Uvicorn (ASGI server)
RUN pip install --no-cache-dir fastapi uvicorn google-generativeai python-dotenv

# Set environment variable for Cloud Run to expect the port
ENV PORT 8080

# Copy the FastAPI app into the container
COPY app.py /app.py
copy .env /.env

# Copy the superheroes folder as well
# COPY ../superheroes /superheroes
COPY . .

# Expose the correct port
EXPOSE 8080

# Run the FastAPI app with Uvicorn
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "3333"]