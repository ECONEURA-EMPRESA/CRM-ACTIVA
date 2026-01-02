
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

// LAYOUT & THEME
import { GlobalStyles } from './theme/GlobalStyles';
import { AppLayout } from './layout/AppLayout';

// AUTH
import { LoginView } from './auth/LoginView';
import { useAuth } from './auth/useAuth';

// FEATURES
import { DashboardView } from './features/dashboard/DashboardView';
import { PatientsDirectory } from './features/patients/PatientsDirectory';
import { PatientDetail } from './features/patients/PatientDetail';
import { SessionsManager } from './features/sessions/SessionsManager';
import { CalendarView } from './features/sessions/CalendarView';
import { SettingsView } from './features/settings/SettingsView';
import { DocumentationCenter } from './features/resources/DocumentationCenter';

// API & TYPES
import { PatientsService, SettingsService } from './api/services';
import { Patient, ClinicSettings } from './lib/types';
import { INITIAL_PATIENTS } from './lib/seeds';

// Main App Component
function App() {
    const { user, loading: authLoading, demoMode, enterDemoMode } = useAuth();

    // GLOBAL STATE
    const [currentView, setCurrentView] = useState('dashboard');
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [clinicSettings, setClinicSettings] = useState<ClinicSettings>({
        name: '', address: '', phone: '', email: '', website: '', cif: '', legalText: ''
    });
    const [isLoadingData, setIsLoadingData] = useState(true);

    // DATA FETCHING (USE REAL API)
    const loadData = async () => {
        setIsLoadingData(true);
        try {
            if (demoMode) {
                // DEMO MODE: USE MOCK DATA
                setPatients(INITIAL_PATIENTS);
                setClinicSettings({
                    name: 'DEMO Clínica Método Activa',
                    address: 'C/ Ejemplo Demo, Madrid',
                    phone: '+34 600 000 000',
                    email: 'demo@activa.com',
                    website: 'demo.metodoactiva.com',
                    cif: 'DEMO-123',
                    legalText: 'Modo demostración.'
                });
            } else {
                // REAL API
                const [patientsData, settingsData] = await Promise.all([
                    PatientsService.getAll(),
                    SettingsService.get()
                ]);
                setPatients(patientsData);
                setClinicSettings(settingsData.name ? settingsData : {
                    name: 'Mi Clínica',
                    address: '',
                    phone: '',
                    email: '',
                    website: '',
                    cif: '',
                    legalText: ''
                }); // Fallback if empty
            }
        } catch (err) {
            console.error("Failed to load data:", err);
            alert("Error conectando con el servidor. Usando modo offline/demo temporalmente.");
            setPatients(INITIAL_PATIENTS); // Fallback to avoid white screen
        } finally {
            setIsLoadingData(false);
        }
    };

    useEffect(() => {
        if (user || demoMode) {
            loadData();
        }
    }, [user, demoMode]);

    // HANDLERS (REAL API WRAPPERS)
    const handleUpdatePatient = async (updatedPatient: Patient) => {
        // Optimistic Update
        setPatients(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));

        if (!demoMode && updatedPatient.id) {
            try {
                await PatientsService.update(String(updatedPatient.id), updatedPatient);
            } catch (err) {
                console.error("Failed to sync update:", err);
                // Revert logic would go here
            }
        }
    };

    const handleNewPatient = async (newPatientData: any) => {
        if (demoMode) {
            const newPatient: Patient = {
                id: Date.now().toString(),
                ...newPatientData,
                sessions: [],
                clinicalFormulation: {},
                reference: `REF-${Math.floor(Math.random() * 1000)}`
            };
            setPatients(prev => [...prev, newPatient]);
            setSelectedPatientId(newPatient.id as string);
            setCurrentView('patient-detail');
            return;
        }

        try {
            // Prepare payload
            const payload = {
                ...newPatientData,
                sessions: [],
                clinicalFormulation: {},
                reference: `REF-${Date.now().toString().slice(-4)}` // Auto-gen ref
            };
            const created = await PatientsService.create(payload);
            setPatients(prev => [...prev, created]);
            setSelectedPatientId(created.id as string);
            setCurrentView('patient-detail');
        } catch (err) {
            console.error("Failed to create patient:", err);
            alert("Error guardando el paciente.");
        }
    };

    const handleUpdateSettings = async (newSettings: ClinicSettings) => {
        setClinicSettings(newSettings);
        if (!demoMode) {
            try {
                await SettingsService.save(newSettings);
            } catch (err) {
                console.error("Failed to save settings:", err);
            }
        }
    };

    const selectedPatient = patients.find(p => p.id === selectedPatientId);

    // RENDER CONTENT SWITCH
    const renderContent = () => {
        switch (currentView) {
            case 'dashboard':
                return <DashboardView patients={patients} onViewChange={setCurrentView} />;

            case 'patients':
                return (
                    <PatientsDirectory
                        patients={patients}
                        onSelectPatient={(p) => { setSelectedPatientId(p.id as string); setCurrentView('patient-detail'); }}
                        onNewPatient={handleNewPatient}
                    />
                );

            case 'patient-detail':
                return selectedPatient ? (
                    <PatientDetail
                        patient={selectedPatient}
                        onBack={() => setCurrentView('patients')}
                        onUpdate={handleUpdatePatient}
                        clinicSettings={clinicSettings}
                    />
                ) : <div className="text-center p-10">Paciente no encontrado</div>;

            case 'sessions':
                return <SessionsManager patients={patients} onUpdatePatient={handleUpdatePatient} filterMode="individual" />;

            case 'group-sessions':
                return <SessionsManager patients={patients} onUpdatePatient={handleUpdatePatient} filterMode="group" />;

            case 'calendar':
                return <CalendarView patients={patients} />;

            case 'settings':
                return <SettingsView settings={clinicSettings} onSave={handleUpdateSettings} />;

            case 'resources':
                return <DocumentationCenter />;

            default:
                return <DashboardView patients={patients} onViewChange={setCurrentView} />;
        }
    };

    if (authLoading) return <div className="flex h-screen items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-pink-600" size={48} /></div>;

    if (!user && !demoMode) {
        return (
            <>
                <GlobalStyles />
                <LoginView onDemoLogin={enterDemoMode} />
            </>
        );
    }

    if (isLoadingData) return <div className="flex h-screen items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-indigo-600" size={48} /></div>;

    return (
        <>
            <GlobalStyles />
            <AppLayout
                userEmail={user?.email || 'demo@activa.com'}
                currentView={currentView}
                onNavigate={(view) => setCurrentView(view)}
                onLogout={() => window.location.reload()}
            >
                {renderContent()}
            </AppLayout >
        </>
    );
}

export default App;
