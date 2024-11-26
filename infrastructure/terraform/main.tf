provider "google" {
  project = var.project_id
  region  = "europe-west1"
}

terraform {
  backend "gcs" {
    bucket = "hero-alliance-state"
    prefix = "terraform/state"
  }
}

locals {
  superhero_names = flatten([for i in range(1, 9) : [for j in range(1, 6) : "superhero-0${i}-0${j}"]])
  superhero_batches = chunklist(local.superhero_names, 5)
}

variable "project_id" {
  description = "The project ID to deploy resources"
  type        = string
  default     = "hero-alliance-feup-ds-24-25"
}

variable "build_id" {
  description = "Build ID from Cloud Build for image versioning"
  type        = string
}

variable "default_image" {
  description = "The default image to be used for cloud runs"
  type    = string
  default = "gcr.io/hero-alliance-feup-ds-24-25/testapp"
}

resource "google_project_service" "enable_services" {
  for_each = toset([
    "pubsub.googleapis.com",
    "containerregistry.googleapis.com",
    "logging.googleapis.com",
    "run.googleapis.com",
    "firestore.googleapis.com",
    "compute.googleapis.com", 
    "cloudresourcemanager.googleapis.com",
    "iam.googleapis.com"
  ])
  service = each.key
}

resource "time_sleep" "cloud_run_service_delay" {
  for_each       = toset(local.superhero_names)  
  create_duration = "20s"
}

#################################
### CLOUD BUILD #################
#################################

resource "google_service_account" "cloud_build_sa" {
  description = "Service account for cloud-build-sa"
  account_id  = "cloud-build-sa"

  lifecycle {
    ignore_changes = [account_id, display_name]
  }
}

resource "google_service_account" "compute_service_account" {
  account_id   = "compute"
  display_name = "Compute Engine default service account"
  project      = var.project_id
}

resource "google_service_account_key" "cloud_build_sa_key" {
  service_account_id = google_service_account.cloud_build_sa.name
  private_key_type   = "TYPE_GOOGLE_CREDENTIALS_FILE"

  lifecycle {
    ignore_changes = [service_account_id]
  }
}

resource "google_secret_manager_secret" "cloudbuild_sa_key" {
  secret_id = "cloudbuild-sa-key"

  replication {
    user_managed {
      replicas {
        location = "europe-west1"
      }
    }
  }
}

resource "google_secret_manager_secret_version" "cloudbuild_sa_key_version" {
  secret      = google_secret_manager_secret.cloudbuild_sa_key.id
  secret_data = google_service_account_key.cloud_build_sa_key.private_key
}

resource "google_project_iam_member" "cloud_build_service_account_admin" {
  project = var.project_id
  member  = "serviceAccount:${google_service_account.cloud_build_sa.email}"
  role    = "roles/iam.serviceAccountAdmin"
}

resource "google_project_iam_member" "cloud_build_storage_cloud_build_sa_object_admin" {
  project = var.project_id
  member  = "serviceAccount:${google_service_account.cloud_build_sa.email}"
  role    = "roles/storage.objectAdmin"
}

resource "google_project_iam_member" "cloud_build_artifact_registry_cloud_build_sa_writer" {
  project = var.project_id
  member  = "serviceAccount:${google_service_account.cloud_build_sa.email}"
  role    = "roles/artifactregistry.writer"
}

resource "google_project_iam_member" "cloud_build_cloud_build_sa_service_account_user" {
  project = var.project_id
  member  = "serviceAccount:${google_service_account.cloud_build_sa.email}"
  role    = "roles/iam.serviceAccountUser"
  depends_on = [google_service_account.compute_service_account]
}

resource "google_project_iam_member" "cloud_build_sa_impersonate_superheroes" {
  for_each = toset(local.superhero_names)
  project  = var.project_id
  member   = "serviceAccount:${google_service_account.cloud_build_sa.email}"
  role     = "roles/iam.serviceAccountUser"
  depends_on = [google_service_account.superhero]
}

resource "google_project_iam_member" "cloud_build_service_usage_permissions" {
  project = var.project_id
  member  = "serviceAccount:${google_service_account.cloud_build_sa.email}"
  role    = "roles/serviceusage.serviceUsageConsumer"

  depends_on = [google_service_account.cloud_build_sa]
}

resource "google_project_iam_member" "cloud_build_sa_security_admin" {
  project = var.project_id
  member  = "serviceAccount:${google_service_account.cloud_build_sa.email}"
  role    = "roles/iam.securityAdmin"

  depends_on = [google_service_account.cloud_build_sa]
}

resource "google_project_iam_member" "cloud_build_sa_owner" {
  project = var.project_id
  member  = "serviceAccount:${google_service_account.cloud_build_sa.email}"
  role    = "roles/owner"

  depends_on = [google_service_account.cloud_build_sa]
}

