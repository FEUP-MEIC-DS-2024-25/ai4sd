# Backend (Python)
FROM python:3.9-slim AS backend
WORKDIR /backend
COPY src/gemini /backend
RUN pip install --no-cache-dir flask google-generativeai flask-cors

# Frontend (Node.js)
FROM node:18-alpine AS frontend
WORKDIR /frontend
COPY . /frontend
RUN npm install && npm run compile

# Combine both backend and frontend
FROM python:3.9-slim
WORKDIR /app

# Copy backend
COPY --from=backend /backend /app/backend

# Copy frontend
COPY --from=frontend /frontend /app/frontend

# Install backend dependencies
RUN pip install --no-cache-dir flask google-generativeai flask-cors

# Expose ports for Flask (5000) and the frontend (3000, if necessary)
EXPOSE 5000
EXPOSE 3000

# Command to run the backend by default
CMD ["python", "/app/backend/app.py"]
