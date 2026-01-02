# Método Activa SaaS Platform

> **Clinical Excellence meets Modern Tech.**
> A sovereign, HIPAA-compliant CRM for detailed neuro-cognitive tracking and clinical management.

![Dashboard Preview](https://metodo-activa-saas-1767353295.web.app/assets/logo-circular-Cj9w12.png) <!-- Conceptual link, replace with real screenshot -->

## 🚀 Quick Start (Zero to Hero)

This repository is optimized for **Google Cloud Platform (GCP)**.

### Prerequisites
- Node.js v20+
- pnpm v8+ (`npm install -g pnpm`)
- Google Cloud CLI (`gcloud`)

### 1. Install & Initialize
```bash
# Install dependencies across all packages
pnpm install

# Start the Development Environment (Frontend + Backend)
pnpm run dev
```
Client runs on `http://localhost:5173`. Backend on `http://localhost:8080`.

### 2. Deployment
```bash
# Build production artifacts
pnpm run build

# Deploy to Firebase Hosting and Cloud Run
firebase deploy
```

---

## 🏛️ System Architecture

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 18 + Vite | High-performance SPA with "Metallic Light v5" design system. |
| **Backend** | Node.js + Express | Lightweight API Gateway running on Cloud Run (Serverless). |
| **Database** | Firestore | NoSQL document store with real-time capabilities. |
| **Auth** | Identity Platform | Enterprise-grade security (Email/Password + Google). |
| **Monorepo** | TurboRepo | Efficient build system caching. |

This architecture is designed for **Zero Maintenance** and **Infinite Scalability** via GCP Serverless.

---

## 📂 Project Structure

```
monorepo-crm-activa/
├── apps/
│   ├── crm-client/       # The Application (React)
│   └── backend-api/      # The API (Express)
├── docs/                 # Technical & Legal Documentation
├── infra/                # Terraform & Infrastructure as Code
└── scripts/              # Utility scripts
```

## 🔒 Security Notice
This is **Proprietary Software**. Access to source code does not grant usage rights. See `LICENSE` for details.
Api Keys are injected at build time. Never commit `.env.production`.

---
**© 2026 Método Activa SaaS**
