
// --- CONSTANTS ---
export const BRAND_COLOR = "#EC008C";

export const TREATMENT_PHASES = [
    { id: 1, name: "Vinculación y Regulación", range: "0-4", focus: "Espacio seguro", color: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
    { id: 2, name: "Activación y Participación", range: "5-8", focus: "Atención y memoria", color: "bg-blue-500", text: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" },
    { id: 3, name: "Expresión y Relación", range: "9-12", focus: "Vínculo profundo", color: "bg-purple-500", text: "text-purple-700", bg: "bg-purple-50", border: "border-purple-200" },
    { id: 4, name: "Integración y Autonomía", range: "13-16", focus: "Generalizar logros", color: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
    { id: 5, name: "Cierre y Transición", range: "17-20", focus: "Evaluación final", color: "bg-pink-500", text: "text-pink-700", bg: "bg-pink-50", border: "border-pink-200" }
];

export const EVALUATION_AREAS = ["Atención sostenida", "Orientación", "Regulación emocional", "Expresión emocional", "Comunicación verbal", "Comunicación no verbal", "Interacción social", "Respuesta musical", "Iniciativa musical"];

export const COMMON_PATHOLOGIES = [
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

export const CLINICAL_GUIDES: Record<string, any> = {
    dementia: { title: "Deterioro Cognitivo", objectives: ["Estimular funciones cognitivas", "Favorecer orientación", "Reducir ansiedad/agitación"], techniques: ["Canciones autobiográficas", "Ritmos predecibles"], precautions: ["Evitar sobreestimulación", "Controlar duración"], focus: "Estimulación Cognitiva" },
    mood: { title: "Trastornos del Ánimo", objectives: ["Facilitar expresión", "Regular activación", "Reforzar autoestima"], techniques: ["Improvisación guiada", "Canciones emocionales"], precautions: ["Respetar silencios", "Contención emocional"], focus: "Regulación Emocional" },
    neuro: { title: "Daño Neurológico", objectives: ["Rehabilitación funcional", "Coordinación motora", "Motivación"], techniques: ["Ritmo para movimiento", "Sincronización"], precautions: ["Fatiga física", "Latencia de respuesta"], focus: "Neurorehabilitación" },
    other: { title: "Bienestar General", objectives: ["Autoconocimiento", "Relajación"], techniques: ["Escucha activa", "Improvisación libre"], precautions: ["Respeto al proceso"], focus: "Crecimiento Personal" }
};

export const SESSION_ACTIVITIES = [
    { id: "welcome", label: "Bienvenida / Dinámica Inicial", placeholder: "Canción de saludo, sintonización..." },
    { id: "improv", label: "Improvisación Instrumental", placeholder: "Instrumentos usados, consigna..." },
    { id: "singing", label: "Canto / Trabajo Vocal", placeholder: "Canciones cantadas, tonalidad..." },
    { id: "listening", label: "Audición Musical", placeholder: "Obras escuchadas, reacción..." },
    { id: "movement", label: "Movimiento / Corporal", placeholder: "Tipo de movimiento, uso del espacio..." },
    { id: "composition", label: "Composición", placeholder: "Songwriting, análisis de letra..." },
    { id: "relaxation", label: "Relajación", placeholder: "Técnica usada, música de fondo..." },
    { id: "closing", label: "Cierre / Despedida", placeholder: "Ritual de salida, feedback..." }
];

// Dummy Data
export const INITIAL_PATIENTS = [
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
    },
    { id: 2, name: "Lucía M.", age: 8, diagnosis: "TEA", pathologyType: 'neuro', photo: "LM", joinedDate: "2024-01-10", initialEval: [1, 2, 0, 1, 1, 1, 0, 2, 1], currentEval: [1, 2, 1, 1, 1, 1, 1, 2, 1], cognitiveScores: { moca: "-", mmse: "-", gds: "-", date: "-" }, reference: "LM-011024", clinicalFormulation: {}, sessions: [] },
    { id: 3, name: "Marc R.", age: 15, diagnosis: "Ansiedad y Estrés", pathologyType: 'mood', photo: "MR", joinedDate: "2023-11-05", initialEval: [2, 3, 1, 1, 2, 2, 1, 3, 2], currentEval: [3, 3, 2, 2, 3, 2, 2, 3, 3], cognitiveScores: { moca: "30/30", mmse: "-", gds: "-", date: "05/11/2023" }, reference: "MR-110523", clinicalFormulation: {}, sessions: [] }
];
