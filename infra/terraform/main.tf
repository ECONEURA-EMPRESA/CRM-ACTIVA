terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 4.51.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}


# NOTE: Resources below are handled by setup-gcp-universe.sh
# Kept in comments for reference or future import

# # Enable APIs (Handled by script)
# resource "google_project_service" "apis" { ... }

# # Cloud Storage Bucket (Handled by script: gs://$PROJECT_ID-secure-docs)
# # resource "google_storage_bucket" "secure_docs" { ... }

# # Firestore Database (Handled by script: firestore-native)
# # resource "google_firestore_database" "database" { ... }

# Cloud Run Service (Backend) - MANAGED HERE
resource "google_cloud_run_v2_service" "default" {
  name     = "crm-api-prod"
  location = var.region
  ingress = "INGRESS_TRAFFIC_ALL"

  template {
    containers {
      image = "us-docker.pkg.dev/cloudrun/container/hello" # Placeholder, will be replaced by build
      ports {
        container_port = 8080
      }
      env {
        name = "GCP_PROJECT_ID"
        value = var.project_id
      }
    }
  }
}

# Output
output "cloud_run_url" {
  value = google_cloud_run_v2_service.default.uri
}


