#!/bin/bash

PROJECT_ID="hero-alliance-feup-ds-24-25"
for group in $(seq -w 1 8); do
  for hero in $(seq -w 1 5); do
    SA_NAME="superhero-0${group}-0${hero}"
    RESOURCE_NAME="google_service_account.superhero[\"${SA_NAME}\"]"
    
    # Ensure the resource block is defined in the Terraform files
    terraform import ${RESOURCE_NAME} "projects/${PROJECT_ID}/serviceAccounts/${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com" || {
      echo "ERROR: Failed to import ${SA_NAME}. Skipping."
      continue
    }
  done
done
