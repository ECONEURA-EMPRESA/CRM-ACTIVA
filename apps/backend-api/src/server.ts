
import express from 'express';
import cors from 'cors';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// --- INITIALIZE FIREBASE ---
// En Cloud Run, applicationDefault() usa la Service Account por defecto.
// En local, busca GOOGLE_APPLICATION_CREDENTIALS
initializeApp({
    credential: applicationDefault()
});

const db = getFirestore();
const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// --- ROUTES ---

// HEALTH
app.get('/', (_req, res) => res.json({ status: 'ok', service: 'crm-backend-extended' }));

// PATIENTS API
app.get('/api/patients', async (_req, res) => {
    try {
        const snapshot = await db.collection('patients').get();
        const patients = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(patients);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/patients', async (req, res) => {
    try {
        const patientData = req.body;
        // Si viene sin ID, generamos uno o dejamos que firestore lo haga
        // El frontend suele enviar 'id' numérico para dummy data, aquí lo limpiamos o usamos
        const docRef = req.body.id ? db.collection('patients').doc(String(req.body.id)) : db.collection('patients').doc();
        await docRef.set(patientData, { merge: true });
        res.json({ id: docRef.id, ...patientData });
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
