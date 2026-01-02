
import express from 'express';
import cors from 'cors';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { authMiddleware } from './middleware';

// --- INITIALIZE FIREBASE ---
initializeApp({
    credential: applicationDefault()
});

const db = getFirestore();
const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// --- ROUTES ---

// HEALTH (Public)
app.get('/', (_req, res) => res.json({ status: 'ok', service: 'crm-backend-extended' }));

// SECURE API
app.use('/api', authMiddleware);

// PATIENTS API
// 1. GET ALL
app.get('/api/patients', async (_req, res) => {
    try {
        const snapshot = await db.collection('patients').get();
        const patients = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(patients);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

// 2. GET SINGLE
app.get('/api/patients/:id', async (req, res) => {
    try {
        const doc = await db.collection('patients').doc(req.params.id).get();
        if (!doc.exists) {
            res.status(404).json({ error: 'Patient not found' });
        } else {
            res.json({ id: doc.id, ...doc.data() });
        }
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

// 3. CREATE
app.post('/api/patients', async (req, res) => {
    try {
        const patientData = req.body;
        // Clean ID from body if present to avoid duplication in data vs docId
        const { id, ...data } = patientData;
        const docRef = db.collection('patients').doc(); // Auto-ID
        await docRef.set(data);
        res.json({ id: docRef.id, ...data });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

// 4. UPDATE (PUT)
app.put('/api/patients/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const patientData = req.body;
        // Ensure we don't overwrite the ID in the document data with a mismatch
        const { id: bodyId, ...data } = patientData;

        await db.collection('patients').doc(id).set(data, { merge: true });
        res.json({ id, ...data });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

// 5. DELETE
app.delete('/api/patients/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.collection('patients').doc(id).delete();
        res.json({ success: true, id });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

// SETTINGS API
app.get('/api/settings', async (_req, res) => {
    try {
        const doc = await db.collection('config').doc('clinic_settings').get();
        res.json(doc.exists ? doc.data() : {});
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/settings', async (req, res) => {
    try {
        await db.collection('config').doc('clinic_settings').set(req.body, { merge: true });
        res.json({ success: true });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

// --- SERVER ---
app.listen(port, () => {
    console.log(`Backend API with Firestore listening on port ${port}`);
});
