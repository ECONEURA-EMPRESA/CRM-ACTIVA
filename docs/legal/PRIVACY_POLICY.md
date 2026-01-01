# Privacy Policy

**Effective Date:** January 1, 2026

## 1. Scope
This policy describes how **Metodo Activa** handles personal data within our SaaS platform. We distinguish between:
*   **Account Data**: Information about you (system administrators, therapists).
*   **Patient Data**: Health information you upload about your clients.

## 2. Our Role
*   **For Account Data**: We are the Controller.
*   **For Patient Data**: We are the Processor. You (the Clinic) are the Controller.

## 3. Data We Process
*   **Clinician Info**: Email, Name, Professional Credentials.
*   **Patient Info (Encrypted)**: Names, Ages, Diagnosis Codes (ICD-10), Cognitive Scores (GDS, MMSE), Session Notes.

## 4. How We Protect Data
We utilize **Google Cloud Platform (GCP)** infrastructure with:
*   AES-256 Encryption at Rest.
*   TLS 1.3 Encryption in Transit.
*   Strict Logical Separation of Tenant Data (Firestore Security Rules).

## 5. Third-Party Sub-processors
We use the following providers to deliver the service:
*   **Google Cloud**: Hosting & Database (Region: Europe-West1).
*   **Firebase Auth**: Identity Management.
*   *(No data is shared with marketing or ad networks)*.

## 6. Your Rights (GDPR)
As a user, you have the right to Access, Rectify, Delete, and Port your data. To exercise these rights or request a "System Dump" of your patient data, contact `dpo@metodoactiva.com`.
