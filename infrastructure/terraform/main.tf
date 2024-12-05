#################################
### SECRETS #####################
#################################

resource "google_secret_manager_secret" "superhero_secrets" {
  for_each = toset(flatten([for hero in local.superhero_names : ["${hero}-secret-1", "${hero}-secret-2", "${hero}-secret-3"]]))

  secret_id = each.key
  replication {
    user_managed {
      replicas {
        location = "europe-west1"
      }
    }
  }
}

resource "google_secret_manager_secret_iam_member" "cloud_build_secret_admin" {
  for_each = google_secret_manager_secret.superhero_secrets

  secret_id = google_secret_manager_secret.superhero_secrets[each.key].id
  role      = "roles/secretmanager.admin"
  member    = "serviceAccount:${google_service_account.cloud_build_sa.email}"
}

resource "google_secret_manager_secret_iam_member" "cloud_build_sa_secret_admin" {
  for_each = google_secret_manager_secret.superhero_secrets

  secret_id = google_secret_manager_secret.superhero_secrets[each.key].id
  role      = "roles/secretmanager.admin"
  member    = "serviceAccount:${google_service_account.cloud_build_sa.email}"
}

resource "google_secret_manager_secret_iam_member" "superhero_secret_access" {
  for_each = google_secret_manager_secret.superhero_secrets

  secret_id = google_secret_manager_secret.superhero_secrets[each.key].id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.superhero[each.key]?.email}"
}

resource "google_secret_manager_secret_iam_member" "superhero_secret_version" {
  for_each = google_secret_manager_secret.superhero_secrets

  secret_id = google_secret_manager_secret.superhero_secrets[each.key].id
  role      = "roles/secretmanager.SecretVersionManager"
  member    = "serviceAccount:${google_service_account.superhero[each.key]?.email}"
}

resource "google_secret_manager_secret" "jarvis_secrets" {
  for_each = {
    secret1 = "jarvis-secret-1"
    secret2 = "jarvis-secret-2"
    secret3 = "jarvis-secret-3"
  }

  secret_id = each.value
  replication {
    user_managed {
      replicas {
        location = "europe-west1"
      }
    }
  }
}

resource "google_secret_manager_secret_iam_member" "jarvis_secret_version_manager" {
  for_each = google_secret_manager_secret.superhero_secrets

  secret_id = google_secret_manager_secret.superhero_secrets[each.key].id
  role      = "roles/secretmanager.secretVersionManager"
  member    = "serviceAccount:${google_service_account.jarvis.email}"
}

resource "google_secret_manager_secret_iam_member" "jarvis_secret_access" {
  for_each = google_secret_manager_secret.jarvis_secrets

  secret_id = each.value.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:example-sa@project-id.iam.gserviceaccount.com"
}

resource "google_secret_manager_secret_iam_member" "jarvis_secret_version" {
  for_each = google_secret_manager_secret.jarvis_secrets

  secret_id = each.value.id
  role      = "roles/secretmanager.secretVersionManager"
  member    = "serviceAccount:${google_service_account.jarvis.email}"
}

resource "google_secret_manager_secret" "strange_secrets" {
  for_each = {
    secret1 = "strange-secret-1"
    secret2 = "strange-secret-2"
    secret3 = "strange-secret-3"
  }

  secret_id = each.value
  replication {
    user_managed {
      replicas {
        location = "europe-west1"
      }
    }
  }
}

resource "google_secret_manager_secret_iam_member" "strange_secret_version_manager" {
  for_each = google_secret_manager_secret.strange_secrets

  secret_id = google_secret_manager_secret.strange_secrets[each.key].id
  role      = "roles/secretmanager.secretVersionManager"
  member    = "serviceAccount:${google_service_account.strange.email}"
}
