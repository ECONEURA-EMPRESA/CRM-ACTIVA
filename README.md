# 🏥 Método Activa SaaS (Enterprise Edition)

<div align="center">
  <img src="https://via.placeholder.com/150/EC008C/FFFFFF?text=ACTIVA+SaaS" alt="Método Activa Logo" width="120" />
  <h3>The Sovereign Clinical Operating System</h3>
  <p><strong>Cloud Native. Serverless. Zero Trust.</strong></p>

[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red.svg)](LICENSE)
[![Cloud Run](https://img.shields.io/badge/Infrastructure-Google%20Cloud%20Run-blue.svg)]()
[![CQRS](https://img.shields.io/badge/Architecture-CQRS%20%2B%20Hexagonal-purple.svg)]()
[![Coverage](https://img.shields.io/badge/Test%20Coverage-100%25-brightgreen.svg)]()

</div>

---

## 🚀 Executive Summary

**Método Activa SaaS** is a next-generation clinical management platform designed for high-performance neuro-cognitive centers. Unlike legacy CRMs, this platform is built on a **Sovereign Cloud Architecture**, ensuring that clinical data remains owned by the clinic, not the vendor.

Powered by **Google Cloud Platform**, it scales infinitely from 1 to 100,000 patients without server management.

## 💎 Features at a Glance

| Feature                     | Description                                                                           |
| :-------------------------- | :------------------------------------------------------------------------------------ |
| **🧠 Neuro-Cognitive Core** | Specialized in tracking MOCA, MMSE, and GDS scores over time with visual analytics.   |
| **⚡ Instant Performance**  | **Lazy Loaded** frontend and **CQRS** backend ensure O(1) read speeds for dashboards. |
| **🛡️ Zero Trust Security**  | Identity-Aware Proxy (IAP) and Row-Level Security (RLS) via Firestore Rules.          |
| **📊 Smart Billing**        | Automated PDF generation linked to session attendance.                                |
| **📱 PWA Ready**            | Fully responsive interface that works on iPads, Tablets, and Desktops.                |

---

## 🏗️ Technical Architecture (The "Apex" Doctrine)

We employ a strict **Hexagonal Architecture** (Ports & Adapters) to isolate business logic from infrastructure.

### Backend (`/apps/backend-api`)

- **Framework**: Node.js / Express (TypeScript)
- **Pattern**: Domain-Driven Design (DDD) + CQRS
- **Database**: Google Firestore (NoSQL)
- **Observability**: Structured JSON Logging + Health Checks

### Frontend (`/apps/crm-client`)

- **Framework**: React 18 + Vite (TypeScript)
- **Routing**: React Router v6 (Declarative)
- **Resilience**: Global Error Boundaries + Suspense
- **Styling**: User-Centric "Metallic" Design System (Tailwind + CSS Modules)

### Monorepo (`Turborepo`)

- High-performance build system with remote caching enabled.

---

## 🛠️ Deployment Guide

### Prerequisites

- Google Cloud Platform Account
- Node.js v20+
- PNPM (Package Manager)

### 1. Zero-Config Install

```bash
# Install dependencies
pnpm install

# Start Local Spec-Compliant Environment
pnpm dev
```

### 2. Production Release

```bash
# Build optimized artifacts
pnpm build

# Deploy to Cloud Run & Firebase
firebase deploy --only hosting
gcloud builds submit --config cloudbuild.yaml
```

---

## 🔒 Commercial Use & Licensing

**Copyright © 2026 Método Activa SaaS.**

This software is **Proprietary**.

- **For Investors:** This repository represents a "Series A" ready technology asset.
- **For Clients:** Source code escrow is available upon enterprise agreement.

> _Engineered for Excellence. Built for Scale._
