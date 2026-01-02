
export interface ClinicSettings {
    name?: string;
    cif?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    legalText?: string;
}

export interface FormulationData {
    selected: string[];
    text: string;
}

export interface ClinicalFormulation {
    synthesis?: FormulationData | string;
    preserved?: FormulationData | string;
    difficulties?: FormulationData | string;
    regulators?: FormulationData | string;
    hypothesis?: FormulationData | string;
    [key: string]: any; // Flexibilidad para legacy
}

export interface CognitiveScores {
    moca?: string | number;
    mmse?: string | number;
    gds?: string | number;
    date?: string;
    mocaDetails?: Record<string, number>;
    mmseDetails?: Record<string, number>;
    admissionChecks?: {
        safety: string[];
        prep: string[];
    };
}

export interface SessionSelfReflection {
    positive: string;
    improve: string;
}

export interface QualitativeEval {
    musical?: string;
    emotional?: string;
    cognitive?: string;
    physical?: string;
}

export interface Session {
    id: string | number;
    date: string;
    type: 'individual' | 'group';
    price?: number;
    paid?: boolean;
    isAbsent?: boolean;
    notes?: string;
    phase?: number; // Calculado o asignado
    activityDetails?: Record<string, string>; // { activityId: note }
    activities?: string[]; // Legacy array
    selfReflection?: SessionSelfReflection;
    qualitative?: QualitativeEval;
    scores?: number[]; // [0-3] para evaluation areas
    location?: string; // Para sesiones grupales
    participantNames?: string[]; // Para sesiones grupales
    groupAnalysis?: string; // Para sesiones grupales
    computedPhase?: number; // Calculated for UI
}

export interface Patient {
    id: string | number;
    name: string;
    age: number;
    diagnosis: string;
    pathologyType: 'dementia' | 'neuro' | 'mood' | 'other';
    photo?: string;
    contact?: string; // Added to match seeds
    joinedDate?: string;
    sessionsCompleted?: number; // Helper, puede calcularse
    initialEval?: number[];
    currentEval?: number[];
    reference?: string;
    cognitiveScores?: CognitiveScores;
    clinicalFormulation?: ClinicalFormulation;
    sessions?: Session[];
    caregiverName?: string;
    caregiverPhone?: string;
    livingSituation?: string;
    supportLevel?: string;
    lifeEvents?: string;
    musicStyles?: string;
    dislikedSounds?: string;
    isoSongs?: string;
    initialGoals?: string;
    hasConsent?: boolean;
}

export interface InvoiceData {
    clientName: string;
    clientMeta?: string;
    sessions: Session[];
    invoiceNumber?: string;
}
