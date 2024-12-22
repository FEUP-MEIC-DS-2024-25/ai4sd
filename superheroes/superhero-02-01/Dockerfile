# Use an official Python runtime as a parent image
FROM python:3.12.6-slim

# Set the working directory in the container
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install --no-install-recommends -y \
    git

# Copy the entire project into the container
COPY . .

# ENV GOOGLE_APPLICATION_CREDENTIALS=hero-alliance-feup-ds-24-25-8825321d47ed.json

# Install Python dependencies
RUN pip install -r requirements.txt

# Expose the port the app runs on
EXPOSE 8080

# Run the application
CMD python manage.py runserver 0.0.0.0:8080 --insecure --noreload