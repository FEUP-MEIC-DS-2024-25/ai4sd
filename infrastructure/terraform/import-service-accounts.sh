#!/bin/bash

# Variables
PROJECT_ID="hero-alliance-feup-ds-24-25"
SUPERHERO_BATCHES=("1" "2" "3" "4" "5" "6" "7" "8")
SUPERHEROES_PER_BATCH=5  # Total superheroes per batch
BUCKET_NAME="hero-alliance-terraform-state-bucket"

# Initialize Terraform (Ensure the workspace is ready for imports)
terraform init -migrate-state -backend-config="bucket=${BUCKET_NAME}" -backend-config="prefix=terraform/state"

# Loop through all batches and superheroes
for batch in "${SUPERHERO_BATCHES[@]}"; do
  for hero in $(seq -w 1 $SUPERHEROES_PER_BATCH); do
    HERO_NAME="superhero-0${batch}-0${hero}"

    # Construct the resource name for Terraform import
    RESOURCE_NAME="google_service_account.superhero[\"${HERO_NAME}\"]"

    # Service account import URL
    SERVICE_ACCOUNT_URL="projects/${PROJECT_ID}/serviceAccounts/${HERO_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

    # Run Terraform import command
    echo "Importing service account ${HERO_NAME} into Terraform..."
    terraform import ${RESOURCE_NAME} ${SERVICE_ACCOUNT_URL}

    # Check if the import was successful
    if [[ $? -eq 0 ]]; then
      echo "Successfully imported ${HERO_NAME} service account!"
    else
      echo "Failed to import ${HERO_NAME} service account. Skipping..."
    fi
  done
done
