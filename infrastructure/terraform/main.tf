terraform {
  backend "gcs" {
    bucket = "hero-alliance-terraform-state-bucket"
    prefix = "terraform/state"
  }
}

variable "project_id" {
  description = "The project ID to deploy resources"
  type        = string
  default     = "hero-alliance-feup-ds-24-25"
}

variable "image_timestamp" {
  description = "Timestamp for image versions"
  type        = string
  default     = "latest"  # Default value, can be overridden in Cloud Build.
}

variable "default_image" {
  default = "gcr.io/hero-alliance-feup-ds-24-25/hello-world"
}

provider "google" {
  project = var.project_id
  region  = "europe-west1"
}

# Enable required services
resource "google_project_service" "enable_services" {
  for_each = toset([
    "pubsub.googleapis.com",
    "containerregistry.googleapis.com",
    "logging.googleapis.com",
    "run.googleapis.com",
    "firestore.googleapis.com",
    "compute.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "artifactregistry.googleapis.com"
  ])
  service = each.key
}

# Service account for Cloud Build with lifecycle block to ignore changes
resource "google_service_account" "cloud_build_sa" {
  account_id = "cloud-build-sa"

  lifecycle {
    ignore_changes = [account_id]
  }
}

# IAM permissions for Cloud Build to impersonate superhero service accounts
resource "google_project_iam_member" "cloud_build_sa_service_account_actor" {
  count = length(google_service_account.superhero)

  project = var.project_id
  role    = "roles/cloudbuild.builds.builder"
  member  = "serviceAccount:${google_service_account.superhero[count.index].email}"
}

# Create and assign service account keys to Cloud Build SA for superhero impersonation
resource "google_service_account_key" "cloud_build_sa_key" {
  service_account_id = google_service_account.cloud_build_sa.name
  private_key_type   = "TYPE_GOOGLE_CREDENTIALS_FILE"
}

# Cloud Run Services for superheroes with default image if missing
resource "google_cloud_run_service" "superhero" {
  count    = 40
  name     = "superhero-${format("%02d", floor(count.index / 5) + 1)}-${format("%02d", (count.index % 5) + 1)}"
  location = "europe-west1"

  template {
    spec {
      containers {
        image = "gcr.io/${var.project_id}/superhero-${format("%02d", floor(count.index / 5) + 1)}-${format("%02d", (count.index % 5) + 1)}-${var.image_timestamp}"
      }
      service_account_name = google_service_account.superhero[count.index].email
    }
  }

  lifecycle {
    prevent_destroy = true
  }

  depends_on = [google_project_service.enable_services]
}

resource "google_service_account" "superhero" {
  count      = 40
  account_id = "superhero-${format("%02d", floor(count.index / 5) + 1)}-${format("%02d", (count.index % 5) + 1)}"
  display_name = "Superhero Service Account ${format("%02d", floor(count.index / 5) + 1)}-${format("%02d", (count.index % 5) + 1)}"
}


# Ensure Cloud Build can access the service account key in Secret Manager
resource "google_secret_manager_secret" "cloudbuild_sa_key" {
  secret_id = "cloudbuild-sa-key"

  replication {
    user_managed {
      replicas {
        location = "europe-west1"
      }
    }
  }

  lifecycle {
    ignore_changes = [secret_id]
  }
}


resource "google_secret_manager_secret_version" "cloudbuild_sa_key_version" {
  secret      = google_secret_manager_secret.cloudbuild_sa_key.id
  secret_data = google_service_account_key.cloud_build_sa_key.private_key
}

# Pub/Sub Topics
resource "google_pubsub_topic" "echo_superheroes" {
  name = "echo-superheroes"
  lifecycle {
    ignore_changes = [name]
  }
}

resource "google_pubsub_topic" "echo_jarvis" {
  name = "echo-jarvis"
  lifecycle {
    ignore_changes = [name]
  }
}

# Cloud Build service account permissions and IAM roles
resource "google_project_iam_member" "cloud_build_run_permissions" {
  project = var.project_id
  member  = "serviceAccount:${google_service_account.cloud_build_sa.email}"
  role    = "roles/run.admin"
}

# Cloud Build service account permissions for Docker and Cloud Storage
resource "google_project_iam_member" "cloud_build_storage_permissions" {
  project = var.project_id
  member  = "serviceAccount:${google_service_account.cloud_build_sa.email}"
  role    = "roles/storage.objectAdmin"
}

# Ensure Cloud Build SA can access Cloud Build secrets
resource "google_project_iam_member" "cloud_build_sa_secret_manager_permissions_v2" {
  project = var.project_id
  member  = "serviceAccount:${google_service_account.cloud_build_sa.email}"
  role    = "roles/secretmanager.secretAccessor"
}

resource "google_storage_bucket" "hero_alliance_bucket" {
  name     = "hero-alliance-terraform-state-bucket"
  location = "europe-west1"

  lifecycle {
    prevent_destroy = true  # Prevents Terraform from destroying the bucket
  }
}

resource "google_storage_bucket_iam_binding" "cloud_build_state_access" {
  bucket = google_storage_bucket.hero_alliance_bucket.name
  role   = "roles/storage.objectAdmin"
  members = [
    "serviceAccount:cloud-build-sa@${var.project_id}.iam.gserviceaccount.com"
  ]
}

resource "google_project_service" "artifact_registry" {
  service = "artifactregistry.googleapis.com"
  project = var.project_id
}

