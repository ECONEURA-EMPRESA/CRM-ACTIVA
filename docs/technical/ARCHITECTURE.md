# System Architecture

## Overview
Metodo Activa utilizes a **Serverless, Event-Driven Architecture** on Google Cloud Platform. This ensures high availability, automatic scaling, and pay-per-use billing.

## Core Components

### 1. Frontend: The "Edge"
*   **Technology**: React 18 + Vite.
*   **Hosting**: Firebase Hosting (Global CDN).
*   **Benefits**: Sub-second initial load, Offline capabilities (PWA ready), Edge caching.

### 2. Backend: The "Brain"
*   **Service**: Google Cloud Run.
*   **Runtime**: Node.js 20 (Alpine Linux Docker Container).
*   **Scaling**: Automatically scales from 0 to N instances based on HTTP traffic.
*   **Security**: Runs in a private VPC connector, no public IP exposure except via Load Balancer.

### 3. Data Layer: The "Vault"
*   **Database**: Google Cloud Firestore (NoSQL Document Store).
*   **Structure**:
    *   `patients/{patientId}`: Core demographic and medical data.
    *   `patients/{patientId}/sessions/{sessionId}`: Sub-collection for infinite scalability of session logs.
    *   `clinics/{clinicId}`: Tenant configuration.
*   **Indexes**: Composite indexes enabled for complex filtering (e.g., "Find all Dementia patients > 80 years old with GDS > 5").

### 4. Authentication & RBAC
*   **Provider**: Firebase Authentication (Identity Platform).
*   **Strategy**: JWT (JSON Web Tokens).
*   **Custom Claims**: Used to handle roles (`admin`, `therapist`, `auditor`) directly in the token, reducing DB lookups.

## Data Flow Diagram

1.  **Read Path**: Client -> Firebase SDK -> Firestore (Direct Read with Security Rules) = <20ms Latency.
2.  **Write Path (Complex)**: Client -> Cloud Run API -> Validation Logic -> Firestore = Ensures Data Integrity.
3.  **Analytics Path**: Firestore -> Cloud Functions -> BigQuery (Future implementation).

## Deployment Pipeline (CI/CD)
Managed via GitHub Actions.
*   **Push to Main**: Triggers Build -> Test -> Containerize -> Push to GCR -> Deploy Revision.
*   **Rollback**: Instant one-click rollback available via Cloud Console.
