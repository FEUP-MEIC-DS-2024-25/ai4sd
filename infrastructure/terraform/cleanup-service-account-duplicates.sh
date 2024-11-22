#!/bin/bash

# Get a list of all resources in the state
resources=$(terraform state list)

# Filter out service account resources
duplicates=$(echo "$resources" | grep 'google_service_account.superhero-')

# Identify and remove duplicates from the state
for resource in $duplicates; do
  # Count how many times the resource appears in the state list
  count=$(echo "$duplicates" | grep -c "$resource")
  
  if [[ $count -gt 1 ]]; then
    # If the resource appears more than once, remove duplicates except the first occurrence
    echo "Removing duplicate resource: $resource"
    terraform state rm "$resource"
  fi
done

# List resources in the state after removal
echo "Resources after cleanup:"
terraform state list