resource "google_project_iam_member" "cloud_build_sa_artifact_registry_permissions" {
  project = var.project_id
  member  = "serviceAccount:${google_service_account.cloud_build_sa.email}"
  role    = "roles/artifactregistry.writer"
}

resource "google_project_iam_member" "cloud_build_storage_permissions" {
  project = var.project_id
  member  = "serviceAccount:${google_service_account.cloud_build_sa.email}"
  role    = "roles/storage.admin"
}

resource "google_project_iam_member" "cloud_build_sa_run_admin" {
  project = var.project_id
  member  = "serviceAccount:${google_service_account.cloud_build_sa.email}"
  role    = "roles/run.admin"
}

resource "google_project_iam_member" "cloud_build_sa_run_deployment" {
  project = var.project_id
  member  = "serviceAccount:${google_service_account.cloud_build_sa.email}"
  role    = "roles/run.developer"
}

resource "google_project_iam_member" "cloud_build_secret_manager_access" {
  project = var.project_id
  member  = "serviceAccount:${google_service_account.cloud_build_sa.email}"
  role    = "roles/secretmanager.secretAccessor"
}

resource "google_project_iam_member" "cloud_build_sa_compute_impersonation_act_as" {
  project = var.project_id
  member  = "serviceAccount:${google_service_account.cloud_build_sa.email}"
  role    = "roles/iam.serviceAccountActor"
  depends_on = [google_service_account.compute_service_account]
}

resource "google_project_iam_member" "cloud_build_sa_impersonate_superheroes_act_as" {
  for_each = toset(local.superhero_names)
  project  = var.project_id
  member   = "serviceAccount:${google_service_account.cloud_build_sa.email}"
  role     = "roles/iam.serviceAccountActor"
  depends_on = [google_service_account.superhero]
}

#################################
### SUPERHEROES #################
#################################

resource "google_service_account" "superhero" {
  for_each = toset(local.superhero_names)

  account_id   = each.key
  display_name = "Superhero Service Account ${each.key}"
  project      = var.project_id

  lifecycle {
    ignore_changes = [account_id]
  }

  depends_on = [google_project_service.enable_services]
}

resource "google_cloud_run_service" "superhero" {
  for_each = toset(local.superhero_names)

  name     = each.key
  location = "europe-west1"

  template {
    spec {
      containers {
        image = fileexists("../superheroes/${each.key}/Dockerfile") ? "gcr.io/${var.project_id}/${each.key}-${var.build_id}" : var.default_image
      }
      service_account_name = "cloud-build-sa@${var.project_id}.iam.gserviceaccount.com"
    }
  }
  lifecycle {
    ignore_changes = [name]
    prevent_destroy = false
  }

  timeouts {
    create = "10m"
    update = "10m"
    delete = "10m"
  }

  depends_on = [
    google_service_account.superhero,
    time_sleep.cloud_run_service_delay,
    google_project_service.enable_services
  ]
}

resource "google_cloud_run_service_iam_member" "superhero_invoker" {
  for_each = toset(local.superhero_names)
  project = var.project_id
  service = "serviceAccount:${google_service_account.superhero[each.key].email}"
  member = "allUsers"
  role = "roles/run.invoker"
}

resource "google_storage_bucket_iam_member" "superheroes_rw_access" {
  for_each = toset(local.superhero_names)
  bucket   = google_storage_bucket.avengers.name
  role     = "roles/storage.objectAdmin"
  member   = "serviceAccount:${google_service_account.superhero[each.key].email}"
}

resource "google_pubsub_topic_iam_member" "superheroes_pubsub_echo_jarvis_publisher" {
  for_each = toset(local.superhero_names)
  topic    = google_pubsub_topic.echo_jarvis.name
  member   = "serviceAccount:${google_service_account.superhero[each.key].email}"
  role     = "roles/pubsub.publisher"
}

resource "google_pubsub_topic_iam_member" "superheroes_pubsub_echo_jarvis_subscriber" {
  for_each = toset(local.superhero_names)
  topic    = google_pubsub_topic.echo_jarvis.name
  member   = "serviceAccount:${google_service_account.superhero[each.key].email}"
  role     = "roles/pubsub.subscriber"
}

resource "google_pubsub_topic_iam_member" "superheroes_pubsub_echo_superheroes_publisher" {
  for_each = toset(local.superhero_names)
  topic    = google_pubsub_topic.echo_superheroes.name
  member   = "serviceAccount:${google_service_account.superhero[each.key].email}"
  role     = "roles/pubsub.publisher" 
}

