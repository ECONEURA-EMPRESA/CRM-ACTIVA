import React from 'react';
import { PlusCircle, Users2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PatientAvatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { SESSION_ACTIVITIES } from '../lib/constants';

interface SessionsManagerProps {
    patients: any[];
    groupSessions?: any[];
    filter: string;
    onOpenGroupModal: () => void;
    onNewPatient: () => void;
    onNavigate: (view: string, data?: any) => void;
}

export const SessionsManager = ({ patients, groupSessions = [], filter, onOpenGroupModal, onNewPatient, onNavigate }: SessionsManagerProps) => {
    // Si el filtro es INDIVIDUAL, mostramos la LISTA DE PACIENTES para gestionar
    if (filter === 'individual') {
        return (
            <div className="space-y-6 animate-in fade-in max-w-7xl mx-auto">
                <header className="flex justify-between items-center">
                    <div><h1 className="text-2xl font-bold text-slate-900">Gestión Individual</h1><p className="text-slate-500 text-sm">Seleccione un paciente para ver su historial o iniciar sesión</p></div>
                    <Button icon={PlusCircle} onClick={onNewPatient} className="bg-indigo-600 hover:bg-indigo-700">Nuevo Paciente</Button>
                </header>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs">
                            <tr><th className="p-4">Paciente</th><th className="p-4">Edad</th><th className="p-4">Diagnóstico</th><th className="p-4">Progreso</th><th className="p-4">Acción</th></tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {patients.map(p => {
                                const sessionCount = p.sessions ? p.sessions.filter((s: any) => !s.isAbsent).length : 0;
                                return (
                                    <tr key={p.id} className="hover:bg-slate-50 cursor-pointer group" onClick={() => onNavigate('detail', p)}>
                                        <td className="p-4 font-bold text-slate-800 flex items-center gap-3"><PatientAvatar photo={p.photo} name={p.name} size="sm" />{p.name}</td>
                                        <td className="p-4">{p.age} años</td>
                                        <td className="p-4">{p.diagnosis}</td>
                                        <td className="p-4"><Badge variant="brand">{sessionCount} Sesiones</Badge></td>
                                        <td className="p-4"><Button size="sm" variant="secondary" className="group-hover:bg-pink-50 group-hover:text-pink-600 group-hover:border-pink-200">Gestionar</Button></td>
                                    </tr>
                                );
                            })}
                            {patients.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-slate-400">No hay pacientes registrados aún.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    // Combine sessions
    const individualSessions = patients.flatMap(p => (p.sessions || []).map((s: any) => ({ ...s, patientName: p.name, patientId: p.id })));

    const formattedGroupSessions = groupSessions.map(s => ({
        ...s,
        patientName: s.location || 'Grupo', // Use location as name for display
        patientId: null
    }));

    const allSessions = [...individualSessions, ...formattedGroupSessions].sort((a, b) => {
        const [d1, m1, y1] = a.date.split('/');
        const [d2, m2, y2] = b.date.split('/');
        return new Date(parseInt(y2), parseInt(m2) - 1, parseInt(d2)).getTime() - new Date(parseInt(y1), parseInt(m1) - 1, parseInt(d1)).getTime(); // Descending order
    });

    const filtered = filter === 'all' ? allSessions : allSessions.filter(s => s.type === filter);

    return (
        <div className="space-y-6 animate-in fade-in max-w-7xl mx-auto">
            <header className="flex justify-between items-center"><div><h1 className="text-2xl font-bold text-slate-900">Historial de Sesiones {filter === 'group' ? 'Grupales' : ''}</h1><p className="text-slate-500 text-sm">Registro de actividad</p></div>{filter === 'group' && <Button icon={Users2} onClick={onOpenGroupModal} className="bg-indigo-600 hover:bg-indigo-700">Nueva Sesión Grupal</Button>}</header>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"><table className="w-full text-sm text-left"><thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs"><tr><th className="p-4">Fecha</th><th className="p-4">Paciente / Grupo</th><th className="p-4">Tipo</th><th className="p-4">Actividad</th><th className="p-4">Notas</th></tr></thead><tbody className="divide-y divide-slate-100">{filtered.map((s, i) => (<tr key={i} className="hover:bg-slate-50"><td className="p-4 font-mono text-slate-500">{s.date}</td><td className="p-4 font-bold text-slate-800">{s.patientName}</td><td className="p-4">{s.isAbsent ? <Badge variant="error">Ausencia</Badge> : <Badge variant={s.type === 'group' ? 'group' : 'neutral'}>{s.type === 'group' ? 'Grupal' : 'Individual'}</Badge>}</td><td className="p-4">{s.activityDetails ? Object.keys(s.activityDetails).map(k => SESSION_ACTIVITIES.find(a => a.id === k)?.label).join(", ") : s.activities?.join(", ")}</td><td className="p-4 text-slate-500 truncate max-w-xs">{s.notes}</td></tr>))}</tbody></table></div>
        </div>
    );
};
