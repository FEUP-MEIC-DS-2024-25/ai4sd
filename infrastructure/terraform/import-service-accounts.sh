#!/bin/bash

# Define your project ID and the base account details
PROJECT_ID="hero-alliance-feup-ds-24-25"
BASE_NAME="superhero"
NUM_GROUPS=8  # Number of superhero groups (i ranges from 1 to 8)
NUM_SUPERHEROS=5  # Number of superheroes per group (j ranges from 1 to 5)

# Check if the service accounts already exist in the project
for i in $(seq 1 $NUM_GROUPS); do
  for j in $(seq 1 $NUM_SUPERHEROS); do
    ACCOUNT_ID="${BASE_NAME}-0${i}-0${j}"
    SERVICE_ACCOUNT_EMAIL="${ACCOUNT_ID}@${PROJECT_ID}.iam.gserviceaccount.com"
    
    # Check if the service account exists using gcloud
    EXISTING_ACCOUNT=$(gcloud iam service-accounts list --filter="email:${SERVICE_ACCOUNT_EMAIL}" --project=${PROJECT_ID} --format="value(email)")

    if [ "$EXISTING_ACCOUNT" != "" ]; then
      # Check if the service account is already imported into Terraform state
      IMPORT_EXISTS=$(terraform state list | grep "google_service_account.${ACCOUNT_ID}")
      
      if [ "$IMPORT_EXISTS" != "" ]; then
        echo "Service account ${SERVICE_ACCOUNT_EMAIL} is already imported. Skipping import."
      else
        # If the service account is not imported, append the resource block to main.tf
        echo "resource \"google_service_account\" \"${ACCOUNT_ID}\" {
  account_id   = \"${ACCOUNT_ID}\"
  display_name = \"Superhero 0${i}-0${j}\"
  project      = \"${PROJECT_ID}\"
}" >> main.tf

        # Import the service account into Terraform state
        echo "Importing service account: ${SERVICE_ACCOUNT_EMAIL}"
        terraform import google_service_account.${ACCOUNT_ID} "projects/${PROJECT_ID}/serviceAccounts/${SERVICE_ACCOUNT_EMAIL}"
        
        if [ $? -eq 0 ]; then
          echo "Successfully imported service account: ${SERVICE_ACCOUNT_EMAIL}"
        else
          echo "Failed to import service account: ${SERVICE_ACCOUNT_EMAIL}. Please check if the account exists."
        fi
      fi
    else
      echo "Service account ${SERVICE_ACCOUNT_EMAIL} does not exist. Skipping import."
    fi
  done
done