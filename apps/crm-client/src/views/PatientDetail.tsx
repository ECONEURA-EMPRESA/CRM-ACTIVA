import React from 'react';
import {
    ArrowLeft, Clock, FileText, Activity, Brain, Edit, PlayCircle, Lock,
    Trash2, PlusCircle, Printer, MessageSquare, Save
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { PatientAvatar } from '../components/ui/Avatar';
import { generateInvoiceHTML, printInvoice } from '../lib/utils';
import { SESSION_ACTIVITIES } from '../lib/constants';

interface PatientDetailProps {
    patient: any;
    onBack: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onNewSession: () => void;
    onOpenCognitive: (data?: any, index?: number) => void;
    onOpenDocs: () => void;
    onEditSession: (session: any, index: number) => void;
}

export const PatientDetail = ({ patient, onBack, onEdit, onDelete, onNewSession, onOpenCognitive, onOpenDocs, onEditSession }: PatientDetailProps) => {

    const handlePrintInvoice = (session: any) => {
        const storedSettings = localStorage.getItem('clinicSettings');
        const clinicData = storedSettings ? JSON.parse(storedSettings) : { name: 'Centro de Musicoterapia' };
        printInvoice(clinicData, patient, [session], `FAC-${Date.now().toString().slice(-6)}`);
    };

    return (
        <div className="space-y-6 animate-in slide-in-from-right-8 max-w-7xl mx-auto">
            <header className="flex items-center justify-between">
                <Button variant="ghost" onClick={onBack} icon={ArrowLeft}>Volver</Button>
                <div className="flex gap-3">
                    <Button variant="danger" size="sm" icon={Trash2} onClick={() => { if (window.confirm('¿ELIMINAR PACIENTE? Esta acción es irreversible.')) onDelete(); }}>Eliminar</Button>
                    <Button variant="secondary" size="sm" icon={Edit} onClick={onEdit}>Editar Perfil</Button>
                    <Button icon={PlusCircle} onClick={onNewSession} className="shadow-lg hover:shadow-xl">Nueva Sesión</Button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* COLUMNA IZQUIERDA: DATOS CLÍNICOS E ISO */}
                <div className="space-y-6">
                    <Card className="p-8 text-center relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-pink-500 to-rose-600"></div>
                        <div className="relative mt-4">
                            <div className="mx-auto w-fit mb-4"><PatientAvatar photo={patient.photo} name={patient.name} size="xl" /></div>
                            <h2 className="text-2xl font-black text-slate-800">{patient.name}</h2>
                            <p className="text-slate-500 font-medium mb-4">{patient.diagnosis}</p>
                            <div className="flex justify-center gap-2 flex-wrap">
                                <Badge variant="neutral">{patient.age} años</Badge>
                                <Badge variant="brand">Ref: {patient.reference}</Badge>
                                <Badge variant={patient.hasConsent ? 'success' : 'warning'}>{patient.hasConsent ? 'Consentimiento OK' : 'Sin Consentimiento'}</Badge>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Clock size={18} className="text-pink-500" /> Histórico</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                                <span className="text-xs font-bold text-slate-500 uppercase">Fecha Ingreso</span>
                                <span className="text-sm font-bold text-slate-800">{patient.joinedDate}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                                <span className="text-xs font-bold text-slate-500 uppercase">Sesiones Totales</span>
                                <span className="text-sm font-bold text-slate-800">{patient.sessions?.length || 0}</span>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 bg-pink-50 border-pink-100">
                        <h3 className="font-bold text-pink-800 mb-4 flex items-center gap-2"><PlayCircle size={18} /> Identidad Sonora (ISO)</h3>
                        <div className="space-y-4">
                            <div><span className="text-[10px] uppercase font-black text-pink-400 block mb-1">Gustos Musicales</span><p className="text-sm text-pink-900 font-medium">{patient.musicStyles || 'No registrado'}</p></div>
                            <div><span className="text-[10px] uppercase font-black text-pink-400 block mb-1">Aversiones (Alerta)</span><p className="text-sm text-pink-900 font-medium">{patient.dislikedSounds || 'No registrado'}</p></div>
                            <div><span className="text-[10px] uppercase font-black text-pink-400 block mb-1">Canciones Biográficas</span><p className="text-sm text-pink-900 font-medium italic">"{patient.isoSongs || 'No registrado'}"</p></div>
                        </div>
                    </Card>
                    <Button variant="secondary" className="w-full" icon={FileText} onClick={onOpenDocs}>Centro de Documentación</Button>
                </div>

                {/* COLUMNA DERECHA: SESIONES Y EVOLUCIÓN */}
                <div className="lg:col-span-2 space-y-8">
                    {/* GRÁFICA EVOLUTIVA SIMULADA */}
                    <Card className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2"><Activity className="text-emerald-500" /> Evolución Clínica</h3>
                            <Button size="sm" variant="secondary" icon={Brain} onClick={() => onOpenCognitive()}>Nueva Evaluación</Button>
                        </div>
                        {/* LISTADO DE EVALUACIONES COGNITIVAS */}
                        <div className="space-y-3">
                            {patient.cognitiveEvaluations && patient.cognitiveEvaluations.length > 0 ? patient.cognitiveEvaluations.map((ev: any, i: number) => (
                                <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors cursor-pointer" onClick={() => onOpenCognitive(ev, i)}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white text-emerald-600 font-bold flex items-center justify-center shadow-sm border border-emerald-100">{ev.moca || '-'}</div>
                                        <div><p className="font-bold text-slate-700 text-sm">Evaluación {ev.date}</p><p className="text-xs text-slate-400">GDS: {ev.gds} • MMSE: {ev.mmse}</p></div>
                                    </div>
                                    <Badge variant="success">Ver Detalles</Badge>
                                </div>
                            )) : <div className="text-center py-8 text-slate-400 text-sm">No hay evaluaciones registradas.</div>}
                        </div>
                    </Card>

                    {/* LISTADO DE SESIONES */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2 px-1"><FileText className="text-indigo-500" /> Historial de Sesiones</h3>
                        {patient.sessions && patient.sessions.length > 0 ? [...patient.sessions].reverse().map((session: any, i: number) => {
                            // Calcular índice original (porque estamos invirtiendo el array para mostrar el más reciente primero)
                            const originalIndex = patient.sessions.length - 1 - i;
                            return (
                                <Card key={i} className={`p-0 overflow-hidden transition-all hover:shadow-md ${session.isAbsent ? 'opacity-70 grayscale-[0.5]' : ''}`}>
                                    <div className={`p-4 border-b flex justify-between items-center ${session.isAbsent ? 'bg-red-50 border-red-100' : 'bg-white border-slate-100'}`}>
                                        <div className="flex items-center gap-4">
                                            <div className={`px-3 py-1 rounded-lg font-bold text-xs ${session.isAbsent ? 'bg-red-200 text-red-800' : 'bg-slate-100 text-slate-600'}`}>{session.date}</div>
                                            <Badge variant={session.isAbsent ? "error" : "brand"}>{session.isAbsent ? 'AUSENCIA' : `Fase ${session.phase || 2}`}</Badge>
                                            {session.updatedAt && <span className="text-[10px] text-slate-300 font-mono">Editado: {new Date(session.updatedAt).toLocaleDateString()}</span>}
                                        </div>
                                        <div className="flex gap-2">
                                            {!session.isAbsent && <Button size="sm" variant="secondary" icon={Printer} onClick={() => handlePrintInvoice(session)}>Factura</Button>}
                                            <Button size="sm" variant="secondary" icon={Edit} onClick={() => onEditSession(session, originalIndex)}>Editar</Button>
                                        </div>
                                    </div>
                                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <div><label className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1 block">Actividades Realizadas</label>
                                                <div className="flex flex-wrap gap-2">{session.activityDetails ? Object.keys(session.activityDetails).map(k => <span key={k} className="px-2 py-1 bg-pink-50 text-pink-700 rounded text-xs font-bold border border-pink-100">{SESSION_ACTIVITIES.find(a => a.id === k)?.label}</span>) : session.activities?.join(", ")}</div>
                                            </div>
                                            <div><label className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1 block">Notas Clínicas</label><p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200/50">{session.notes}</p></div>
                                        </div>
                                        {!session.isAbsent && (
                                            <div className="bg-slate-50 p-4 rounded-xl space-y-3">
                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1 block">Resumen Cualitativo</label>
                                                {['musical', 'emotional', 'cognitive'].map(area => (
                                                    <div key={area} className="flex gap-2 text-xs">
                                                        <span className="font-bold text-slate-500 capitalize w-20 shrink-0">{area}:</span>
                                                        <span className="text-slate-700 truncate">{session.qualitative?.[area] || '-'}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            )
                        }) : <div className="p-12 text-center text-slate-400 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">Sin sesiones registradas todavía.</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};
