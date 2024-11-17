#!/bin/bash

# Check if a timestamp argument is provided
if [ -z "$1" ]; then
  echo "ERROR: No timestamp provided. Exiting..."
  exit 1
fi

# Set the timestamp from the argument
TIMESTAMP=$1
echo "Using timestamp: ${TIMESTAMP}"

# Set your project ID (replace with your project ID)
PROJECT_ID="hero-alliance-feup-ds-24-25"

# Authenticate Docker to Google Cloud
gcloud auth configure-docker

# Set the GCR registry path
REGISTRY="gcr.io/${PROJECT_ID}"

# Pull the hello-app base image (you can replace this with your own app images if needed)
docker pull gcr.io/google-samples/hello-app:1.0

# Loop over the range of superheroes
for x in {1..8}; do
  for y in {1..5}; do
    IMAGE_NAME="superhero-0${x}-0${y}-${TIMESTAMP}"

    # Tag the image with the full registry path and timestamped superhero name
    docker tag gcr.io/google-samples/hello-app:1.0 "${REGISTRY}/superhero-0${x}-0${y}-${TIMESTAMP}:latest"

    # Push the image to Google Container Registry with the "latest" tag
    docker push "${REGISTRY}/superhero-0${x}-0${y}-${TIMESTAMP}:latest"

    echo "Pushed image: ${REGISTRY}/superhero-0${x}-0${y}-${TIMESTAMP}:latest"
  done
done

# Add images for avengers-backend and xmen-backend with timestamp
BACKENDS=("avengers-backend" "xmen-backend")

for backend in "${BACKENDS[@]}"; do
  IMAGE_NAME="${backend}-${TIMESTAMP}"

  # Tag the image with the full registry path and timestamped backend name
  docker tag gcr.io/google-samples/hello-app:1.0 "${REGISTRY}/${backend}-${TIMESTAMP}:latest"

  # Push the image to Google Container Registry with the "latest" tag
  docker push "${REGISTRY}/${backend}-${TIMESTAMP}:latest"

  echo "Pushed image: ${REGISTRY}/${backend}-${TIMESTAMP}:latest"
done

# Add image for avengers-frontend with timestamp
AVENGERS_FRONTEND="avengers-frontend"
IMAGE_NAME="${AVENGERS_FRONTEND}-${TIMESTAMP}"

# Tag the image with the full registry path and timestamped frontend name
docker tag gcr.io/google-samples/hello-app:1.0 "${REGISTRY}/${AVENGERS_FRONTEND}-${TIMESTAMP}:latest"

# Push the image to Google Container Registry with the "latest" tag
docker push "${REGISTRY}/${AVENGERS_FRONTEND}-${TIMESTAMP}:latest"

echo "Pushed image: ${REGISTRY}/${AVENGERS_FRONTEND}-${TIMESTAMP}:latest"

# Add image for jarvis with timestamp
JARVIS="jarvis"
IMAGE_NAME="${JARVIS}-${TIMESTAMP}"

# Tag the image with the full registry path and timestamped jarvis name
docker tag gcr.io/google-samples/hello-app:1.0 "${REGISTRY}/${JARVIS}-${TIMESTAMP}:latest"

# Push the image to Google Container Registry with the "latest" tag
docker push "${REGISTRY}/${JARVIS}-${TIMESTAMP}:latest"

echo "Pushed image: ${REGISTRY}/${JARVIS}-${TIMESTAMP}:latest"
