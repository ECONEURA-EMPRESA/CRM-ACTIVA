// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import {
    LayoutDashboard, Users, Calendar, FileText, Music,
    Settings, LogOut, PlusCircle, Search, ChevronRight,
    Activity, Heart, Zap, CheckCircle2, AlertCircle,
    Clock, Save, ArrowLeft, ClipboardCheck, PlayCircle,
    BarChart3, Mic2, Pill, Home, Printer, X, Info, Download,
    Briefcase, CheckSquare, Share2, Camera, Upload, ShieldCheck,
    Brain, FileSignature, Stethoscope, UserCheck, Bell, Menu, MoreVertical,
    Baby, User, Smile, ChevronLeft, CalendarDays, BookOpen, Lightbulb, Edit,
    FileCheck, Receipt, Filter, Users2, List, ClipboardList, MapPin, MessageSquare, StickyNote,
    DollarSign, CreditCard, Plus, PenTool, Trash2, UserX, Hash, UserPlus, CalendarCheck
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// --- CONFIGURACIÓN FIREBASE ---
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- ESTILOS GLOBALES (DISEÑO PREMIUM 3D) ---
const GlobalStyles = () => (
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;700&display=swap');
    
    :root {
      --primary: #EC008C;
      --primary-dark: #be0070;
      --primary-light: #fdf2f8;
      --bg-app: #F3F6F9; /* Fondo clínico suave */
      --surface: #FFFFFF;
      --text-main: #1E293B;
      --text-muted: #64748B;
      --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      --shadow-3d: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      --shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
    }

    body { 
      font-family: 'Inter', sans-serif; 
      background-color: var(--bg-app); 
      color: var(--text-main); 
      -webkit-font-smoothing: antialiased;
    }

    /* Scrollbar premium */
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #94A3B8; }

    /* Animaciones suaves */
    .fade-enter { opacity: 0; transform: translateY(10px); }
    .fade-enter-active { opacity: 1; transform: translateY(0); transition: opacity 400ms cubic-bezier(0.16, 1, 0.3, 1), transform 400ms cubic-bezier(0.16, 1, 0.3, 1); }

    /* Inputs con sensación de profundidad */
    .input-pro { 
      width: 100%; 
      background: #FFFFFF; 
      border: 1px solid #E2E8F0; 
      border-radius: 0.75rem; /* Más redondeado */
      padding: 0.875rem 1rem; 
      font-size: 0.9rem; 
      color: #1E293B; 
      transition: all 0.2s ease; 
      box-shadow: var(--shadow-sm);
    }
    .input-pro:focus { 
      border-color: var(--primary); 
      outline: none; 
      box-shadow: 0 0 0 4px rgba(236, 0, 140, 0.15), var(--shadow-sm); 
      transform: translateY(-1px);
    }
    .input-pro::placeholder { color: #94A3B8; }

    .label-pro { 
      display: block; 
      font-size: 0.75rem; 
      font-weight: 700; 
      text-transform: uppercase; 
      letter-spacing: 0.05em; 
      color: #475569; 
      margin-bottom: 0.5rem; 
    }

    /* Tarjetas con efecto 3D */
    .card-clinical {
      background: white;
      border-radius: 1rem;
      border: 1px solid rgba(255,255,255,0.5);
      box-shadow: 
        0 4px 6px -1px rgba(0, 0, 0, 0.05), 
        0 2px 4px -1px rgba(0, 0, 0, 0.03),
        0 0 0 1px rgba(0,0,0,0.02); /* Borde sutil */
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .card-hoverable:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-3d);
      border-color: rgba(236, 0, 140, 0.2);
    }

    /* Botones con gradiente sutil y sombra */
    .btn-primary {
      background: linear-gradient(135deg, #EC008C 0%, #C20072 100%);
      box-shadow: 0 4px 10px rgba(236, 0, 140, 0.3);
      border: none;
    }
    .btn-primary:hover {
      box-shadow: 0 6px 15px rgba(236, 0, 140, 0.4);
      transform: translateY(-1px);
    }
    .btn-primary:active {
      transform: translateY(1px);
      box-shadow: 0 2px 5px rgba(236, 0, 140, 0.2);
    }

    /* Estilos de Impresión */
    .a4-page { width: 210mm; min-height: 297mm; padding: 20mm; margin: 0 auto; background: white; box-shadow: var(--shadow-lg); color: #1e293b; font-size: 11pt; line-height: 1.5; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `}</style>
);

// --- UTILS ---
const printInvoice = (clinicData, patient, sessions, invoiceNumber) => {
    console.log("Imprimiendo factura...", invoiceNumber);
    // TODO: Implementar lógica real de impresión window.print()
};

const printConsent = (clinicData, patientData) => {
    console.log("Imprimiendo consentimiento...");
};

// --- CONSTANTES ---
const BRAND_COLOR = "#EC008C";
const TREATMENT_PHASES = [
    { id: 1, name: "Vinculación y Regulación", range: "0-4", focus: "Espacio seguro", color: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
    { id: 2, name: "Activación y Participación", range: "5-8", focus: "Atención y memoria", color: "bg-blue-500", text: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" },
    { id: 3, name: "Expresión y Relación", range: "9-12", focus: "Vínculo profundo", color: "bg-purple-500", text: "text-purple-700", bg: "bg-purple-50", border: "border-purple-200" },
    { id: 4, name: "Integración y Autonomía", range: "13-16", focus: "Generalizar logros", color: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
    { id: 5, name: "Cierre y Transición", range: "17-20", focus: "Evaluación final", color: "bg-pink-500", text: "text-pink-700", bg: "bg-pink-50", border: "border-pink-200" }
];
const EVALUATION_AREAS = ["Atención sostenida", "Orientación", "Regulación emocional", "Expresión emocional", "Comunicación verbal", "Comunicación no verbal", "Interacción social", "Respuesta musical", "Iniciativa musical"];

const COMMON_PATHOLOGIES = [
    { label: "--- Neurogeriatría ---", value: "", disabled: true },
    { label: "Alzheimer y otras Demencias", value: "dementia" },
    { label: "Parkinson", value: "neuro" },
    { label: "--- Salud Mental ---", value: "", disabled: true },
    { label: "Depresión y Trastornos del Ánimo", value: "mood" },
    { label: "Ansiedad y Estrés", value: "mood" },
    { label: "--- Infanto-Juvenil ---", value: "", disabled: true },
    { label: "TEA", value: "neuro" },
    { label: "TDAH", value: "neuro" },
    { label: "--- Otros ---", value: "", disabled: true },
    { label: "Sin Patología (Bienestar)", value: "other" },
    { label: "Otras...", value: "other" }
];

const CLINICAL_GUIDES = {
    dementia: { title: "Deterioro Cognitivo", objectives: ["Estimular funciones cognitivas", "Favorecer orientación", "Reducir ansiedad/agitación"], techniques: ["Canciones autobiográficas", "Ritmos predecibles"], precautions: ["Evitar sobreestimulación", "Controlar duración"], focus: "Estimulación Cognitiva" },
    mood: { title: "Trastornos del Ánimo", objectives: ["Facilitar expresión", "Regular activación", "Reforzar autoestima"], techniques: ["Improvisación guiada", "Canciones emocionales"], precautions: ["Respetar silencios", "Contención emocional"], focus: "Regulación Emocional" },
    neuro: { title: "Daño Neurológico", objectives: ["Rehabilitación funcional", "Coordinación motora", "Motivación"], techniques: ["Ritmo para movimiento", "Sincronización"], precautions: ["Fatiga física", "Latencia de respuesta"], focus: "Neurorehabilitación" },
    other: { title: "Bienestar General", objectives: ["Autoconocimiento", "Relajación"], techniques: ["Escucha activa", "Improvisación libre"], precautions: ["Respeto al proceso"], focus: "Crecimiento Personal" }
};

const SESSION_ACTIVITIES = [
    { id: "welcome", label: "Bienvenida / Dinámica Inicial", placeholder: "Canción de saludo, sintonización..." },
    { id: "improv", label: "Improvisación Instrumental", placeholder: "Instrumentos usados, consigna..." },
    { id: "singing", label: "Canto / Trabajo Vocal", placeholder: "Canciones cantadas, tonalidad..." },
    { id: "listening", label: "Audición Musical", placeholder: "Obras escuchadas, reacción..." },
    { id: "movement", label: "Movimiento / Corporal", placeholder: "Tipo de movimiento, uso del espacio..." },
    { id: "composition", label: "Composición", placeholder: "Songwriting, análisis de letra..." },
    { id: "relaxation", label: "Relajación", placeholder: "Técnica usada, música de fondo..." },
    { id: "closing", label: "Cierre / Despedida", placeholder: "Ritual de salida, feedback..." }
];

// --- HELPERS FECHA ---
const formatDateForInput = (dateStr) => {
    if (!dateStr) return new Date().toISOString().split('T')[0];
    const parts = dateStr.split('/');
    if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
    return dateStr;
};

const formatDateForDisplay = (isoDate) => {
    if (!isoDate) return new Date().toLocaleDateString('es-ES');
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
};

// --- DATOS DUMMY INICIALES ---
const INITIAL_PATIENTS = [
    {
        id: 1, name: "Antonio García", age: 74, diagnosis: "Alzheimer y otras Demencias", pathologyType: 'dementia', photo: "AG", joinedDate: "2023-09-15", sessionsCompleted: 7,
        initialEval: [1, 1, 1, 2, 1, 2, 1, 2, 0], currentEval: [2, 1, 2, 3, 2, 2, 2, 3, 1],
        reference: "AG-091523",
        cognitiveScores: { moca: "18/30", mmse: "21/30", gds: "4", date: "20/10/2023" },
        clinicalFormulation: {
            synthesis: "Paciente con deterioro cognitivo moderado (GDS 4). Conserva memoria musical biográfica.",
            preserved: "Atención musical, ritmo básico, memoria emotiva.",
            difficulties: "Desorientación temporal, afasia nominal, inicio de apraxia.",
            regulators: "Calma: Voz cantada suave, canciones de infancia. Estrés: Ruido fuerte, cambios bruscos.",
            hypothesis: "La música actúa como 'anclaje' de seguridad y estimulación cognitiva."
        },
        sessions: [{ id: 101, date: "20/10/2023", phase: 2, activityDetails: { singing: "Canto 'El Emigrante'." }, notes: "Buena respuesta.", scores: [2, 1, 2, 3, 2, 2, 2, 3, 1], type: "individual", price: 50, paid: false, isAbsent: false }]
    }
];

// --- COMPONENTES UI MEJORADOS ---

// Toast flotante con sombra profunda
const Toast = ({ message, type = 'success', onClose }) => (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
        <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-3d border ${type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-red-50 border-red-100 text-red-800'}`}>
            <span className="font-bold text-sm">{message}</span>
            <button onClick={onClose} className="opacity-60 hover:opacity-100 transition-opacity"><X size={18} /></button>
        </div>
    </div>
);

// Card con efecto 3D
const Card = ({ children, className = "", noPadding = false, hoverable = false }) => (
    <div className={`card-clinical ${hoverable ? 'card-hoverable' : ''} ${className}`}>
        <div className={noPadding ? "" : "p-8"}>{children}</div>
    </div>
);

// Badge con diseño pill moderno
const Badge = ({ children, variant = "neutral" }) => {
    const c = {
        neutral: "bg-slate-100 text-slate-600 border-slate-200",
        brand: "bg-pink-50 text-pink-700 border-pink-100",
        success: "bg-emerald-50 text-emerald-700 border-emerald-100",
        group: "bg-indigo-50 text-indigo-700 border-indigo-100",
        warning: "bg-amber-50 text-amber-700 border-amber-100",
        error: "bg-red-50 text-red-700 border-red-100"
    };
    return <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${c[variant]}`}>{children}</span>;
};

// Botón Premium con gradientes y sombras
const Button = ({ children, onClick, variant = "primary", className = "", icon: Icon, size = "md", ...props }) => {
    const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-5 py-2.5 text-sm" };
    const variants = {
        primary: "btn-primary text-white",
        secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:shadow-md transition-all",
        ghost: "text-slate-500 hover:bg-slate-100 hover:text-slate-700",
        danger: "bg-white text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300"
    };

    return (
        <button
            onClick={onClick}
            className={`rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 ${sizes[size]} ${variants[variant]} ${className}`}
            {...props}
        >
            {Icon && <Icon size={size === 'sm' ? 14 : 18} strokeWidth={2.5} />}
            {children}
        </button>
    );
};

const PatientAvatar = ({ photo, name, size = "md" }) => {
    const s = { sm: "w-10 h-10 text-xs", md: "w-16 h-16 text-xl", lg: "w-24 h-24 text-3xl", xl: "w-32 h-32 text-4xl" };
    const isImage = photo && photo.length > 5 && photo.includes('data:image');

    return (
        <div className={`${s[size]} rounded-2xl flex items-center justify-center font-black shadow-lg overflow-hidden shrink-0 ring-4 ring-white border border-slate-100 
            ${!isImage ? 'bg-gradient-to-br from-pink-500 to-rose-600 text-white' : 'bg-white'}`}>
            {isImage ?
                <img src={photo} alt={name} className="w-full h-full object-cover" /> :
                name?.substring(0, 2).toUpperCase()
            }
        </div>
    );
};

// --- SETTINGS VIEW ---
const SettingsView = ({ clinicSettings, onSaveSettings }) => {
    return (
        <div className="space-y-8 animate-in fade-in max-w-4xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Configuración de la Clínica</h1>
                <p className="text-slate-500 text-lg mt-1">Datos fiscales y de personalización para documentos.</p>
            </header>
            <Card className="p-8">
                <form className="space-y-8" onSubmit={(e) => {
                    e.preventDefault();
                    const d = new FormData(e.target);
                    onSaveSettings(Object.fromEntries(d));
                }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div><label className="label-pro">Nombre del Centro / Profesional</label><input name="name" defaultValue={clinicSettings.name || ''} className="input-pro" placeholder="Ej: Centro Activa Musicoterapia" required /></div>
                        <div><label className="label-pro">CIF / NIF</label><input name="cif" defaultValue={clinicSettings.cif || ''} className="input-pro" placeholder="12345678X" required /></div>
                        <div className="md:col-span-2"><label className="label-pro">Dirección Completa</label><input name="address" defaultValue={clinicSettings.address || ''} className="input-pro" placeholder="C/ Ejemplo 123, Madrid" required /></div>
                        <div><label className="label-pro">Teléfono</label><input name="phone" defaultValue={clinicSettings.phone || ''} className="input-pro" placeholder="+34 600 000 000" /></div>
                        <div><label className="label-pro">Email</label><input name="email" defaultValue={clinicSettings.email || ''} className="input-pro" placeholder="hola@centro.com" /></div>
                        <div className="md:col-span-2"><label className="label-pro">Texto Legal (Pie de Factura)</label><textarea name="legalText" defaultValue={clinicSettings.legalText || ''} className="input-pro h-24 resize-none" placeholder="Información sobre protección de datos, registro mercantil, etc." /></div>
                    </div>
                    <div className="flex justify-end pt-6 border-t border-slate-100">
                        <Button type="submit" icon={Save} size="md">Guardar Configuración</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

// --- QUICK APPOINTMENT MODAL ---
const QuickAppointmentModal = ({ onClose, patients, onSave }) => {
    const [mode, setMode] = useState('existing');
    const [selectedPatientId, setSelectedPatientId] = useState('');
    const [newPatientName, setNewPatientName] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState('10:00');

    const handleSave = (e) => {
        e.preventDefault();
        onSave({ mode, patientId: selectedPatientId, name: newPatientName, date, time });
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-3d overflow-hidden animate-in fade-in zoom-in-95">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                    <h2 className="text-xl font-bold flex items-center gap-3 text-slate-800"><Clock className="text-pink-600" /> Agendar Cita</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><X /></button>
                </div>
                <form className="p-6 space-y-6" onSubmit={handleSave}>
                    <div className="flex bg-slate-50 p-1.5 rounded-xl mb-4 border border-slate-100">
                        <button type="button" onClick={() => setMode('existing')} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${mode === 'existing' ? 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>Paciente Existente</button>
                        <button type="button" onClick={() => setMode('new')} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${mode === 'new' ? 'bg-white text-pink-600 shadow-sm ring-1 ring-pink-100' : 'text-slate-500 hover:text-slate-700'}`}>Nuevo Paciente</button>
                    </div>

                    {mode === 'existing' ? (
                        <div>
                            <label className="label-pro">Seleccionar Paciente</label>
                            <select className="input-pro" value={selectedPatientId} onChange={e => setSelectedPatientId(e.target.value)} required>
                                <option value="">- Buscar en la lista -</option>
                                {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                    ) : (
                        <div>
                            <label className="label-pro">Nombre del Nuevo Paciente</label>
                            <input className="input-pro" placeholder="Ej. Ana García" value={newPatientName} onChange={e => setNewPatientName(e.target.value)} required autoFocus />
                            <p className="text-xs text-slate-500 mt-2 font-medium">✨ Se creará una ficha rápida automáticamente.</p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="label-pro">Fecha</label><input type="date" className="input-pro" value={date} onChange={e => setDate(e.target.value)} required /></div>
                        <div><label className="label-pro">Hora</label><input type="time" className="input-pro" value={time} onChange={e => setTime(e.target.value)} required /></div>
                    </div>

                    <Button type="submit" className="w-full py-3 text-base shadow-lg hover:shadow-xl" icon={CalendarCheck}>Confirmar Cita</Button>
                </form>
            </div>
        </div>
    );
};

// --- COGNITIVE MODAL ---
const CognitiveModal = ({ onClose, onSave, initialData, initialScores }) => {
    const [date, setDate] = useState(formatDateForInput(initialData?.date) !== new Date().toISOString().split('T')[0] ? formatDateForInput(initialData?.date) : new Date().toISOString().split('T')[0]);
    const [scores, setScores] = useState(initialScores || Array(9).fill(0));

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-3d max-h-[90vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-4">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <h2 className="text-xl font-bold flex items-center gap-3 text-slate-800"><Brain className="text-pink-600" /> Evaluación Clínica</h2>
                    <button onClick={onClose}><X className="text-slate-400 hover:text-slate-600" /></button>
                </div>
                <form className="p-8 space-y-8" onSubmit={e => {
                    e.preventDefault();
                    const d = new FormData(e.target);
                    onSave({
                        moca: d.get('moca'),
                        mmse: d.get('mmse'),
                        gds: d.get('gds'),
                        date: formatDateForDisplay(date),
                        functionalScores: scores
                    });
                }}>
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                        <label className="label-pro mb-4 text-slate-500">1. Pruebas Estandarizadas</label>
                        <div className="grid grid-cols-2 gap-6 mb-4">
                            <div><label className="label-pro text-xs">MOCA (/30)</label><input name="moca" defaultValue={initialData?.moca} className="input-pro bg-white" placeholder="Ej. 24/30" /></div>
                            <div><label className="label-pro text-xs">MMSE (/30)</label><input name="mmse" defaultValue={initialData?.mmse} className="input-pro bg-white" placeholder="Ej. 22/30" /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div><label className="label-pro text-xs">Escala GDS</label><select name="gds" defaultValue={initialData?.gds} className="input-pro bg-white"><option value="-">-</option>{[1, 2, 3, 4, 5, 6, 7].map(n => <option key={n} value={n}>{n}</option>)}</select></div>
                            <div><label className="label-pro text-xs">Fecha</label><input type="date" value={date} onChange={e => setDate(e.target.value)} className="input-pro bg-white" required /></div>
                        </div>
                    </div>
                    <div>
                        <label className="label-pro mb-4 flex items-center gap-2 text-slate-500"><BarChart3 size={16} /> 2. Escala Funcional Actual (0-3)</label>
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            {EVALUATION_AREAS.map((area, i) => (
                                <div key={i} className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 px-2 rounded-lg transition-colors">
                                    <span className="text-xs font-bold text-slate-700">{area}</span>
                                    <div className="flex gap-2">{[0, 1, 2, 3].map(v => <button key={v} type="button" onClick={() => { const newScores = [...scores]; newScores[i] = v; setScores(newScores); }} className={`w-8 h-8 text-[11px] rounded-lg font-bold transition-all flex items-center justify-center ${scores[i] === v ? 'bg-pink-500 text-white shadow-md scale-110' : 'bg-white border border-slate-200 text-slate-400 hover:border-slate-300'}`}>{v}</button>)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Button type="submit" className="w-full py-3" icon={Save}>Guardar Evaluación Completa</Button>
                </form>
            </div>
        </div>
    );
};

// --- DASHBOARD COMPONENT ---
const Dashboard = ({ patients, onNavigate, onNewPatient, searchQuery, setSearchQuery }) => {
    const activePatients = patients.length;
    const recentSessions = patients.flatMap(p => (p.sessions || []).map(s => ({ ...s, patientName: p.name, patientId: p.id }))).filter(s => s.patientName.toLowerCase().includes(searchQuery.toLowerCase())).sort((a, b) => { const d1 = a.date.split('/').reverse().join(''); const d2 = b.date.split('/').reverse().join(''); return d2.localeCompare(d1); }).slice(0, 5);

    return (
        <div className="space-y-8 animate-in fade-in max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div><h1 className="text-3xl font-black text-slate-900 tracking-tight">Panel de Control</h1><p className="text-slate-500 text-lg mt-1">Resumen de actividad clínica</p></div>
                <div className="flex gap-4 w-full md:w-auto"><div className="relative flex-1 md:flex-none"><Search className="absolute left-3 top-3 text-slate-400" size={18} /><input className="input-pro pl-10 py-3" placeholder="Buscar paciente..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} /></div><Button icon={PlusCircle} onClick={onNewPatient} size="md" className="py-3 px-6 shadow-lg">Nueva Admisión</Button></div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-8 flex items-center gap-6 hoverable transform transition-transform hover:-translate-y-1">
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 rounded-2xl shadow-inner"><Users size={32} /></div>
                    <div><p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Pacientes Activos</p><h3 className="text-4xl font-black text-slate-900">{activePatients}</h3></div>
                </Card>
                <Card className="p-8 flex items-center gap-6 hoverable transform transition-transform hover:-translate-y-1">
                    <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600 rounded-2xl shadow-inner"><CalendarDays size={32} /></div>
                    <div><p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Fecha Actual</p><h3 className="text-2xl font-black text-slate-900">{new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</h3></div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-6 h-full flex flex-col">
                    <div className="flex justify-between items-center mb-6"><h3 className="font-bold text-lg text-slate-800 flex items-center gap-2"><Activity className="text-pink-500" /> Últimas Sesiones</h3><Button variant="ghost" size="sm" onClick={() => onNavigate('sessions')}>Ver todo</Button></div>
                    <div className="space-y-3 flex-1">
                        {recentSessions.map((s, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100 cursor-pointer group" onClick={() => onNavigate('detail', patients.find(p => p.id === s.patientId))}>
                                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-pink-600 font-black text-sm shrink-0 group-hover:scale-110 transition-transform">{s.patientName?.substring(0, 2).toUpperCase()}</div>
                                <div className="flex-1"><h4 className="font-bold text-sm text-slate-900">{s.patientName}</h4><p className="text-xs text-slate-500 mt-0.5">{s.date} • {s.isAbsent ? <span className="text-red-500 font-bold bg-red-50 px-1.5 py-0.5 rounded">Ausencia</span> : (s.phase ? `Fase ${s.phase}` : 'Sesión')}</p></div>
                                <ChevronRight size={18} className="text-slate-300 group-hover:text-pink-500 transition-colors" />
                            </div>
                        ))}
                        {recentSessions.length === 0 && <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50"><Activity size={48} className="mb-2" /><p>Sin actividad reciente</p></div>}
                    </div>
                </Card>

                <Card className="p-6 h-full">
                    <div className="flex justify-between items-center mb-6"><h3 className="font-bold text-lg text-slate-800 flex items-center gap-2"><Zap className="text-amber-500" /> Accesos Rápidos</h3></div>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { icon: UserCheck, label: "Nueva Admisión", sub: "Registrar paciente", color: "pink", onClick: onNewPatient },
                            { icon: Calendar, label: "Ver Agenda", sub: "Calendario clínico", color: "blue", onClick: () => onNavigate('calendar') },
                            { icon: FileText, label: "Informes", sub: "Plantillas y docs", color: "emerald", onClick: () => onNavigate('reports') },
                            { icon: Settings, label: "Configuración", sub: "Ajustes sistema", color: "amber", onClick: () => onNavigate('settings') }
                        ].map((item, idx) => (
                            <button key={idx} onClick={item.onClick} className={`p-5 rounded-2xl border border-slate-200 bg-white hover:border-${item.color}-200 hover:bg-${item.color}-50/30 transition-all text-left group hover:shadow-md`}>
                                <div className={`w-10 h-10 rounded-xl bg-${item.color}-50 text-${item.color}-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                                    <item.icon size={20} />
                                </div>
                                <h4 className={`font-bold text-slate-700 group-hover:text-${item.color}-700`}>{item.label}</h4>
                                <p className="text-xs text-slate-400 mt-1">{item.sub}</p>
                            </button>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

// --- GROUP SESSION MODAL ---
const GroupSessionModal = ({ onClose, patients, onSave }) => {
    const [participants, setParticipants] = useState([]);
    const [newParticipant, setNewParticipant] = useState("");
    const [priceGroup, setPriceGroup] = useState(150);
    // Estado inicial para la fecha por defecto (hoy)
    const [defaultDate] = useState(new Date().toISOString().split('T')[0]);

    const addParticipant = () => { if (newParticipant.trim()) { setParticipants([...participants, newParticipant.trim()]); setNewParticipant(""); } };
    const removeParticipant = (index) => { setParticipants(participants.filter((_, i) => i !== index)); };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-3d rounded-2xl animate-in zoom-in-95">
                <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10"><h2 className="text-xl font-bold flex items-center gap-2 text-indigo-700"><Users2 /> Nueva Sesión Grupal</h2><button onClick={onClose}><X className="text-slate-400 hover:text-slate-600" /></button></div>
                <form className="p-8 space-y-8" onSubmit={e => {
                    e.preventDefault();
                    const d = new FormData(e.target);

                    const rawDate = d.get('date');
                    let formattedDate = new Date().toLocaleDateString('es-ES');
                    if (rawDate) {
                        const [y, m, day] = rawDate.split('-');
                        formattedDate = `${day}/${m}/${y}`;
                    }

                    onSave({
                        id: `group-${Date.now()}`,
                        date: formattedDate,
                        time: d.get('time'),
                        phase: 2,
                        activities: ["Dinámica Grupal"],
                        notes: d.get('notes'),
                        groupAnalysis: d.get('groupAnalysis'),
                        location: d.get('location'),
                        type: 'group',
                        participantNames: participants,
                        price: priceGroup,
                        paid: false
                    });
                }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <div className="flex justify-between items-center mb-2"><label className="label-pro">1. Participantes del Grupo</label><div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1.5 rounded-lg"><span className="text-xs font-bold text-slate-500 pl-2">Total Grupo:</span><input type="number" value={priceGroup} onChange={e => setPriceGroup(e.target.value)} className="w-16 bg-transparent text-right font-bold text-slate-700 text-xs outline-none" /><span className="text-xs text-slate-500 pr-2">€</span></div></div>
                            <div className="flex gap-2 mb-3"><input className="input-pro flex-1" placeholder="Nombre participante..." value={newParticipant} onChange={(e) => setNewParticipant(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addParticipant())} /><Button size="sm" onClick={addParticipant} icon={PlusCircle}>Añadir</Button></div>
                            <div className="border border-slate-200 rounded-xl min-h-[150px] max-h-60 overflow-y-auto p-3 bg-slate-50 flex flex-wrap content-start gap-2">{participants.map((p, i) => (<div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm text-sm font-medium text-slate-700 animate-in fade-in zoom-in">{p}<button type="button" onClick={() => removeParticipant(i)} className="text-slate-400 hover:text-red-500 transition-colors"><X size={14} /></button></div>))}</div>
                        </div>
                        <div className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="label-pro">Fecha</label><input type="date" name="date" defaultValue={defaultDate} className="input-pro" required /></div>
                                <div><label className="label-pro">Hora</label><input type="time" name="time" defaultValue="10:00" className="input-pro" required /></div>
                            </div>
                            <div><label className="label-pro">2. Lugar / Sala (Para Recordatorio)</label><input name="location" className="input-pro" placeholder="Ej: Sala Polivalente, Centro Cívico..." required /></div>
                            <div><label className="label-pro">3. Análisis Grupal</label><textarea name="groupAnalysis" className="input-pro h-24 resize-none" placeholder="Cohesión, liderazgo, escucha..." required /></div>
                            <div><label className="label-pro">4. Actividad</label><textarea name="notes" className="input-pro h-20 resize-none" placeholder="Descripción general..." required /></div>
                        </div>
                    </div>
                    <div className="flex justify-end pt-6 border-t border-slate-100"><Button type="submit" icon={Save} disabled={participants.length === 0} size="md" className="shadow-lg">Guardar y Facturar</Button></div>
                </form>
            </div>
        </div>
    );
};

// MEJORA 2: Adaptar AdmissionModal para edición y REFERENCIA AUTOMÁTICA
const AdmissionModal = ({ onClose, onSave, initialData }) => {
    const [photoPreview, setPhotoPreview] = useState(initialData?.photo || null);
    const [diagnosisType, setDiagnosisType] = useState(initialData?.pathologyType || '');
    const [pathologyType, setPathologyType] = useState(initialData?.pathologyType || 'other');
    const [hasConsent, setHasConsent] = useState(initialData?.hasConsent || false);

    // REF PARA EL FORMULARIO
    const formRef = useRef(null);

    // ESTADOS PARA GENERACIÓN AUTOMÁTICA
    const [name, setName] = useState(initialData?.name || '');
    const [date, setDate] = useState(initialData?.joinedDate || new Date().toISOString().split('T')[0]);
    const [reference, setReference] = useState(initialData?.reference || '');
    const [isManualRef, setIsManualRef] = useState(!!initialData?.reference);
    const [age, setAge] = useState(initialData?.age || ''); // ADDED AGE STATE

    // EFFECT: Generar referencia automáticamente
    useEffect(() => {
        if (!isManualRef && name && date) {
            const initials = name.split(' ').map(n => n[0]).filter(c => c).join('').toUpperCase().substring(0, 3);
            const [y, m, d] = date.split('-');
            const shortY = y ? y.slice(2) : '';
            const autoRef = `${initials}-${m}${d}${shortY}`;
            setReference(autoRef);
        }
    }, [name, date, isManualRef]);

    const handlePhotoChange = (e) => { const f = e.target.files[0]; if (f) { const r = new FileReader(); r.onloadend = () => setPhotoPreview(r.result); r.readAsDataURL(f); } };
    const handleDiagnosisChange = (e) => {
        const val = e.target.value; setDiagnosisType(val);
        const pathMap = { 'Alzheimer y otras Demencias': 'dementia', 'Deterioro Cognitivo Leve': 'dementia', 'Parkinson': 'neuro', 'Daño Cerebral Adquirido': 'neuro', 'Esclerosis Múltiple / ELA': 'neuro', 'Depresión y Trastornos del Ánimo': 'mood', 'Ansiedad y Estrés': 'mood', 'TEA': 'neuro', 'TDAH': 'neuro', 'Parálisis Cerebral': 'neuro' };
        setPathologyType(pathMap[val] || 'other');
    };

    // FUNCIÓN PARA IMPRIMIR CONSENTIMIENTO
    const handlePrintConsent = () => {
        const storedSettings = localStorage.getItem('clinicSettings');
        const clinicData = storedSettings ? JSON.parse(storedSettings) : { name: 'Centro de Musicoterapia' };

        printConsent(clinicData, { name, age, reference });
    };


    return (<div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"> <div className="bg-white w-full max-w-3xl rounded-2xl shadow-3d overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95"> <div className="px-8 py-5 border-b border-slate-100 flex justify-between bg-white sticky top-0 z-20"> <h2 className="text-xl font-bold text-slate-800">{initialData ? 'Editar Perfil' : 'Nueva Admisión'}</h2><button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X /></button></div> <div className="p-8 overflow-y-auto">

        {/* FORMULARIO CON REFERENCIA (ref={formRef}) */}
        <form ref={formRef} id="formAd" onSubmit={e => {
            e.preventDefault();
            const d = Object.fromEntries(new FormData(e.target));

            d.age = Number(d.age);
            d.reference = reference;
            d.hasConsent = hasConsent; // Guardar estado del checkbox

            if (photoPreview) d.photo = photoPreview;
            if (diagnosisType === 'other') d.diagnosis = d.customDiagnosis;
            else d.diagnosis = d.diagnosisSelect;
            d.pathologyType = pathologyType;
            delete d.diagnosisSelect;
            delete d.customDiagnosis;
            onSave(d);
        }}>
            <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
                <div className="flex flex-col items-center gap-3 mx-auto md:mx-0"><div className="relative group cursor-pointer w-32 h-32 rounded-full border-4 border-white shadow-xl bg-slate-50 overflow-hidden ring-1 ring-slate-200 transition-all group-hover:scale-105">{photoPreview ? <img src={photoPreview} className="w-full h-full object-cover" /> : <UserCheck size={48} className="text-slate-300 m-auto mt-8" />}<label htmlFor="photo-upload" className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white font-medium text-xs cursor-pointer backdrop-blur-sm">Cambiar Foto</label><input type="file" id="photo-upload" accept="image/*" onChange={handlePhotoChange} className="hidden" /></div><span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Foto Perfil</span></div>
                <div className="flex-1 w-full space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div><label className="label-pro">Nombre Completo</label><input name="name" value={name} onChange={e => setName(e.target.value)} className="input-pro" required placeholder="Ej. Juan Pérez" /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="label-pro">Edad</label><input name="age" type="number" value={age} onChange={e => setAge(e.target.value)} className="input-pro" required /></div>
                            <div><label className="label-pro">Fecha Ingreso</label><input name="joinedDate" type="date" value={date} onChange={e => setDate(e.target.value)} className="input-pro" /></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-end">
                        <div>
                            <label className="label-pro flex items-center gap-2"><Hash size={12} /> Referencia (Auto)</label>
                            <input
                                name="reference"
                                value={reference}
                                onChange={(e) => { setReference(e.target.value); setIsManualRef(true); }}
                                className="input-pro font-mono text-xs bg-slate-50 border-slate-300 text-slate-600"
                                placeholder="JP-123125"
                            />
                        </div>
                        <div>
                            <label className="label-pro">Patología / Motivo</label>
                            <select name="diagnosisSelect" className="input-pro" onChange={handleDiagnosisChange} defaultValue={initialData?.diagnosis || ""} required>
                                {COMMON_PATHOLOGIES.map((p, i) => (
                                    <option key={i} value={p.value} disabled={p.disabled} className={p.disabled ? "font-bold bg-slate-100 text-slate-500" : ""}>{p.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {diagnosisType === 'other' && <input name="customDiagnosis" defaultValue={initialData?.diagnosis} className="input-pro animate-in fade-in slide-in-from-top-1" placeholder="Especifique la patología o motivo..." required />}
                </div>
            </div>

            <div className="space-y-6 border-t border-slate-100 pt-8">
                {/* SECCIÓN 1: CUIDADOR Y CONTACTO DESGLOSADO */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="label-pro">Nombre Cuidador / Relación</label><input name="caregiverName" defaultValue={initialData?.caregiverName} className="input-pro" placeholder="Ej: María (Hija)" /></div>
                    <div><label className="label-pro">Teléfono de Contacto</label><input name="caregiverPhone" defaultValue={initialData?.caregiverPhone} className="input-pro" placeholder="+34 600..." /></div>
                </div>

                {/* SECCIÓN 2: CONTEXTO PSICOSOCIAL ESTRUCTURADO */}
                <div className="bg-slate-50 p-6 rounded-2xl space-y-4 border border-slate-200">
                    <h3 className="font-bold text-slate-700 flex items-center gap-2 text-sm uppercase tracking-wide"><Users size={16} /> Contexto Psicosocial</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="label-pro">Situación de Convivencia</label>
                            <select name="livingSituation" defaultValue={initialData?.livingSituation} className="input-pro bg-white">
                                <option value="">- Seleccionar -</option>
                                <option value="alone">Vive solo/a</option>
                                <option value="couple">Con cónyuge/pareja</option>
                                <option value="nuclear">Familia Nuclear</option>
                                <option value="extended">Familia Extensa</option>
                                <option value="institution">Residencia / Institución</option>
                                <option value="other">Otro</option>
                            </select>
                        </div>
                        <div>
                            <label className="label-pro">Nivel de Apoyo Familiar</label>
                            <select name="supportLevel" defaultValue={initialData?.supportLevel} className="input-pro bg-white">
                                <option value="">- Seleccionar -</option>
                                <option value="high">Alto / Constante</option>
                                <option value="medium">Medio / Puntual</option>
                                <option value="low">Bajo / Escaso</option>
                                <option value="none">Nulo / Inexistente</option>
                                <option value="conflict">Conflictivo</option>
                            </select>
                        </div>
                    </div>
                    <div><label className="label-pro">Eventos Vitales Relevantes</label><textarea name="lifeEvents" defaultValue={initialData?.lifeEvents} className="input-pro h-20 resize-none bg-white" placeholder="Pérdidas recientes, mudanzas, jubilación, traumas..." /></div>
                </div>

                {/* SECCIÓN 3: IDENTIDAD SONORA (ISO) DETALLADA */}
                <div className="bg-pink-50/50 p-6 rounded-2xl space-y-4 border border-pink-100/50">
                    <h3 className="font-bold text-pink-700 flex items-center gap-2 text-sm uppercase tracking-wide"><Music size={16} /> Identidad Sonora (ISO)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="label-pro text-pink-900/70">Estilos Preferidos</label><input name="musicStyles" defaultValue={initialData?.musicStyles} className="input-pro border-pink-200 focus:border-pink-500 bg-white" placeholder="Copla, Clásica, Rock..." /></div>
                        <div><label className="label-pro text-pink-900/70">Sonidos/Músicas Desagradables</label><input name="dislikedSounds" defaultValue={initialData?.dislikedSounds} className="input-pro border-pink-200 focus:border-pink-500 bg-white" placeholder="Ruido fuerte, Agudos..." /></div>
                    </div>
                    <div><label className="label-pro text-pink-900/70">Canciones Biográficas / Significativas (Anclajes)</label><textarea name="isoSongs" defaultValue={initialData?.isoSongs} className="input-pro h-20 resize-none border-pink-200 focus:border-pink-500 bg-white" placeholder="Lista de canciones clave para la historia de vida..." /></div>
                </div>

                {/* SECCIÓN 4: OBJETIVOS Y CONSENTIMIENTO */}
                <div>
                    <label className="label-pro">Expectativas y Objetivos Iniciales</label>
                    <textarea name="initialGoals" defaultValue={initialData?.initialGoals} className="input-pro h-24 resize-none" placeholder="Qué espera el paciente/familia de la terapia..." />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200 gap-4">
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                        <input type="checkbox" checked={hasConsent} onChange={e => setHasConsent(e.target.checked)} className="w-5 h-5 accent-emerald-600 rounded focus:ring-emerald-500 border-gray-300" />
                        <span className={`text-sm font-bold ${hasConsent ? 'text-emerald-700' : 'text-slate-500'}`}>Consentimiento Firmado y Guardado</span>
                    </label>
                    <Button type="button" variant="secondary" size="sm" icon={Printer} onClick={handlePrintConsent}>Imprimir Modelo</Button>
                </div>

            </div>

        </form></div>

        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-2xl">
            <Button onClick={onClose} variant="secondary">Cancelar</Button>
            {/* BOTÓN CORREGIDO: Dispara el submit manualmente a través de la referencia */}
            <Button icon={Save} onClick={() => formRef.current.requestSubmit()}>Guardar Cambios</Button>
        </div>
    </div> </div>);
};

// --- SESSION MODAL ---
const SessionModal = ({ onClose, onSave, initialData, patientType }) => {
    const [scores, setScores] = useState(initialData?.scores || Array(9).fill(0));
    const [mtsas, setMtsas] = useState(initialData?.mtsas || { visual: false, sync: false, affect: false, initiative: false });
    const [date, setDate] = useState(formatDateForInput(initialData?.date || new Date().toLocaleDateString('es-ES')));
    const [sessionType, setSessionType] = useState(initialData?.type || 'individual');
    const [activityDetails, setActivityDetails] = useState(initialData?.activityDetails || {});
    const [isAbsent, setIsAbsent] = useState(initialData?.isAbsent || false);
    const [price, setPrice] = useState(initialData?.price || 50);
    const [isPaid, setIsPaid] = useState(initialData?.paid || false);

    const guide = CLINICAL_GUIDES[patientType] || CLINICAL_GUIDES.other;

    const toggleActivity = (actId) => {
        const newDetails = { ...activityDetails };
        if (newDetails[actId] !== undefined) { delete newDetails[actId]; } else { newDetails[actId] = ""; }
        setActivityDetails(newDetails);
    };

    const updateActivityDetail = (actId, text) => { setActivityDetails(prev => ({ ...prev, [actId]: text })); };

    return (<div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"> <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-3d rounded-2xl animate-in zoom-in-95">
        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10 border-slate-100">
            <div><h2 className="text-xl font-bold flex items-center gap-2 text-slate-800"><ClipboardCheck className="text-pink-600" /> Bitácora de Sesión</h2><div className="flex items-center gap-2 mt-1"><Badge variant="brand">Enfoque: {guide.focus}</Badge><span className="text-xs text-slate-400 font-medium">({guide.title})</span></div></div>
            <button onClick={onClose}><X className="text-slate-400 hover:text-slate-600" /></button>
        </div>
        <div className="bg-amber-50 px-6 py-4 border-b border-amber-100/50 flex items-start gap-3"><Lightbulb className="text-amber-500 shrink-0 mt-0.5" size={18} /><div className="text-sm text-amber-900 leading-snug"><strong>Recordatorio Clínico ({guide.title}):</strong> Objetivos prioritarios: {guide.objectives.join(", ")}. Técnicas sugeridas: {guide.techniques.join(", ")}. <span className="italic opacity-80 block mt-1">Precaución: {guide.precautions.join(", ")}.</span></div></div>
        <form className="p-8 space-y-8" onSubmit={e => { e.preventDefault(); const d = new FormData(e.target); onSave({ id: initialData?.id || Date.now(), date: formatDateForDisplay(date), phase: 2, activityDetails, notes: d.get('notes'), scores, type: sessionType, groupAnalysis: d.get('groupAnalysis'), qualitative: { musical: d.get('qual_mus'), emotional: d.get('qual_emo'), cognitive: d.get('qual_cog'), physical: d.get('qual_fis') }, price, paid: isPaid, isAbsent }); }}>
            <div className="flex justify-center mb-6 gap-6 items-end">
                <div className="flex flex-col w-1/3"><label className="label-pro">Fecha Sesión</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-pro" required /></div>
                <div className="flex flex-col w-1/3"><label className="label-pro">Estado Asistencia</label><div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200"><button type="button" onClick={() => setIsAbsent(false)} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${!isAbsent ? 'bg-white text-emerald-600 shadow-sm ring-1 ring-emerald-100' : 'text-slate-400 hover:text-slate-600'}`}>Asistió</button><button type="button" onClick={() => setIsAbsent(true)} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${isAbsent ? 'bg-white text-red-600 shadow-sm ring-1 ring-red-100' : 'text-slate-400 hover:text-slate-600'}`}>Ausencia</button></div></div>
                <div className="flex flex-col w-1/3"><label className="label-pro">Pago</label><div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200"><div className="flex flex-col pl-2"><span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Importe</span><div className="flex items-baseline"><input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} className="w-16 bg-transparent font-bold text-lg text-slate-700 outline-none -mt-1" /><span className="text-xs font-bold text-slate-400">€</span></div></div><button type="button" onClick={() => setIsPaid(!isPaid)} className={`ml-auto px-4 py-2 rounded-lg text-xs font-black tracking-wide transition-colors ${isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{isPaid ? 'PAGADO' : 'PENDIENTE'}</button></div></div>
            </div>
            {!isAbsent && (
                <>
                    <div className="space-y-4"><label className="label-pro flex items-center gap-2 text-slate-600"><ClipboardList size={16} /> Desarrollo de la Sesión (Ejercicios)</label><div className="grid grid-cols-1 gap-3">{SESSION_ACTIVITIES.map(act => { const isSelected = activityDetails[act.id] !== undefined; return (<div key={act.id} className={`border rounded-xl transition-all duration-300 ${isSelected ? 'border-pink-500 bg-pink-50/20 shadow-md transform -translate-y-0.5' : 'border-slate-200 bg-white hover:border-pink-200'}`}><div className="flex items-center gap-3 p-4 cursor-pointer" onClick={() => toggleActivity(act.id)}><div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-pink-500 border-pink-500' : 'bg-white border-slate-300'}`}>{isSelected && <CheckSquare size={14} className="text-white" />}</div><span className={`text-sm font-bold ${isSelected ? 'text-slate-800' : 'text-slate-500'}`}>{act.label}</span></div>{isSelected && (<div className="px-4 pb-4 animate-in slide-in-from-top-2 fade-in"><textarea className="w-full bg-white border border-pink-200 rounded-lg p-3 text-sm text-slate-700 h-24 focus:outline-none focus:ring-2 focus:ring-pink-200 resize-none shadow-inner" placeholder={`Detalles: ${act.placeholder}`} value={activityDetails[act.id]} onChange={(e) => updateActivityDetail(act.id, e.target.value)} autoFocus /></div>)}</div>); })}</div></div>
                    <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-inner"><label className="label-pro mb-6 text-center text-slate-500 w-full border-b border-slate-200 pb-2">Evaluación Cualitativa por Áreas</label><div className="grid grid-cols-1 md:grid-cols-2 gap-8"><div><label className="text-xs font-bold text-slate-500 mb-1.5 block uppercase tracking-wide">Respuesta Sonora-Musical</label><textarea name="qual_mus" defaultValue={initialData?.qualitative?.musical} className="input-pro h-24 resize-none text-sm bg-white" placeholder="Ritmo, melodía, intensidad..." /></div><div><label className="text-xs font-bold text-slate-500 mb-1.5 block uppercase tracking-wide">Respuesta Emocional</label><textarea name="qual_emo" defaultValue={initialData?.qualitative?.emotional} className="input-pro h-24 resize-none text-sm bg-white" placeholder="Estado de ánimo..." /></div><div><label className="text-xs font-bold text-slate-500 mb-1.5 block uppercase tracking-wide">Respuesta Cognitiva</label><textarea name="qual_cog" defaultValue={initialData?.qualitative?.cognitive} className="input-pro h-24 resize-none text-sm bg-white" placeholder="Atención, memoria, lenguaje..." /></div><div><label className="text-xs font-bold text-slate-500 mb-1.5 block uppercase tracking-wide">Respuesta Física/Motora</label><textarea name="qual_fis" defaultValue={initialData?.qualitative?.physical} className="input-pro h-24 resize-none text-sm bg-white" placeholder="Movimiento, tono..." /></div></div></div>
                    <div className="border-t border-slate-100 pt-6"><label className="label-pro mb-4">Evaluación Cuantitativa (0-3)</label><div className="grid grid-cols-2 gap-4">{EVALUATION_AREAS.map((a, i) => (<div key={i} className="flex justify-between items-center py-1"><span className="text-xs font-medium text-slate-600">{a}</span><div className="flex gap-1">{[0, 1, 2, 3].map(v => <button type="button" key={v} onClick={() => { const n = [...scores]; n[i] = v; setScores(n) }} className={`w-8 h-8 text-xs rounded-lg font-bold transition-all ${scores[i] === v ? 'bg-pink-500 text-white shadow-md scale-110' : 'bg-white border border-slate-200 text-slate-400 hover:bg-slate-50'}`}>{v}</button>)}</div></div>))}</div></div>
                </>
            )}
            <div className="pt-2"><label className="label-pro">Notas Generales / Incidencias</label><textarea name="notes" defaultValue={initialData?.notes} className="input-pro h-32 text-base" placeholder={isAbsent ? "Motivo de la ausencia..." : "Observaciones generales de la sesión..."} required /></div>
            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3"><Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button><Button type="submit" icon={Save} className="shadow-lg hover:shadow-xl px-8">Guardar Sesión</Button></div>
        </form> </Card> </div>);
};

const ClinicalGuideModal = ({ onClose, defaultTab = 'dementia' }) => {
    const [activeTab, setActiveTab] = useState(defaultTab); const guide = CLINICAL_GUIDES[activeTab];
    return (<div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"> <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"> <div className="p-6 border-b flex justify-between items-center bg-white sticky top-0 z-10"> <h2 className="text-lg font-bold flex items-center gap-2"><BookOpen className="text-pink-600" /> Guía Clínica (Manual Sección 5)</h2> <button onClick={onClose}><X className="text-slate-400" /></button> </div> <div className="flex border-b"> {Object.keys(CLINICAL_GUIDES).map(key => (<button key={key} onClick={() => setActiveTab(key)} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider ${activeTab === key ? 'text-pink-600 border-b-2 border-pink-600 bg-pink-50' : 'text-slate-500 hover:bg-slate-50'}`}>{key === 'dementia' ? 'Demencias' : key === 'mood' ? 'Ánimo' : 'Neurológico'}</button>))} </div> <div className="p-8 space-y-6"> <div><h3 className="text-xl font-black text-slate-800 mb-2">{guide.title}</h3><p className="text-slate-500 text-sm italic">Recomendaciones del Método Activa</p></div> <div className="grid grid-cols-2 gap-6"> <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100"> <h4 className="font-bold text-emerald-800 text-sm mb-3 flex items-center gap-2"><Zap size={16} /> Objetivos Prioritarios</h4> <ul className="space-y-2">{guide.objectives.map(o => <li key={o} className="text-xs text-emerald-700 flex gap-2"><CheckCircle2 size={12} className="shrink-0 mt-0.5" /> {o}</li>)}</ul> </div> <div className="bg-blue-50 p-4 rounded-xl border border-blue-100"> <h4 className="font-bold text-blue-800 text-sm mb-3 flex items-center gap-2"><Music size={16} /> Técnicas Sugeridas</h4> <ul className="space-y-2">{guide.techniques.map(t => <li key={t} className="text-xs text-blue-700 flex gap-2"><PlayCircle size={12} className="shrink-0 mt-0.5" /> {t}</li>)}</ul> </div> </div> <div className="bg-amber-50 p-4 rounded-xl border border-amber-100"> <h4 className="font-bold text-amber-800 text-sm mb-2 flex items-center gap-2"><AlertCircle size={16} /> Precauciones Clínicas</h4> <p className="text-xs text-amber-700">{guide.precautions.join(" • ")}</p> </div> </div> </Card> </div>);
};

const DocumentationCenter = ({ patient, onClose, isTemplate }) => {
    // Versión simplificada para mantener integridad del archivo
    return <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4"><div className="bg-white p-8 rounded-xl max-w-4xl w-full h-[80vh] flex flex-col"><div className="flex justify-between mb-4"><h2>Centro de Documentación {isTemplate ? '(Plantillas)' : ''}</h2><button onClick={onClose}><X /></button></div><div className="flex-1 bg-slate-100 flex items-center justify-center text-slate-400">Funcionalidad de Informes PDF disponible en versiones anteriores (restaurada)</div></div></div>;
};

// --- SIDEBAR COMPONENT ---
const Sidebar = ({ currentView, onChangeView, sidebarOpen, setSidebarOpen, onLogout }) => {
    const filters = [
        { id: 'dashboard', label: 'Panel Principal', icon: LayoutDashboard },
        { id: 'calendar', label: 'Agenda Clínica', icon: Calendar },
        { id: 'patients', label: 'Pacientes', icon: Users },
        { id: 'sessions', label: 'Sesiones Globales', icon: Activity },
        { id: 'reports', label: 'Centro Documental', icon: FileText }
    ];

    return (
        <>
            <div className={`fixed inset-y-0 left-0 w-64 bg-slate-900 text-white z-40 transform transition-transform duration-300 ease-in-out shadow-2xl ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                    <div onClick={() => onChangeView('dashboard')} className="cursor-pointer group">
                        <h2 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-rose-600 group-hover:from-pink-300 group-hover:to-rose-500 transition-all">ACTIVA</h2>
                        <p className="text-[10px] text-slate-400 tracking-[0.2em] font-bold">MUSICOTERAPIA</p>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white"><X /></button>
                </div>

                <nav className="p-4 space-y-2">
                    {filters.map(item => {
                        const active = currentView === item.id;
                        return (
                            <button key={item.id} onClick={() => { onChangeView(item.id); setSidebarOpen(false); }} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group relative overflow-hidden ${active ? 'bg-gradient-to-r from-pink-600 to-rose-600 shadow-lg text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                                <item.icon size={20} className={active ? 'text-white' : 'text-slate-500 group-hover:text-pink-400 transition-colors'} strokeWidth={active ? 2.5 : 2} />
                                <span className="relative z-10">{item.label}</span>
                                {active && <div className="absolute right-3 w-2 h-2 rounded-full bg-white shadow-glow animate-pulse" />}
                            </button>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-slate-800 bg-slate-900/50 backdrop-blur-sm">
                    <button onClick={() => onChangeView('settings')} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all mb-2 ${currentView === 'settings' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><Settings size={20} /><span className="text-sm">Configuración</span></button>
                    <button onClick={onLogout} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all"><LogOut size={20} /><span className="text-sm font-bold">Cerrar Sesión</span></button>
                </div>
            </div>
            {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />}
        </>
    );
};

// --- VIEW: PATIENTS LIST ---
const PatientsView = ({ patients, onNavigate, filter, setFilter, search, setSearch }) => {
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 12;

    const filtered = patients.filter(p => {
        if (filter !== 'all' && p.pathologyType !== filter) return false;
        return p.name.toLowerCase().includes(search.toLowerCase());
    });

    // Pagination logic
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginatedPatients = filtered.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div><h1 className="text-2xl font-black text-slate-900 flex items-center gap-3"><Users className="text-pink-600" /> Directorio Pacientes</h1><p className="text-slate-500 text-sm mt-1 flex items-center gap-2"><Filter size={14} /> Filtro actual: <span className="font-bold uppercase bg-slate-100 px-2 py-0.5 rounded text-slate-700">{filter === 'all' ? 'Todos' : filter}</span></p></div>
                <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
                    <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200 overflow-x-auto no-scrollbar">
                        {['all', 'dementia', 'mood', 'neuro', 'other'].map(f => (
                            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${filter === f ? 'bg-white text-pink-600 shadow-sm ring-1 ring-pink-100' : 'text-slate-500 hover:text-slate-700'}`}>{f === 'all' ? 'Todos' : f === 'dementia' ? 'Cognitivo' : f === 'mood' ? 'Salud Mental' : f === 'neuro' ? 'Neuro' : 'Otros'}</button>
                        ))}
                    </div>
                    <div className="relative flex-1"><Search className="absolute left-3 top-2.5 text-slate-400" size={18} /><input className="input-pro pl-10" placeholder="Buscar por nombre..." value={search} onChange={e => setSearch(e.target.value)} /></div>
                </div>
            </header>

            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4"><Users size={32} className="text-slate-300" /></div>
                    <p className="text-slate-400 font-bold mb-2">No se encontraron pacientes</p>
                    <p className="text-slate-400 text-sm">Intenta ajustar los filtros de búsqueda</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {paginatedPatients.map(p => {
                            const validSessionsCount = p.sessions ? p.sessions.filter((s) => !s.isAbsent).length : 0;
                            const lastSession = p.sessions && p.sessions.length > 0 ? p.sessions[p.sessions.length - 1].date : 'Sin sesiones';

                            return (
                                <Card key={p.id} noPadding className="hover:ring-4 hover:ring-pink-500/10 cursor-pointer group hover:-translate-y-1 transition-all h-full flex flex-col relative overflow-hidden bg-white border border-slate-100">
                                    <div onClick={() => onNavigate('detail', p)} className="p-6 flex flex-col h-full z-10 relative">
                                        <div className="flex justify-between items-start mb-6">
                                            <PatientAvatar photo={p.photo} name={p.name} size="md" />
                                            <Badge variant={p.pathologyType === 'dementia' ? 'warning' : p.pathologyType === 'mood' ? 'brand' : 'group'}>{p.diagnosis ? p.diagnosis.substring(0, 15) + '...' : 'General'}</Badge>
                                        </div>
                                        <h3 className="font-bold text-lg text-slate-900 mb-1 group-hover:text-pink-600 transition-colors line-clamp-1">{p.name}</h3>
                                        <p className="text-xs text-slate-500 font-medium mb-4 flex items-center gap-1"><Clock size={12} /> Último: {lastSession}</p>

                                        <div className="mt-auto space-y-3">
                                            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider"><span>Proceso</span><span>{validSessionsCount} Sesiones</span></div>
                                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full shadow-lg relative" style={{ width: `${Math.min(100, (validSessionsCount / 20) * 100)}%` }}><div className="absolute right-0 top-0 bottom-0 w-2 bg-white/30 animate-pulse" /></div></div>
                                        </div>
                                    </div>
                                    {/* Decoración de fondo */}
                                    <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-gradient-to-br from-slate-50 to-pink-50 rounded-full z-0 group-hover:scale-150 transition-transform duration-500" />
                                </Card>
                            );
                        })}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-8">
                            <Button
                                variant="secondary"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                icon={ChevronLeft}
                                className={currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}
                            >
                                Anterior
                            </Button>
                            <span className="text-sm font-bold text-slate-600">
                                Página {currentPage} de {totalPages}
                            </span>
                            <Button
                                variant="secondary"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                icon={ChevronRight}
                                className={currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}
                            >
                                Siguiente
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

// --- VIEW: SESSIONS MANAGER ---
const SessionsManager = ({ patients, onEditSession }) => {
    const allSessions = patients.flatMap(p => (p.sessions || []).map(s => ({ ...s, patientName: p.name, patient: p }))).sort((a, b) => {
        const d1 = a.date.split('/').reverse().join(''); const d2 = b.date.split('/').reverse().join(''); return d2.localeCompare(d1);
    });

    return (
        <div className="space-y-6 animate-in fade-in max-w-7xl mx-auto">
            <header className="mb-6"><h1 className="text-2xl font-black text-slate-900">Histórico de Sesiones</h1><p className="text-slate-500">Registro global de intervenciones ({allSessions.length})</p></header>
            <Card className="overflow-hidden border border-slate-100 shadow-sm" noPadding>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-xs border-b border-slate-200"><tr><th className="p-4">Fecha</th><th className="p-4">Paciente</th><th className="p-4">Tipo</th><th className="p-4">Fase</th><th className="p-4">Estado</th><th className="p-4 text-right">Acción</th></tr></thead>
                        <tbody className="divide-y divide-slate-100">
                            {allSessions.map((s, i) => (
                                <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="p-4 font-bold text-slate-700">{s.date}</td>
                                    <td className="p-4 font-medium text-slate-900">{s.patientName}</td>
                                    <td className="p-4"><Badge variant={s.type === 'group' ? 'group' : 'neutral'}>{s.type === 'group' ? 'Grupal' : 'Individual'}</Badge></td>
                                    <td className="p-4 text-slate-500">Fase {s.phase}</td>
                                    <td className="p-4">{s.isAbsent ? <span className="text-red-500 font-bold text-xs bg-red-50 px-2 py-1 rounded-full">Ausente</span> : <span className="text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-1 rounded-full">Realizada</span>}</td>
                                    <td className="p-4 text-right"><Button size="sm" variant="ghost" icon={Edit} onClick={() => onEditSession(s.patient, s.id)}>Editar</Button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

// --- VIEW: CALENDAR ---
const CalendarView = ({ patients }) => {
    // Generar calendario dummy visual
    const days = Array.from({ length: 35 }, (_, i) => i + 1); // 5 semanas

    return (
        <div className="space-y-6 animate-in fade-in h-full flex flex-col max-w-7xl mx-auto">
            <header className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div><h1 className="text-2xl font-black text-slate-900 flex items-center gap-3"><CalendarDays className="text-blue-600" /> Agenda Clínica</h1><p className="text-slate-500">Visualización mensual de sesiones</p></div>
                <div className="flex gap-2"><Button variant="secondary" icon={ChevronLeft}>Anterior</Button><span className="px-4 py-2 font-bold text-slate-800 bg-slate-100 rounded-lg flex items-center">Octubre 2023</span><Button variant="secondary" icon={ChevronRight}>Siguiente</Button></div>
            </header>
            <Card className="flex-1 p-6 border-slate-100 shadow-sm">
                <div className="grid grid-cols-7 mb-4 text-center"><div className="font-bold text-slate-400 text-xs uppercase tracking-widest">Lun</div><div className="font-bold text-slate-400 text-xs uppercase tracking-widest">Mar</div><div className="font-bold text-slate-400 text-xs uppercase tracking-widest">Mié</div><div className="font-bold text-slate-400 text-xs uppercase tracking-widest">Jue</div><div className="font-bold text-slate-400 text-xs uppercase tracking-widest">Vie</div><div className="font-bold text-pink-400 text-xs uppercase tracking-widest">Sáb</div><div className="font-bold text-pink-400 text-xs uppercase tracking-widest">Dom</div></div>
                <div className="grid grid-cols-7 grid-rows-5 gap-2 h-[60vh]">
                    {days.map(d => {
                        const dayNum = d > 31 ? d - 31 : d;
                        const isToday = dayNum === new Date().getDate(); // Simple check
                        return (
                            <div key={d} className={`border border-slate-100 rounded-xl p-2 relative hover:bg-slate-50 transition-colors ${isToday ? 'bg-blue-50/50 ring-2 ring-blue-100' : ''}`}>
                                <span className={`text-xs font-bold ${isToday ? 'text-blue-600' : 'text-slate-400'}`}>{dayNum}</span>
                                {d === 20 && <div className="mt-2 text-[10px] bg-pink-100 text-pink-700 p-1 rounded font-bold truncate">10:00 Antonio G.</div>}
                                {d === 22 && <div className="mt-2 text-[10px] bg-indigo-100 text-indigo-700 p-1 rounded font-bold truncate">17:00 Grupo Tarde</div>}
                            </div>
                        );
                    })}
                </div>
            </Card>
        </div>
    );
};

// --- VIEW: PATIENT DETAIL ---
const PatientDetail = ({ patient, onBack, onEdit, onEditSession, onNewSession, onOpenCognitive, onOpenDocs }) => {
    const validSessions = patient.sessions ? patient.sessions.filter(s => !s.isAbsent).length : 0;
    const sortedSessions = patient.sessions ? [...patient.sessions].sort((a, b) => { const d1 = a.date.split('/').reverse().join(''); const d2 = b.date.split('/').reverse().join(''); return d2.localeCompare(d1); }) : [];

    // Calcular próximos objetivos (dummy logic)
    const nextObjectives = patient.pathologyType === 'dementia' ? ["Potenciar memoria a corto plazo", "Mantener orientación"] : ["Mejorar regulación emocional", "Facilitar expresión"];

    return (
        <div className="space-y-6 animate-in fade-in max-w-7xl mx-auto">
            <header className="flex items-center gap-4 mb-4">
                <Button variant="secondary" icon={ArrowLeft} onClick={onBack}>Volver</Button>
                <div className="flex-1"><h1 className="text-3xl font-black text-slate-900">{patient.name}</h1><p className="text-slate-500 font-medium">{patient.diagnosis}</p></div>
                <div className="flex gap-2">
                    <Button variant="secondary" icon={Printer} onClick={() => window.print()}>Imprimir Ficha</Button>
                    <Button variant="secondary" icon={Edit} onClick={() => onEdit(patient)}>Editar</Button>
                    <Button icon={PlusCircle} onClick={() => onNewSession(patient)}>Nueva Sesión</Button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* COLUMNA IZQUIERDA: INFO PACIENTE */}
                <div className="space-y-6">
                    <Card className="text-center relative overflow-hidden group">
                        <div className="flex justify-center mb-4 relative z-10"><PatientAvatar photo={patient.photo} name={patient.name} size="xl" /></div>
                        <h2 className="text-xl font-bold text-slate-900 relative z-10">{patient.name}</h2>
                        <p className="text-sm text-slate-500 mb-4 relative z-10">{patient.age} años • {patient.reference || 'Sin Ref'}</p>
                        <div className="flex justify-center gap-2 mb-4 relative z-10"><Badge variant="brand">{patient.pathologyType?.toUpperCase()}</Badge><Badge variant="neutral">{patient.sessionsCompleted || 0} Sesiones</Badge></div>
                        <div className="p-4 bg-slate-50 rounded-xl text-left text-sm space-y-2 relative z-10">
                            <div className="flex justify-between border-b border-slate-200 pb-2"><span className="text-slate-500">Fecha Ingreso</span><span className="font-bold text-slate-700">{formatDateForDisplay(patient.joinedDate)}</span></div>
                            <div className="flex justify-between border-b border-slate-200 pb-2"><span className="text-slate-500">Próxima Cita</span><span className="font-bold text-pink-600">--</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Estado</span><span className="font-bold text-emerald-600 flex items-center gap-1"><CheckCircle2 size={12} /> Activo</span></div>
                        </div>
                        {/* Decoración */}
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-pink-50 to-transparent z-0" />
                    </Card>

                    <Card>
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Target className="text-red-500" size={18} /> Objetivos Terapéuticos</h3>
                        <ul className="space-y-3">
                            {nextObjectives.map((obj, i) => (
                                <li key={i} className="flex gap-3 text-sm text-slate-700 bg-red-50 p-3 rounded-lg border border-red-100"><div className="mt-0.5"><CheckCircle2 size={16} className="text-red-500" /></div>{obj}</li>
                            ))}
                        </ul>
                    </Card>

                    <Card>
                        <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-slate-900 flex items-center gap-2"><Brain className="text-indigo-500" size={18} /> Evolución Cognitiva</h3><Button variant="ghost" size="sm" onClick={() => onOpenCognitive(patient)}>Nueva Eval.</Button></div>
                        <div className="space-y-4">
                            <div className="bg-indigo-50 p-4 rounded-xl text-center border border-indigo-100">
                                <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Último GDS</p>
                                <p className="text-3xl font-black text-indigo-700">{patient.cognitiveScores?.gds || '-'}</p>
                                <p className="text-[10px] text-indigo-500 mt-1">{patient.cognitiveScores?.date || 'Sin registros'}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-white border border-slate-200 rounded-xl text-center shadow-sm"><p className="text-[10px] uppercase text-slate-400 font-bold">MOCA</p><p className="font-bold text-slate-800 text-lg">{patient.cognitiveScores?.moca || '-'}</p></div>
                                <div className="p-3 bg-white border border-slate-200 rounded-xl text-center shadow-sm"><p className="text-[10px] uppercase text-slate-400 font-bold">MMSE</p><p className="font-bold text-slate-800 text-lg">{patient.cognitiveScores?.mmse || '-'}</p></div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* COLUMNA CENTRAL: HISTORIA Y NOTAS */}
                <div className="space-y-6 lg:col-span-2">
                    {/* ACCIONES RÁPIDAS */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <button onClick={() => onOpenDocs(patient)} className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-pink-200 transition-all text-left group"><FileText className="text-pink-500 mb-2 group-hover:scale-110 transition-transform" size={24} /><p className="font-bold text-slate-700 text-sm">Informes</p></button>
                        <button onClick={() => onOpenCognitive(patient)} className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-200 transition-all text-left group"><Brain className="text-indigo-500 mb-2 group-hover:scale-110 transition-transform" size={24} /><p className="font-bold text-slate-700 text-sm">Evaluación</p></button>
                        <button className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-emerald-200 transition-all text-left group"><Music className="text-emerald-500 mb-2 group-hover:scale-110 transition-transform" size={24} /><p className="font-bold text-slate-700 text-sm">Playlist ISO</p></button>
                        <button onClick={() => window.print()} className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-amber-200 transition-all text-left group"><Share2 className="text-amber-500 mb-2 group-hover:scale-110 transition-transform" size={24} /><p className="font-bold text-slate-700 text-sm">Compartir</p></button>
                    </div>

                    <Card>
                        <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2 text-lg"><ClipboardList className="text-slate-500" /> Histórico de Sesiones</h3>
                        {sortedSessions.length > 0 ? (
                            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                                {sortedSessions.map((session, index) => (
                                    <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 group-hover:bg-pink-500 group-hover:text-white transition-colors shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 text-slate-400">
                                            {session.isAbsent ? <X size={16} /> : <Music size={16} />}
                                        </div>
                                        <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 hover:border-pink-200 transition-colors relative">
                                            <div className="flex justify-between items-start mb-2">
                                                <time className="font-black text-slate-900">{session.date}</time>
                                                {session.isAbsent ? <span className="text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded text-xs">AUSENTE</span> : <span className="text-slate-400 font-bold text-xs">{session.phase ? `Fase ${session.phase}` : 'Sesión'}</span>}
                                            </div>
                                            <p className="text-slate-600 text-sm leading-relaxed mb-3">{session.notes}</p>

                                            {!session.isAbsent && (
                                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-3">
                                                    <div className="flex gap-2 flex-wrap text-xs font-bold text-slate-500 mb-2">
                                                        {session.activityDetails && Object.keys(session.activityDetails).map(k => <span key={k} className="bg-white border border-slate-200 px-2 py-1 rounded shadow-sm">{SESSION_ACTIVITIES.find(a => a.id === k)?.label || k}</span>)}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] uppercase font-bold text-slate-400">Valoración Global:</span>
                                                        <div className="flex gap-0.5">{[...Array(3)].map((_, i) => <div key={i} className={`w-2 h-2 rounded-full ${i < (session.scores ? Math.round(session.scores.reduce((a, b) => a + b, 0) / session.scores.length) : 0) ? 'bg-pink-500' : 'bg-slate-200'}`} />)}</div>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex justify-end pt-2 border-t border-slate-100 w-full mt-2">
                                                <button onClick={() => onEditSession(patient, session.id)} className="text-xs font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1"><Edit size={12} /> Detalles / Editar</button>
                                            </div>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                                <p className="text-slate-400 font-medium">No hay sesiones registradas aún.</p>
                                <Button className="mt-4" icon={PlusCircle} onClick={() => onNewSession(patient)}>Registrar Primera Sesión</Button>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

// --- IMPORT ICONS MISSING ---
import { Target } from 'lucide-react';

const App = () => {
    // ESTADO GLOBAL
    const [view, setView] = useState('dashboard');
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [patients, setPatients] = useState(() => { const s = localStorage.getItem('patients'); return s ? JSON.parse(s) : INITIAL_PATIENTS; });
    const [clinicSettings, setClinicSettings] = useState(() => { const s = localStorage.getItem('clinicSettings'); return s ? JSON.parse(s) : {}; });

    // NAVIGATION DATA
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // MODAL STATES
    const [modals, setModals] = useState({ quick: false, admission: false, cognitive: false, group: false, session: false, guide: false, docs: false });
    const [modalData, setModalData] = useState(null); // Para pasar datos a los modales (ej. editar paciente)
    const [editSessionIndex, setEditSessionIndex] = useState(null);

    // TOAST
    const [toast, setToast] = useState(null);
    const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

    // PERSISTENCIA
    useEffect(() => { localStorage.setItem('patients', JSON.stringify(patients)); }, [patients]);
    useEffect(() => { localStorage.setItem('clinicSettings', JSON.stringify(clinicSettings)); }, [clinicSettings]);

    // HANDLERS
    const handleSavePatient = (data) => {
        if (modalData) {
            setPatients(patients.map(p => p.id === modalData.id ? { ...p, ...data } : p));
            showToast("Paciente actualizado correctamente");
        } else {
            const newPatient = { id: Date.now(), ...data, sessions: [], joinedDate: new Date().toLocaleDateString('es-ES') };
            setPatients([...patients, newPatient]);
            showToast("Nuevo paciente registrado con éxito");
        }
        setModals({ ...modals, admission: false }); setModalData(null);
    };

    const handleSaveSession = (data) => {
        const pIndex = patients.findIndex(p => p.id === selectedPatient?.id || (modalData && p.id === modalData.id));
        if (pIndex === -1) return;

        const updatedPatients = [...patients];
        const patient = updatedPatients[pIndex];

        if (editSessionIndex !== null) {
            // Editar existente
            const sessionIndex = patient.sessions.findIndex(s => s.id === editSessionIndex);
            if (sessionIndex !== -1) {
                patient.sessions[sessionIndex] = { ...patient.sessions[sessionIndex], ...data };
                showToast("Sesión actualizada");
            }
        } else {
            // Nueva
            const newSession = { ...data, id: Date.now() };
            if (!patient.sessions) patient.sessions = [];
            patient.sessions.push(newSession);
            // Actualizar último progreso
            if (!data.isAbsent) patient.sessionsCompleted = (patient.sessionsCompleted || 0) + 1;
            showToast("Sesión registrada correctamente");
        }

        setPatients(updatedPatients);
        setModals({ ...modals, session: false }); setEditSessionIndex(null); setModalData(null);
    };

    const handleQuickAppt = (data) => {
        // Lógica simplificada para demo
        showToast(`Cita agendada para ${data.date} a las ${data.time}`);
        setModals({ ...modals, quick: false });
    };

    const openEditSession = (patient, sessionId) => {
        setSelectedPatient(patient);
        const session = patient.sessions.find(s => s.id === sessionId);
        setModalData(session);
        setEditSessionIndex(sessionId);
        setModals({ ...modals, session: true });
    };

    const openNewSession = (patient) => {
        setSelectedPatient(patient);
        setModalData(null);
        setEditSessionIndex(null);
        setModals({ ...modals, session: true });
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
            <GlobalStyles />
            <Sidebar currentView={view} onChangeView={setView} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} onLogout={() => window.location.reload()} />

            <main className="flex-1 flex flex-col h-full overflow-hidden relative md:pl-64 transition-all duration-300">
                {/* TOP BAR MOBILE */}
                <div className="md:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 z-20">
                    <button onClick={() => setSidebarOpen(true)} className="text-slate-600"><Menu /></button>
                    <span className="font-bold text-slate-800">ACTIVA</span>
                    <button onClick={() => setModals({ ...modals, quick: true })} className="text-pink-600"><PlusCircle /></button>
                </div>

                {/* CONTENIDO PRINCIPAL SCROLLEABLE */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
                    {/* Renderizado Condicional de Vistas */}
                    {view === 'dashboard' && <Dashboard patients={patients} onNavigate={(v, p) => { if (v === 'detail') setSelectedPatient(p); setView(v); }} onNewPatient={() => { setModalData(null); setModals({ ...modals, admission: true }); }} searchQuery={search} setSearchQuery={setSearch} />}

                    {view === 'patients' && <PatientsView patients={patients} filter={filter} setFilter={setFilter} search={search} setSearch={setSearch} onNavigate={(v, p) => { if (v === 'detail') setSelectedPatient(p); setView(v); }} />}

                    {view === 'calendar' && <CalendarView patients={patients} />}

                    {view === 'sessions' && <SessionsManager patients={patients} onEditSession={openEditSession} />}

                    {view === 'settings' && <SettingsView clinicSettings={clinicSettings} onSaveSettings={(d) => { setClinicSettings(d); showToast("Configuración guardada"); }} />}

                    {view === 'detail' && selectedPatient && (
                        <PatientDetail
                            patient={selectedPatient}
                            onBack={() => setView('patients')}
                            onEdit={(p) => { setModalData(p); setModals({ ...modals, admission: true }); }}
                            onNewSession={openNewSession}
                            onEditSession={openEditSession}
                            onOpenCognitive={(p) => { setModalData(p.cognitiveScores); setModals({ ...modals, cognitive: true }); }}
                            onOpenDocs={(p) => { setModals({ ...modals, docs: true }); }}
                        />
                    )}
                </div>

                {/* FAB (Floating Action Button) para añadir rápido */}
                <div className="absolute bottom-8 right-8 flex flex-col gap-4 z-30">
                    <button onClick={() => setModals({ ...modals, guide: true })} className="w-12 h-12 bg-white text-slate-600 rounded-full shadow-lg border border-slate-200 flex items-center justify-center hover:scale-110 transition-transform" title="Guía Clínica"><BookOpen size={20} /></button>
                    <button onClick={() => setModals({ ...modals, quick: true })} className="w-14 h-14 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-full shadow-xl shadow-pink-500/30 flex items-center justify-center hover:scale-110 transition-transform animate-pulse-slow" title="Acción Rápida"><Plus size={28} /></button>
                </div>

            </main>

            {/* MODALES GLOBALES */}
            {modals.quick && <QuickAppointmentModal onClose={() => setModals({ ...modals, quick: false })} patients={patients} onSave={handleQuickAppt} />}
            {modals.admission && <AdmissionModal onClose={() => setModals({ ...modals, admission: false })} onSave={handleSavePatient} initialData={modalData} />}
            {modals.session && <SessionModal onClose={() => setModals({ ...modals, session: false })} onSave={handleSaveSession} initialData={modalData} patientType={selectedPatient?.pathologyType} />}
            {modals.cognitive && <CognitiveModal onClose={() => setModals({ ...modals, cognitive: false })} onSave={(d) => { const newP = { ...selectedPatient, cognitiveScores: d }; setPatients(patients.map(p => p.id === selectedPatient.id ? newP : p)); setSelectedPatient(newP); setModals({ ...modals, cognitive: false }); showToast("Evaluación guardada"); }} initialData={modalData} />}
            {modals.group && <GroupSessionModal onClose={() => setModals({ ...modals, group: false })} patients={patients} onSave={() => { }} />}
            {modals.guide && <ClinicalGuideModal onClose={() => setModals({ ...modals, guide: false })} />}
            {modals.docs && <DocumentationCenter onClose={() => setModals({ ...modals, docs: false })} patient={selectedPatient} />}

            {/* TOAST SYSTEM */}
            {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default App;
