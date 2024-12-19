# Use an official Python runtime as the base image
FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /app

# Accept the service account key as a build argument
ARG SERVICE_ACCOUNT_KEY

# Write the service account key to a file
RUN echo "$SERVICE_ACCOUNT_KEY" > /app/credentials.json

# Set the correct ownership and permissions for the credentials file
RUN chmod 600 /app/credentials.json

# Copy the current directory contents into the container
COPY . .

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    apt-transport-https \
    ca-certificates \
    gnupg \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Google Cloud SDK
RUN echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" \
    | tee -a /etc/apt/sources.list.d/google-cloud-sdk.list && \
    curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key --keyring /usr/share/keyrings/cloud.google.gpg add - && \
    apt-get update && apt-get install -y google-cloud-sdk

# Install Python dependencies
RUN pip install --no-cache-dir \
    flask \
    google-generativeai \
    google-cloud-secret-manager==2.15.1 \
    google-auth==2.22.0 \
    gunicorn

# Set environment variable for runtime configuration
ENV GOOGLE_APPLICATION_CREDENTIALS=/app/credentials.json
ENV PYTHONUNBUFFERED=1

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application using Gunicorn
CMD ["gunicorn", "-w", "1", "--threads", "2", "-b", "0.0.0.0:8080", "prompt:app"]
