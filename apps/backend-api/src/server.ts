import express from 'express';
import cors from 'cors';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { authMiddleware } from './middleware';
import { ZodError } from 'zod';

// --- ADAPTERS & USE CASES ---
import { FirestorePatientRepository } from './infrastructure/firebase/FirestorePatientRepository';
import { FirestoreDashboardStatsRepository } from './infrastructure/firebase/FirestoreDashboardStatsRepository';
import { LoggerService } from './infrastructure/logger/LoggerService';
import { CreatePatientUseCase } from './core/application/CreatePatientUseCase';

// --- INITIALIZE FIREBASE ---
initializeApp({
  credential: applicationDefault(), // In Cloud Run, this uses the Service Account automatically
});
const db = getFirestore();

// --- DEPENDENCY INJECTION ROOT ---
const patientRepo = new FirestorePatientRepository(db);
const statsRepo = new FirestoreDashboardStatsRepository(db);
const createPatient = new CreatePatientUseCase(patientRepo, statsRepo);

// --- EXPRESS SETUP ---
const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// --- ROUTES ---

// Ops: Standard Health Check
app.get('/health', (_req, res) => res.status(200).json({ status: 'ok', uptime: process.uptime() }));
app.get('/', (_req, res) =>
  res.json({ status: 'ok', service: 'backend-api-hexagonal', version: '1.0.0' }),
);

// Secure API Group
app.use('/api', authMiddleware);

import { PatientSchema } from '@monorepo/shared';

// CONTROLLER: POST /api/patients
app.post('/api/patients', async (req, res) => {
  try {
    const userId = (req as any).user.uid;
    // Validation Layer (Strict)
    // We override userId from token for security, ignoring body if present
    const validatedData = PatientSchema.parse({ ...req.body, userId });

    const newPatient = await createPatient.execute(validatedData, userId);
    LoggerService.info('Patient Created', { patientId: newPatient.id, userId });
    res.json(newPatient);
  } catch (e: any) {
    if (e instanceof ZodError) {
      res.status(400).json({ error: 'Validation Error', details: e.errors });
    } else {
      LoggerService.error('Create Patient Failed', e);
      res.status(500).json({ error: e.message || 'Internal Server Error' });
    }
  }
});

// QUERY: GET /api/stats (CQRS Read Model)
app.get('/api/stats', async (req, res) => {
  const userId = (req as any).user.uid;
  const stats = await statsRepo.getStats(userId);
  res.json(stats);
});

// Legacy/Simple Routes (To be migrated progressively)
app.get('/api/patients', async (req, res) => {
  const userId = (req as any).user.uid;
  const patients = await patientRepo.findByUserId(userId);
  res.json(patients);
});

// --- SERVER LIFECYCLE ---
const server = app.listen(port, () => {
  LoggerService.info(`Backend API (Hexagonal) listening on port ${port}`);
});

// Graceful Shutdown Strategy
const shutdown = (signal: string) => {
  LoggerService.info(`${signal} received. Starting graceful shutdown...`);
  server.close(() => {
    LoggerService.info('HTTP server closed.');
    // Close DB connections if any generic pools exist (Firestore handles this automatically)
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
