# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability
**Do not open a public issue.**
If you have discovered a security vulnerability in Metodo Activa, please email `security@metodoactiva.com`. We grant a **Safe Harbor** for good-faith researchers.

## Security Controls

### 1. Medical Data Protection
*   All patient data is isolated logically by `clinicId`.
*   Firestore Security Rules enforce that User A from Clinic X cannot read data from Clinic Y.
*   Snapshots (Backups) are taken every 24 hours.

### 2. Administrator Access
*   Production database access is restricted to the CTO and designated DevOps engineers via Cloud IAM.
*   MFA (Multi-Factor Authentication) is enforced for all Google Cloud Console access.

### 3. Supply Chain Security
*   We use `pnpm` with lockfiles to ensure dependency consistency.
*   Container images are scanned for vulnerabilities before deployment using Google Artifact Registry Scanning.
