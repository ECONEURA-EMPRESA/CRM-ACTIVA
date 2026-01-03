import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';
import { Routes, Route, Navigate, useNavigate, useLocation, useParams } from 'react-router-dom';

// LAYOUT & THEME
import { GlobalStyles } from './theme/GlobalStyles';
import { AppLayout } from './layout/AppLayout';
import { ErrorBoundary } from './components/ui/ErrorBoundary';

// AUTH
import { LoginView } from './auth/LoginView';
import { useAuth } from './auth/useAuth';

// FEATURES (LAZY LOADED)
const DashboardView = lazy(() => import('./features/dashboard/DashboardView').then(module => ({ default: module.DashboardView })));
const PatientsDirectory = lazy(() => import('./features/patients/PatientsDirectory').then(module => ({ default: module.PatientsDirectory })));
const PatientDetail = lazy(() => import('./features/patients/PatientDetail').then(module => ({ default: module.PatientDetail })));
const SessionsManager = lazy(() => import('./features/sessions/SessionsManager').then(module => ({ default: module.SessionsManager })));
const CalendarView = lazy(() => import('./features/sessions/CalendarView').then(module => ({ default: module.CalendarView })));
const SettingsView = lazy(() => import('./features/settings/SettingsView').then(module => ({ default: module.SettingsView })));
const DocumentationCenter = lazy(() => import('./features/resources/DocumentationCenter').then(module => ({ default: module.DocumentationCenter })));

// MODALS (Eager loaded for smoother UX on interactions, or Lazy if strictly optimizing bundle)
import { QuickAppointmentModal } from './features/sessions/modals/QuickAppointmentModal';
import { GroupSessionModal } from './features/sessions/modals/GroupSessionModal';

// API & TYPES
import { PatientsService, SettingsService } from './api/services';
import { Patient, ClinicSettings, GroupSession } from './lib/types';
import { INITIAL_PATIENTS } from './lib/seeds';

// Loading Spinner for Code Splitting Suspense
const PageLoader = () => (
    <div className="flex h-full min-h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-pink-500 opacity-50" size={32} />
    </div>
);

