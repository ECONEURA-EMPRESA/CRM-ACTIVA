
import React, { useState } from 'react';
import {
    Activity, Brain, BarChart3, ClipboardCheck, DollarSign,
    ArrowLeft, Lightbulb, FileText, Trash2, Edit, PlusCircle, PenTool, CheckSquare
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { PatientAvatar } from '../../components/ui/PatientAvatar';
import { Toast } from '../../components/ui/Toast';
import { InvoiceGenerator } from '../../components/ui/InvoiceGenerator';

// Modals
import { AdmissionModal } from './modals/AdmissionModal';
import { CognitiveModal } from './modals/CognitiveModal';
import { SessionModal } from './modals/SessionModal';
import { ClinicalGuideModal } from './modals/ClinicalGuideModal';

import {
    TREATMENT_PHASES,
    EVALUATION_AREAS
} from '../../lib/clinicalUtils';
import { FORMULATION_OPTIONS } from '../../lib/patientUtils';
import { Patient, Session, FormulationData, ClinicalFormulation } from '../../lib/types';
import { CognitiveRadar } from '../../components/charts/CognitiveRadar';
import { useAuth } from '../../context/AuthContext';

interface PatientDetailProps {
    patient: Patient;
    onBack: () => void;
    onUpdate: (updated: Patient) => void;
    clinicSettings?: any;
}

export const PatientDetail: React.FC<PatientDetailProps> = ({
    patient, onBack, onUpdate, clinicSettings
}) => {
    const { canDelete, canViewFinancials } = useAuth();
    const [notification, setNotification] = useState<{ msg: string, type: 'success' | 'error' } | null>(null);
    const showToast = (msg: string, type: 'success' | 'error' = 'success') => { setNotification({ msg, type }); setTimeout(() => setNotification(null), 3000); };

    // Modal State
    const [showSessionModal, setShowSessionModal] = useState(false);
    const [selectedSession, setSelectedSession] = useState<Session | undefined>(undefined);
    const [showCognitiveModal, setShowCognitiveModal] = useState(false);
    const [showGuideModal, setShowGuideModal] = useState(false);
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [showInvoice, setShowInvoice] = useState(false);
    const [invoiceData, setInvoiceData] = useState<any>(null);

    const tabs = [
        { id: 'status', label: 'Plan Terapéutico', icon: Activity },
        { id: 'formulation', label: 'Formulación Clínica', icon: Brain },
        { id: 'evaluation', label: 'Evaluación (0-3)', icon: BarChart3 },
        { id: 'sessions', label: 'Bitácora', icon: ClipboardCheck },
        ...(canViewFinancials ? [{ id: 'billing', label: 'Facturación', icon: DollarSign }] : [])
    ];

    const validSessions = patient.sessions ? patient.sessions.filter(s => !s.isAbsent) : [];
    const currentPhase = TREATMENT_PHASES.find(p => {
        const parts = p.range.split('-');
        const min = parseInt(parts[0]);
        const max = parseInt(parts[1]);
        return validSessions.length >= min && validSessions.length <= max;
    }) || TREATMENT_PHASES[0];

    const [activeTab, setActiveTab] = useState('status');

    const handleDeleteSession = (sessionId: string | number) => {
        if (window.confirm("¿Seguro que quieres eliminar esta sesión? Esta acción no se puede deshacer.")) {
            const updatedSessions = (patient.sessions || []).filter(s => s.id !== sessionId);
            onUpdate({ ...patient, sessions: updatedSessions });
            showToast('Sesión eliminada del historial', 'success');
        }
    };

    const handleSaveSession = (sessionData: Session) => {
        const isNew = !selectedSession;
        let newSessions = [...(patient.sessions || [])];

        if (isNew) {
            newSessions = [sessionData, ...newSessions];
        } else {
            newSessions = newSessions.map(s => s.id === sessionData.id ? sessionData : s);
        }

        onUpdate({ ...patient, sessions: newSessions });
        setShowSessionModal(false);
        showToast('Sesión guardada correctamente', 'success');
    };

    const activeSessions = (patient.sessions || []);

    const FormulationSection = ({ title, optionsKey, fieldKey }: { title: string, optionsKey: keyof typeof FORMULATION_OPTIONS, fieldKey: keyof ClinicalFormulation }) => {
        const rawValue = patient.clinicalFormulation?.[fieldKey];

        const isFormulationData = (val: any): val is FormulationData => {
            return typeof val === 'object' && val !== null && 'selected' in val;
        };

        const data: FormulationData = isFormulationData(rawValue)
            ? rawValue
            : { selected: [], text: typeof rawValue === 'string' ? rawValue : '' };

        const handleCheck = (option: string) => {
            const newSelected = data.selected.includes(option)
                ? data.selected.filter(s => s !== option)
                : [...data.selected, option];

            onUpdate({
                ...patient,
                clinicalFormulation: {
                    ...patient.clinicalFormulation,
                    [fieldKey]: { ...data, selected: newSelected }
                }
            });
        };

        const handleText = (text: string) => {
            onUpdate({
                ...patient,
                clinicalFormulation: {
                    ...patient.clinicalFormulation,
                    [fieldKey]: { ...data, text }
                }
            });
        };

        return (
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                <h4 className="font-bold text-slate-700 text-sm uppercase tracking-wide mb-3 flex items-center gap-2">
                    <CheckSquare size={16} className="text-pink-600" /> {title}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                    {(FORMULATION_OPTIONS[optionsKey] || []).map((opt: string) => (
                        <label key={opt} className="flex items-start gap-2 text-sm text-slate-600 cursor-pointer hover:bg-slate-50 p-1.5 rounded transition-colors border border-transparent hover:border-slate-100">
                            <input
                                type="checkbox"
                                className="mt-0.5 accent-pink-600 w-4 h-4"
                                checked={data.selected.includes(opt)}
                                onChange={() => handleCheck(opt)}
                            />
                            <span className="leading-snug select-none">{opt}</span>
                        </label>
                    ))}
                </div>
                <textarea
                    className="input-pro text-sm h-24 resize-none bg-slate-50 border-slate-200 focus:bg-white"
                    placeholder="Otros detalles / Observaciones específicas..."
                    value={data.text}
                    onChange={(e) => handleText(e.target.value)}
                />
            </div>
        );
    };

    const handlePrintGlobalInvoice = () => {
        const pendingSessions = activeSessions.filter(s => !s.paid);
        if (pendingSessions.length === 0) return alert("No hay sesiones pendientes de pago para facturar.");

        const defaultNum = `FACT-${Date.now().toString().slice(-6)}`;
        setInvoiceData({
            clientName: patient.name,
            clientMeta: `Paciente Ref: ${patient.reference || '-'}`,
            sessions: pendingSessions,
            invoiceNumber: defaultNum
        });
        setShowInvoice(true);
    };

    return (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 max-w-7xl mx-auto">
            {notification && <Toast message={notification.msg} type={notification.type} onClose={() => setNotification(null)} />}

            {/* --- MODALS --- */}
            {showSessionModal && (
                <SessionModal
                    onClose={() => setShowSessionModal(false)}
                    onSave={handleSaveSession}
                    initialData={selectedSession}
                    patientType={patient.pathologyType}
                />
            )}
            {showCognitiveModal && (
                <CognitiveModal
                    onClose={() => setShowCognitiveModal(false)}
                    onSave={(data) => {
                        onUpdate({
                            ...patient,
                            cognitiveScores: { ...patient.cognitiveScores, ...data },
                            currentEval: data.functionalScores
                        });
                        setShowCognitiveModal(false);
                        showToast('Evaluación actualizada', 'success');
                    }}
                    initialData={patient.cognitiveScores}
                    initialScores={patient.currentEval}
                />
            )}
            {showGuideModal && <ClinicalGuideModal onClose={() => setShowGuideModal(false)} />}
            {showEditProfile && (
                <AdmissionModal
                    onClose={() => setShowEditProfile(false)}
                    onSave={(data) => {
                        onUpdate({ ...patient, ...data });
                        setShowEditProfile(false);
                        showToast('Perfil actualizado', 'success');
                    }}
                    initialData={patient}
                />
            )}
            {showInvoice && invoiceData && (
                <InvoiceGenerator
                    data={invoiceData}
                    onClose={() => setShowInvoice(false)}
                    clinicSettings={clinicSettings || {}}
                />
            )}

            <div className="flex items-center justify-between">
                <button className="flex items-center gap-2 text-slate-500 font-bold text-sm hover:text-slate-800 transition-colors" onClick={onBack}><ArrowLeft size={18} /> Volver al Directorio</button>
                <div className="flex gap-2">
                    <Button variant="secondary" size="sm" icon={Lightbulb} onClick={() => setShowGuideModal(true)}>Guía Clínica</Button>
                    {canDelete && (
                        <Button variant="danger" size="sm" icon={Trash2} onClick={() => { if (confirm("¿ELIMINAR PACIENTE? Esta acción es destructiva y solo para administradores.")) alert("Simulado: Paciente eliminado"); }}>{null}</Button>
                    )}
                </div>
            </div>
            <Card noPadding className="overflow-hidden">
                <div className="h-24 bg-gradient-to-r from-slate-800 to-slate-900"></div>
                <div className="px-8 pb-8">
                    <div className="flex flex-col md:flex-row gap-6 items-end -mt-10">
                        <div className="relative">
                            <div className="p-1.5 bg-white rounded-full">
                                <PatientAvatar photo={patient.photo} name={patient.name} size="xl" />
                            </div>
                        </div>
                        <div className="flex-1 pb-2">
                            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                                {patient.name}
                                <button onClick={() => setShowEditProfile(true)} className="text-slate-400 hover:text-pink-600 transition-colors"><Edit size={20} /></button>
                            </h1>
                            <p className="text-slate-500 font-medium">{patient.diagnosis}</p>
                        </div>
                        <div className="flex gap-4 pb-4">
                            <div className="text-right"><p className="text-xs font-bold text-slate-400 uppercase">Edad</p><p className="text-sm font-bold text-slate-700">{patient.age} años</p></div>
                            <div className="text-right"><p className="text-xs font-bold text-slate-400 uppercase">Ingreso</p><p className="text-sm font-bold text-slate-700">{patient.joinedDate}</p></div>
                        </div>
                    </div>
                </div>
            </Card>
            <div className="border-b border-slate-200 sticky top-0 bg-[#F8FAFC] z-10 pt-4">
                <div className="flex gap-8 overflow-x-auto no-scrollbar">
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`pb-4 flex items-center gap-2 text-sm font-bold transition-all relative ${activeTab === tab.id ? 'text-pink-600' : 'text-slate-500 hover:text-slate-800'}`}>
                            <tab.icon size={18} /> {tab.label}
                            {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600 rounded-t-full" />}
                        </button>
                    ))}
                </div>
            </div>

            <div className="min-h-[400px]">
                {activeTab === 'status' && (
                    <div className="animate-in fade-in space-y-6">
                        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex items-center gap-8 relative overflow-hidden">
                            <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${TREATMENT_PHASES[1].color} opacity-10 rounded-full blur-3xl -mr-16 -mt-16`}></div>
                            <div className="relative z-10 flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <Badge variant="brand">Fase {currentPhase.id} de 5</Badge>
                                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Plan de 20 Sesiones</span>
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-1">{currentPhase.name}</h2>
                                <p className="text-slate-500">Objetivo: {currentPhase.focus}</p>
                            </div>
                            <div className="relative z-10 text-right">
                                <div className="text-4xl font-black text-slate-900">{validSessions.length}</div>
                                <div className="text-xs font-bold text-slate-400 uppercase">Sesiones</div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'formulation' && (
                    <div className="animate-in fade-in space-y-6">
                        <div className="bg-amber-50 p-6 rounded-xl border border-amber-100 mb-6">
                            <h3 className="font-bold text-amber-800 flex items-center gap-2 mb-4"><Brain size={20} /> 4. Formulación del Caso</h3>
                            <div className="grid grid-cols-1 gap-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <FormulationSection title="4.1 Síntesis Diagnóstica" optionsKey="synthesis" fieldKey="synthesis" />
                                    <FormulationSection title="4.6 Hipótesis Terapéutica" optionsKey="hypothesis" fieldKey="hypothesis" />
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <FormulationSection title="4.2 Capacidades Preservadas" optionsKey="preserved" fieldKey="preserved" />
                                    <FormulationSection title="4.3 Dificultades Principales" optionsKey="difficulties" fieldKey="difficulties" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'evaluation' && (
                    <Card className="animate-in fade-in p-8">
                        <div className="flex justify-between items-center mb-8"><h3 className="font-bold text-slate-800 text-lg">Evolución Clínica</h3><div className="flex gap-4 text-xs font-medium text-slate-500"><span className="flex items-center gap-1"><div className="w-2 h-2 bg-slate-300 rounded-full" /> Línea Base</span><span className="flex items-center gap-1"><div className="w-2 h-2 bg-pink-500 rounded-full" /> Actual</span></div></div>

                        <div className="mb-8 p-4 bg-slate-50 rounded-xl border border-slate-200 flex gap-8">
                            <div><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">MOCA (Cognitivo)</span><span className="text-lg font-bold text-slate-800">{patient.cognitiveScores?.moca || "-"}</span></div>
                            <div><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">MMSE (Mini-Mental)</span><span className="text-lg font-bold text-slate-800">{patient.cognitiveScores?.mmse || "-"}</span></div>
                            <div><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">GDS (Reisberg)</span><span className="text-lg font-bold text-slate-800">{patient.cognitiveScores?.gds || "-"}</span></div>
                            <div><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Fecha Evaluación</span><span className="text-sm font-medium text-slate-600">{patient.cognitiveScores?.date || "-"}</span></div>
                            <Button size="sm" variant="secondary" className="ml-auto h-fit my-auto" onClick={() => setShowCognitiveModal(true)} icon={PenTool}>Actualizar Evaluación</Button>
                        </div>

                        <div className="flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-100 rounded-3xl mt-6">
                            <CognitiveRadar
                                labels={EVALUATION_AREAS}
                                dataInitial={patient.initialEval || Array(9).fill(0)}
                                dataCurrent={patient.currentEval || Array(9).fill(0)}
                            />
                        </div>
                    </Card>
                )}

                {activeTab === 'sessions' && (
                    <div className="space-y-6 animate-in fade-in">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-slate-800">Historial de Sesiones</h3>
                            <Button icon={PlusCircle} onClick={() => { setSelectedSession(undefined); setShowSessionModal(true); }}>Nueva Sesión</Button>
                        </div>
                        {activeSessions.map(s => (
                            <div key={s.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex gap-4">
                                <div className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-lg h-fit min-w-[80px]">
                                    <span className="text-xs font-bold text-slate-400 uppercase">
                                        {new Date(s.date.split('/').reverse().join('-')).toLocaleDateString('es-ES', { month: 'short' })}
                                    </span>
                                    <span className="text-xl font-black text-slate-800">
                                        {new Date(s.date.split('/').reverse().join('-')).getDate()}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-slate-800">Sesión Clínica</h4>
                                            {s.isAbsent ? <Badge variant="error">Ausencia</Badge> : <Badge variant="neutral">Fase {s.phase}</Badge>}
                                        </div>
                                        <div className="flex gap-1">
                                            <Button size="sm" variant="ghost" icon={Edit} onClick={() => { setSelectedSession(s); setShowSessionModal(true); }}>{null}</Button>
                                            <Button size="sm" variant="ghost" className="text-red-400 hover:bg-red-50 hover:text-red-600" icon={Trash2} onClick={() => handleDeleteSession(s.id)}>{null}</Button>
                                        </div>
                                    </div>
                                    <p className="text-slate-600 text-sm leading-relaxed mb-3">{s.notes}</p>
                                    <div className="mt-3 flex gap-2">{s.activityDetails && Object.keys(s.activityDetails).length > 0 ? Object.keys(s.activityDetails).map(k => <Badge key={k} variant="brand">{k}</Badge>) : null}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'billing' && (
                    <div className="animate-in fade-in">
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                                <h3 className="font-bold text-slate-700">Control de Pagos</h3>
                                <div className="flex gap-3">
                                    <div className="text-right">
                                        <p className="text-[10px] uppercase font-bold text-slate-400">Deuda Total</p>
                                        <p className="text-xl font-black text-red-600">
                                            {activeSessions.reduce((acc, s) => acc + (s.paid ? 0 : (s.price || 0)), 0)} €
                                        </p>
                                    </div>
                                    <Button variant="primary" size="md" onClick={handlePrintGlobalInvoice} icon={FileText}>Generar Factura Global</Button>
                                </div>
                            </div>
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-500 uppercase bg-slate-50/50">
                                    <tr>
                                        <th className="px-6 py-3">Fecha</th>
                                        <th className="px-6 py-3">Concepto</th>
                                        <th className="px-6 py-3">Importe</th>
                                        <th className="px-6 py-3 text-right">Estado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {activeSessions.map(s => (
                                        <tr key={s.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 font-mono text-slate-500">{s.date}</td>
                                            <td className="px-6 py-4 font-medium text-slate-900">
                                                Sesión {s.type === 'group' ? 'Grupal' : 'Individual'}
                                                {s.isAbsent && <span className="text-red-500 ml-2 text-xs font-bold">(Ausencia)</span>}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-slate-700">{s.price}€</td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => {
                                                        const updated = patient.sessions?.map(sess => sess.id === s.id ? { ...sess, paid: !sess.paid } : sess);
                                                        if (updated) onUpdate({ ...patient, sessions: updated });
                                                    }}
                                                    className={`px-3 py-1 rounded-full text-xs font-bold ${s.paid ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                                                >
                                                    {s.paid ? 'PAGADO' : 'PENDIENTE'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