resource "google_pubsub_topic_iam_member" "superheroes_pubsub_echo_superheroes_subscriber" {
  for_each = toset(local.superhero_names)
  topic    = google_pubsub_topic.echo_superheroes.name
  member   = "serviceAccount:${google_service_account.superhero[each.key].email}"
  role     = "roles/pubsub.subscriber"
}

resource "google_storage_bucket_iam_member" "superhero_crud_access" {
  for_each = toset(local.superhero_names)

  bucket = google_storage_bucket.nexus.name
  role   = "roles/storage.objectAdmin"
  member = "serviceAccount:${google_service_account.superhero[each.key].email}"

  lifecycle {
    prevent_destroy = false
  }

  depends_on = [google_storage_bucket.nexus]
}

resource "google_project_iam_member" "superhero_vault_crud_permissions" {
  for_each = toset(local.superhero_names)
  project  = var.project_id
  member   = "serviceAccount:${google_service_account.superhero[each.key].email}"
  role     = "roles/datastore.user"

  depends_on = [google_service_account.superhero]
}

resource "google_pubsub_subscription" "echo_jarvis_superhero_subscription" {
  for_each = toset(flatten([for x in range(1, 9) : [for y in range(1, 6) : "superhero-0${x}-0${y}"]]))

  name  = "echo-jarvis-subscription-${each.value}"
  topic = google_pubsub_topic.echo_jarvis.name

  push_config {
    push_endpoint = "https://${each.value}-150699885662.europe-west1.run.app"
  }
}

# Creating subscriptions for all superheroes (superhero-0X-0Y) and Strange to echo-superheroes
resource "google_pubsub_subscription" "superheroes_subscriptions" {
  for_each = toset(flatten([for x in range(1, 9) : [for y in range(1, 6) : "superhero-0${x}-0${y}"]]))

  name  = "echo-superheroes-subscription-${each.value}"
  topic = google_pubsub_topic.echo_superheroes.name

  push_config {
    push_endpoint = "https://${each.value}-150699885662.europe-west1.run.app"
  }
}

#################################
### ECHOES ######################
#################################

resource "google_pubsub_topic" "echo_superheroes" {
  name = "echo-superheroes"
  lifecycle {
    prevent_destroy = false
  }
}

resource "google_pubsub_topic" "echo_jarvis" {
  name = "echo-jarvis"
  lifecycle {
    prevent_destroy = false
  }
}

#################################
### NEXUS #######################
#################################

resource "google_storage_bucket" "nexus" {
  name     = "hero-alliance-nexus"
  location = "europe-west1"
  lifecycle {
    prevent_destroy = false
  }
}

#################################
### JARVIS ######################
#################################

resource "google_service_account" "jarvis" {
  account_id   = "hero-alliance-jarvis"
  display_name = "Jarvis Service Account"
  project      = var.project_id

  lifecycle {
    ignore_changes = [account_id, display_name]
  }
}