// Main App Component
function App() {
    const { user, loading: authLoading, demoMode, enterDemoMode } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // GLOBAL STATE
    const [patients, setPatients] = useState<Patient[]>([]);
    const [clinicSettings, setClinicSettings] = useState<ClinicSettings>({
        name: '', address: '', phone: '', email: '', website: '', cif: '', legalText: ''
    });
    const [isLoadingData, setIsLoadingData] = useState(true);

    // MODAL STATES
    const [showGroupSession, setShowGroupSession] = useState(false);
    const [showQuickAppointment, setShowQuickAppointment] = useState(false);
    const [quickAppointmentMode, setQuickAppointmentMode] = useState<'existing' | 'new'>('existing');
    const [groupSessions, setGroupSessions] = useState<GroupSession[]>([]);

    // DERIVE CURRENT VIEW FOR SIDEBAR HIGHLIGHTING
    const getCurrentViewID = (pathname: string) => {
        if (pathname === '/' || pathname === '/dashboard') return 'dashboard';
        if (pathname === '/patients/adults') return 'patients-adults';
        if (pathname === '/patients/kids') return 'patients-kids';
        if (pathname.startsWith('/patients')) return 'patients';
        if (pathname === '/sessions') return 'sessions';
        if (pathname === '/sessions/group') return 'group-sessions';
        if (pathname === '/calendar') return 'calendar';
        if (pathname === '/settings') return 'settings';
        if (pathname === '/resources') return 'resources';
        return 'dashboard';
    };

    const currentView = getCurrentViewID(location.pathname);

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
                    address: '', phone: '', email: '', website: '', cif: '', legalText: ''
                });
            }
        } catch (err) {
            console.error("Failed to load data:", err);
            alert("Error conectando con el servidor. Usando modo offline/demo temporalmente.");
            setPatients(INITIAL_PATIENTS);
        } finally {
            setIsLoadingData(false);
        }
    };

    useEffect(() => {
        if (user || demoMode) {
            loadData();
        }
    }, [user, demoMode]);

    // ROUTING HANDLER (ADAPTER FOR LEGACY COMPONENTS)
    const handleNavigate = (viewId: string, data?: any) => {
        switch (viewId) {
            case 'dashboard': navigate('/dashboard'); break;
            case 'patients': navigate('/patients'); break;
            case 'patients-adults': navigate('/patients/adults'); break;
            case 'patients-kids': navigate('/patients/kids'); break;
            case 'sessions': navigate('/sessions'); break;
            case 'group-sessions': navigate('/sessions/group'); break;
            case 'calendar': navigate('/calendar'); break;
            case 'settings': navigate('/settings'); break;
            case 'resources': navigate('/resources'); break;
            case 'patient-detail':
                if (data?.id) navigate(`/patients/${data.id}`);
                else if (typeof data === 'string') navigate(`/patients/${data}`); // Handle ID passed directly
                else navigate('/patients');
                break;
            default: navigate('/dashboard');
        }
    };

    // HANDLERS (REAL API WRAPPERS)
    const handleUpdatePatient = async (updatedPatient: Patient) => {
        setPatients(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
        if (!demoMode && updatedPatient.id) {
            try {
                await PatientsService.update(String(updatedPatient.id), updatedPatient);
            } catch (err) {
                console.error("Failed to sync update:", err);
            }
        }
    };

    const handleNewPatient = async (newPatientData: any) => {
        const tempId = Date.now().toString();
        const payload = {
            ...newPatientData,
            sessions: [],
            clinicalFormulation: {},
            reference: `REF-${Math.floor(Math.random() * 10000)}`
        };

        if (demoMode) {
            const newPatient: Patient = { id: tempId, ...payload };
            setPatients(prev => [...prev, newPatient]);
            navigate(`/patients/${tempId}`);
            return;
        }

        try {
            const created = await PatientsService.create(payload);
            setPatients(prev => [...prev, created]);
            navigate(`/patients/${created.id}`);
        } catch (err) {
            console.error("Failed to create:", err);
            alert("Error guardando el paciente.");
        }
    };

    const handleUpdateSettings = async (newSettings: ClinicSettings) => {
        setClinicSettings(newSettings);
        if (!demoMode) {
            try { await SettingsService.save(newSettings); } catch (err) { console.error(err); }
        }
    };

    const handleQuickAppointment = async (data: any) => {
        const [y, m, d] = data.date.split('-');
        const formattedDate = `${d}/${m}/${y}`;
        const newSession = {
            id: Date.now().toString(),
            date: formattedDate,
            time: data.time,
            type: 'individual' as const,
            notes: 'Cita programada desde Calendario',
            price: 50,
            paid: false,
            isAbsent: false
        };

        if (data.mode === 'new') {
            const payload = {
                name: data.name,
                age: 0,
                diagnosis: 'Sin diagnosticar',
                pathologyType: 'other' as const,
                joinedDate: data.date,
                sessions: [newSession],
                clinicalFormulation: {},
                reference: `REF-${Date.now().toString().slice(-4)}`
            };
            if (demoMode) {
                const created = { id: Date.now().toString(), ...payload } as any;
                setPatients(prev => [...prev, created]);
            } else {
                const created = await PatientsService.create(payload);
                setPatients(prev => [...prev, created]);
            }
        } else {
            const patient = patients.find(p => p.id == data.patientId);
            if (patient) {
                const updated = { ...patient, sessions: [newSession, ...(patient.sessions || [])] } as Patient;
                await handleUpdatePatient(updated);
            }
        }
        setShowQuickAppointment(false);
    };

    const handleSaveGroupSession = (data: any) => {
        setGroupSessions(prev => [...prev, data]);
        setShowGroupSession(false);
    };

    const events = React.useMemo(() => {
        const individualEvents = patients.flatMap(p => (p.sessions || []).map(s => ({
            date: s.date,
            type: (s.type || 'individual') as 'individual' | 'group'
        })));
        const groupEventsList = groupSessions.map(s => ({ date: s.date, type: 'group' as const }));
        return [...individualEvents, ...groupEventsList];
    }, [patients, groupSessions]);


    if (authLoading) return <div className="flex h-screen items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-pink-600" size={48} /></div>;

    if (!user && !demoMode) {
        return <><GlobalStyles /><LoginView onDemoLogin={enterDemoMode} /></>;
    }

    if (isLoadingData) return <div className="flex h-screen items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-indigo-600" size={48} /></div>;

    return (
        <ErrorBoundary>
            <GlobalStyles />
            <AppLayout
                userEmail={user?.email || 'demo@activa.com'}
                currentView={currentView}
                onNavigate={(view) => handleNavigate(view)}
                onLogout={() => window.location.reload()}
                events={events}
            >
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<DashboardView patients={patients} onViewChange={handleNavigate} />} />

                        <Route path="/patients" element={
                            <PatientsDirectory
                                patients={patients}
                                onSelectPatient={(p) => navigate(`/patients/${p.id}`)}
                                onNewPatient={handleNewPatient}
                                initialFilter='all'
                            />
                        } />
                        <Route path="/patients/adults" element={
                            <PatientsDirectory
                                patients={patients}
                                onSelectPatient={(p) => navigate(`/patients/${p.id}`)}
                                onNewPatient={handleNewPatient}
                                initialFilter='adults'
                            />
                        } />
                        <Route path="/patients/kids" element={
                            <PatientsDirectory
                                patients={patients}
                                onSelectPatient={(p) => navigate(`/patients/${p.id}`)}
                                onNewPatient={handleNewPatient}
                                initialFilter='kids'
                            />
                        } />
                        <Route path="/patients/:id" element={
                            <PatientDetailWrapper
                                patients={patients}
                                onBack={() => navigate('/patients')}
                                onUpdate={handleUpdatePatient}
                                clinicSettings={clinicSettings}
                            />
                        } />

                        <Route path="/sessions" element={<SessionsManager patients={patients} onUpdatePatient={handleUpdatePatient} filterMode="individual" />} />
                        <Route path="/sessions/group" element={<SessionsManager patients={patients} onUpdatePatient={handleUpdatePatient} filterMode="group" />} />

                        <Route path="/calendar" element={
                            <CalendarView
                                patients={patients}
                                groupSessions={groupSessions}
                                onNavigate={handleNavigate}
                                onOpenGroupModal={() => setShowGroupSession(true)}
                                onOpenSessionModal={() => { }}
                                onOpenQuickAppointment={(mode) => { setQuickAppointmentMode(mode); setShowQuickAppointment(true); }}
                            />
                        } />

                        <Route path="/settings" element={<SettingsView settings={clinicSettings} onSave={handleUpdateSettings} />} />
                        <Route path="/resources" element={<DocumentationCenter />} />
                    </Routes>
                </Suspense>
            </AppLayout>

            {showGroupSession && <GroupSessionModal onClose={() => setShowGroupSession(false)} onSave={handleSaveGroupSession} />}
            {showQuickAppointment && <QuickAppointmentModal onClose={() => setShowQuickAppointment(false)} patients={patients} onSave={handleQuickAppointment} mode={quickAppointmentMode} />}
        </ErrorBoundary>
    );
}

const PatientDetailWrapper = ({ patients, onBack, onUpdate, clinicSettings }: any) => {
    const { id } = useParams();
    const patient = patients.find((p: any) => String(p.id) === id);
    if (!patient) return <div className="text-center p-10">Paciente no encontrado</div>;
    return <PatientDetail patient={patient} onBack={onBack} onUpdate={onUpdate} clinicSettings={clinicSettings} />;
}

export default App;
