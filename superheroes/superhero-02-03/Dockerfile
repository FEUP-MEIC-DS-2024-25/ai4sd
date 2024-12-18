# Use an official Python runtime as the base image
FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container
COPY . .

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
RUN pip install --no-cache-dir \
    flask \
    google-generativeai \
    gunicorn

# Set environment variable for runtime configuration
ENV PYTHONUNBUFFERED=1

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application using Gunicorn
CMD ["gunicorn", "-w", "1", "--threads", "2", "-b", "0.0.0.0:8080", "prompt:app"]
