
import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Main health check request
app.get('/', (_req, res) => {
    res.json({
        status: 'ok',
        service: 'crm-backend-api',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/health', (_req, res) => {
    res.status(200).send('OK');
});

// Middleware de Manejo de Errores
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error("🔥 Error detectado:", err.message);
    res.status(500).json({
        status: 'error',
        message: err.message || 'Internal Server Error'
    });
});

app.listen(port, () => {
    console.log(`Backend API listening on port ${port}`);
});