# Grant Cloud Build SA read permissions on Artifact Registry repository
resource "google_project_iam_member" "cloud_build_artifact_registry_permissions_reader" {
  project = var.project_id
  member  = "serviceAccount:${google_service_account.cloud_build_sa.email}"
  role    = "roles/artifactregistry.reader"
}

resource "google_artifact_registry_repository" "superhero_repo" {
  repository_id = "superhero-repo"  # Updated ID format
  location      = "us"
  format        = "DOCKER"
  project       = var.project_id
}

resource "google_artifact_registry_repository_iam_member" "cloud_build_artifact_registry_permissions" {
  repository = google_artifact_registry_repository.superhero_repo.id
  member     = "serviceAccount:${google_service_account.cloud_build_sa.email}"
  role       = "roles/artifactregistry.reader"

  depends_on = [google_artifact_registry_repository.superhero_repo]
}

# Grant Cloud Build SA full admin permissions on Artifact Registry repository
resource "google_project_iam_member" "cloud_build_artifact_registry_repo_admin" {
  project = var.project_id
  member  = "serviceAccount:${google_service_account.cloud_build_sa.email}"
  role    = "roles/artifactregistry.repositoryAdmin"
}

# Ensure Cloud Build SA has IAM roles to manage service accounts and deploy
resource "google_project_iam_member" "cloud_build_service_account_permissions" {
  project = var.project_id
  member  = "serviceAccount:${google_service_account.cloud_build_sa.email}"
  role    = "roles/iam.serviceAccountUser"
}

resource "google_project_iam_member" "cloud_build_service_account_user" {
  project = var.project_id
  member  = "serviceAccount:${google_service_account.cloud_build_sa.email}"
  role    = "roles/iam.serviceAccountUser"
}

resource "google_project_iam_member" "cloud_build_artifact_registry_permissions_writer" {
  project = var.project_id
  member  = "serviceAccount:${google_service_account.cloud_build_sa.email}"
  role    = "roles/artifactregistry.writer"
}

# Ensure Cloud Build SA can enable and list services
resource "google_project_iam_member" "cloud_build_service_usage_permissions" {
  project = var.project_id
  member  = "serviceAccount:${google_service_account.cloud_build_sa.email}"
  role    = "roles/serviceusage.serviceUsageConsumer"
}

# Grant Cloud Build SA permissions to modify IAM roles
resource "google_project_iam_member" "cloud_build_sa_security_admin" {
  project = var.project_id
  member  = "serviceAccount:${google_service_account.cloud_build_sa.email}"
  role    = "roles/iam.securityAdmin"
}

# Optionally, also grant owner permissions if needed for full access
resource "google_project_iam_member" "cloud_build_sa_owner" {
  project = var.project_id
  member  = "serviceAccount:${google_service_account.cloud_build_sa.email}"
  role    = "roles/owner"
}

# Ensure Cloud Build SA can access Artifact Registry and other permissions
resource "google_project_iam_member" "cloud_build_artifact_registry_permissions" {
  project = var.project_id
  member  = "serviceAccount:${google_service_account.cloud_build_sa.email}"
  role    = "roles/artifactregistry.reader"
}

# Ensure Cloud Build SA can use service accounts
resource "google_project_iam_member" "cloud_build_sa_service_account_user" {
  project = var.project_id
  member  = "serviceAccount:${google_service_account.cloud_build_sa.email}"
  role    = "roles/iam.serviceAccountUser"
}

# Ensure Cloud Build SA can interact with Cloud Run services
resource "google_project_iam_member" "cloud_build_cloud_run_permissions" {
  project = var.project_id
  member  = "serviceAccount:${google_service_account.cloud_build_sa.email}"
  role    = "roles/run.admin"
}

# Ensure Cloud Build SA has permissions to write to Firestore (Datastore)
resource "google_project_iam_member" "cloud_build_firestore_permissions" {
  project = var.project_id
  member  = "serviceAccount:${google_service_account.cloud_build_sa.email}"
  role    = "roles/datastore.owner"
}

# Ensure Cloud Build SA has Pub/Sub permissions
resource "google_project_iam_member" "cloud_build_pubsub_permissions" {
  project = var.project_id
  member  = "serviceAccount:${google_service_account.cloud_build_sa.email}"
  role    = "roles/pubsub.admin"
}

resource "google_project_iam_member" "cloud_build_storage_admin" {
  project = "hero-alliance-feup-ds-24-25" # Your project ID
  role    = "roles/storage.objectAdmin"  # The role granting permissions to manage objects in GCS
  member  = "serviceAccount:cloud-build-sa@hero-alliance-feup-ds-24-25.iam.gserviceaccount.com"
}

resource "google_storage_bucket_iam_member" "cloud_build_bucket_storage_admin" {
  bucket = "hero-alliance-terraform-state-bucket"  # Your GCS bucket name
  role   = "roles/storage.objectAdmin"
  member = "serviceAccount:cloud-build-sa@hero-alliance-feup-ds-24-25.iam.gserviceaccount.com"
}

resource "google_project_iam_member" "cloud_build_sa_permissions" {
  project = var.project_id
  member  = "serviceAccount:${google_service_account.cloud_build_sa.email}"
  role    = "roles/iam.serviceAccountUser"
}

resource "google_project_iam_member" "cloud_build_sa_service_account_admin" {
  project = var.project_id
  member  = "serviceAccount:${google_service_account.cloud_build_sa.email}"
  role    = "roles/iam.serviceAccountAdmin"
}