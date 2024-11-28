#!/bin/bash

# Variables
PROJECT_ID="hero-alliance-feup-ds-24-25"
REGION="europe-west1"  # Adjust as per your region
BUCKET_NAME="hero-alliance-nexus-bucket"
BUCKET_RESOURCE_NAME="google_storage_bucket.nexus"

# Initialize Terraform (Ensure the workspace is ready for imports)
terraform init -migrate-state -backend-config="bucket=hero-alliance-terraform-state-bucket" -backend-config="prefix=terraform/state"

# Run Terraform import command
echo "Importing Cloud Storage bucket ${BUCKET_NAME} into Terraform..."
terraform import ${BUCKET_RESOURCE_NAME} ${BUCKET_NAME}

# Check if the import was successful
if [[ $? -eq 0 ]]; then
  echo "Successfully imported Cloud Storage bucket ${BUCKET_NAME}!"
else
  echo "Failed to import Cloud Storage bucket ${BUCKET_NAME}. Skipping..."
fi