resource "google_cloud_run_service" "jarvis" {
  name     = "jarvis"
  location = "europe-west1"
  project  = var.project_id

  template {
    spec {
      containers {
        image = fileexists("../jarvis/Dockerfile") ? "gcr.io/${var.project_id}/jarvis-${var.build_id}" : var.default_image
        env {
          name  = "PUBSUB_TOPIC"
          value = google_pubsub_topic.echo_jarvis.name
        }
      }
      service_account_name = google_service_account.jarvis.email
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  depends_on = [google_service_account.jarvis]
}

output "jarvis_url" {
  value = google_cloud_run_service.jarvis.status[0].url
  description = "The URL of the Jarvis Cloud Run service"
}

resource "google_pubsub_topic_iam_member" "strange_pubsub_echo_jarvis_publisher" {
  topic  = google_pubsub_topic.echo_jarvis.name
  member = "serviceAccount:${google_service_account.strange.email}"
  role   = "roles/pubsub.publisher"
}

resource "google_pubsub_topic_iam_member" "strange_pubsub_echo_jarvis_subscriber" {
  topic  = google_pubsub_topic.echo_jarvis.name
  member = "serviceAccount:${google_service_account.strange.email}"
  role   = "roles/pubsub.subscriber"
}

resource "google_cloud_run_service_iam_member" "jarvis_invoker" {
  service = google_cloud_run_service.jarvis.name
  location = google_cloud_run_service.jarvis.location
  member = "allUsers"
  role = "roles/run.invoker"
}

resource "google_project_iam_member" "jarvis_firestore_permissions" {
  project  = var.project_id
  member   = "serviceAccount:${google_service_account.jarvis.email}"
  role     = "roles/datastore.user"

  depends_on = [google_firestore_database.vault]
}

resource "google_pubsub_topic_iam_member" "jarvis_pubsub_publisher" {
  topic  = google_pubsub_topic.echo_jarvis.name
  member = "serviceAccount:${google_service_account.jarvis.email}"
  role   = "roles/pubsub.publisher"
}

resource "google_pubsub_topic_iam_member" "jarvis_pubsub_subscriber" {
  topic  = google_pubsub_topic.echo_jarvis.name
  member = "serviceAccount:${google_service_account.jarvis.email}"
  role   = "roles/pubsub.subscriber"
}

resource "google_pubsub_subscription" "echo_jarvis_jarvis_subscription" {
  name  = "echo-jarvis-subscription"
  topic = google_pubsub_topic.echo_jarvis.name

  # Ensure Jarvis can pull messages
  push_config {
    push_endpoint = "https://jarvis-150699885662.europe-west1.run.app"  # Replace with the actual Cloud Run URL for Jarvis
  }
}


#################################
### STRANGE #####################
#################################

resource "google_service_account" "strange" {
  account_id   = "hero-alliance-strange"
  display_name = "Strange Service Account"
  project      = var.project_id

  lifecycle {
    ignore_changes = [account_id, display_name]
  }
}

resource "google_cloud_run_service" "strange" {
  name     = "strange"
  location = "europe-west1"
  project  = var.project_id

  template {
    spec {
      containers {
        image = fileexists("../strange/Dockerfile") ? "gcr.io/${var.project_id}/strange-${var.build_id}" : var.default_image
        env {
          name  = "PUBSUB_TOPIC"
          value = google_pubsub_topic.echo_superheroes.name
        }
      }
      service_account_name = google_service_account.strange.email
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  depends_on = [google_service_account.strange]
}

# Creating subscription for Strange to echo-superheroes
resource "google_pubsub_subscription" "strange_subscription" {
  name  = "strange-subscription"
  topic = google_pubsub_topic.echo_superheroes.name

  # Allow Strange to pull and push messages
  push_config {
    push_endpoint = "https://strange-150699885662.europe-west1.run.app"  # Replace with actual endpoint if needed
  }
}

#################################
### AVENGERS ####################
#################################

resource "google_storage_bucket" "avengers" {
  name          = "hero-alliance-avengers"
  location      = "europe-west1"
  storage_class = "STANDARD"
  project       = var.project_id

  uniform_bucket_level_access = true

  website {
    main_page_suffix = "index.html"
    not_found_page   = "404.html"
  }
}

#################################
### VAULT #######################
#################################

resource "google_firestore_database" "vault" {
  name        = "(default)"
  project     = var.project_id
  location_id = "europe-west1"
  type        = "FIRESTORE_NATIVE"
  depends_on  = [google_project_service.enable_services]
}

#################################
### PERMISSIONS #################
#################################

resource "google_storage_bucket_iam_member" "jarvis_crud_access_strange" {
  bucket = google_storage_bucket.nexus.name
  role   = "roles/storage.objectAdmin"
  member = "serviceAccount:${google_service_account.strange.email}"
}

resource "google_cloud_run_service_iam_member" "strange_invoker" {
  service = google_cloud_run_service.strange.name
  location = google_cloud_run_service.strange.location
  member = "allUsers"
  role = "roles/run.invoker"
}


resource "google_pubsub_topic_iam_member" "strange_pubsub_echo_superheroes_publisher" {
  topic  = google_pubsub_topic.echo_superheroes.name
  member = "serviceAccount:${google_service_account.strange.email}"
  role   = "roles/pubsub.publisher"
}

resource "google_pubsub_topic_iam_member" "strange_pubsub_echo_superheroes_subscriber" {
  topic  = google_pubsub_topic.echo_superheroes.name
  member = "serviceAccount:${google_service_account.strange.email}"
  role   = "roles/pubsub.subscriber"
}

resource "google_storage_bucket_iam_member" "jarvis_crud_access_jarvis" {
  bucket = google_storage_bucket.nexus.name
  role   = "roles/storage.objectAdmin"
  member = "serviceAccount:${google_service_account.jarvis.email}"
}

resource "google_storage_bucket_iam_member" "cloud_admin_full_access" {
  bucket = google_storage_bucket.nexus.name
  role   = "roles/storage.admin"
  member = "serviceAccount:${google_service_account.cloud_build_sa.email}"
}

resource "google_project_iam_member" "cloud_build_sa_jarvis_impersonation" {
  project = var.project_id
  member  = "serviceAccount:${google_service_account.cloud_build_sa.email}"
  role    = "roles/iam.serviceAccountUser"

  depends_on = [google_service_account.jarvis]
}


resource "google_storage_bucket_iam_member" "public_read_access" {
  bucket = google_storage_bucket.avengers.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}


resource "google_project_iam_member" "strange_firestore_permissions" {
  project  = var.project_id
  member   = "serviceAccount:${google_service_account.strange.email}"
  role     = "roles/datastore.user"

  depends_on = [google_firestore_database.vault]
}