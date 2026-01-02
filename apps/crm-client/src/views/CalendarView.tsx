import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays, PlusCircle, Users2, StickyNote, MessageSquare, Clock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { PatientAvatar } from '../components/ui/Avatar';

interface CalendarViewProps {
    patients: any[];
    onNavigate: (view: string, data?: any) => void;
    onOpenGroupModal: () => void;
    onOpenSessionModal: () => void;
    onOpenQuickAppointment: () => void;
    groupSessions: any[];
}

export const CalendarView = ({ patients, onNavigate, onOpenGroupModal, onOpenSessionModal, onOpenQuickAppointment, groupSessions = [] }: CalendarViewProps) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(new Date());
    const [dailyNotes, setDailyNotes] = useState("");

    const individualEvents = patients.flatMap(p =>
        (p.sessions || []).map((s: any, i: number) => {
            const [day, month, year] = s.date.split('/');
            return {
                ...s,
                id: `ind-${p.id}-${i}`,
                patientId: p.id,
                patientName: p.name,
                type: 'individual',
                dateObj: new Date(parseInt(year), parseInt(month) - 1, parseInt(day)),
                isAbsent: s.isAbsent
            };
        })
    );

    const groupEvents = groupSessions.map((s: any, i: number) => {
        const [day, month, year] = s.date.split('/');
        return {
            ...s,
            id: `grp-${i}`,
            patientName: s.location || 'Grupo',
            type: 'group',
            dateObj: new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
        };
    });

    const allEvents = [...individualEvents, ...groupEvents];

    const getDaysInMonth = (date: Date) => { const year = date.getFullYear(); const month = date.getMonth(); const days = new Date(year, month + 1, 0).getDate(); const firstDay = new Date(year, month, 1).getDay(); const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1; return { days, firstDay: adjustedFirstDay }; };
    const { days, firstDay } = getDaysInMonth(currentDate);
    const getEventsForDay = (day: number) => allEvents.filter(e => e.dateObj.getDate() === day && e.dateObj.getMonth() === currentDate.getMonth() && e.dateObj.getFullYear() === currentDate.getFullYear());
    const selectedEvents = allEvents.filter(e => e.dateObj.getDate() === selectedDay.getDate() && e.dateObj.getMonth() === selectedDay.getMonth() && e.dateObj.getFullYear() === selectedDay.getFullYear());

    const sendReminder = (evt: any) => {
        let msg = "";
        if (evt.type === 'group') { msg = `Hola, recordatorio de sesión de Musicoterapia Grupal. Lugar: ${evt.location || 'Centro'}. Fecha: ${evt.date}. ¡Os esperamos!`; }
        else { msg = `Hola ${evt.patientName}, recordatorio de tu sesión individual de Musicoterapia el día ${evt.date}. Un saludo.`; }
        alert(`Abriendo WhatsApp Web...\nDestino: ${evt.type === 'group' ? 'GRUPO DIFUSIÓN' : 'Paciente'}\nMensaje: "${msg}"`);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in">
            <header className="flex justify-between items-center"><div><h1 className="text-2xl font-bold text-slate-900">Agenda Clínica</h1><p className="text-slate-500 text-sm">Gestión de citas y sesiones</p></div><div className="flex gap-2"><Button variant="secondary" icon={ChevronLeft} onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}>Ant</Button><div className="px-4 py-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-700 min-w-[150px] text-center">{currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase()}</div><Button variant="secondary" icon={ChevronRight} onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}>Sig</Button></div></header>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 p-6"><div className="grid grid-cols-7 mb-4">{['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => <div key={d} className="text-center text-xs font-black text-slate-400 uppercase tracking-wider py-2">{d}</div>)}</div><div className="grid grid-cols-7 gap-2">{Array(firstDay).fill(null).map((_, i) => <div key={`empty-${i}`} className="min-h-[100px] bg-slate-50/50 border border-slate-100 rounded-xl" />)}{Array(days).fill(null).map((_, i) => { const day = i + 1; const dayEvents = getEventsForDay(day); const isSelected = selectedDay.getDate() === day && selectedDay.getMonth() === currentDate.getMonth(); const isToday = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth(); return (<div key={day} onClick={() => setSelectedDay(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))} className={`min-h-[100px] border rounded-xl p-2 cursor-pointer transition-all hover:shadow-md flex flex-col justify-between ${isSelected ? 'border-pink-500 bg-pink-50/30 ring-1 ring-pink-500' : 'border-slate-100 bg-white hover:border-slate-300'}`}><div className="flex justify-between items-start"><span className={`text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-slate-900 text-white' : 'text-slate-700'}`}>{day}</span></div><div className="flex flex-col gap-1 mt-1">{dayEvents.slice(0, 3).map((e, idx) => (<div key={idx} className={`text-[9px] px-1.5 py-0.5 rounded truncate font-medium ${e.type === 'group' ? 'bg-indigo-100 text-indigo-700' : (e.isAbsent ? 'bg-red-100 text-red-700' : 'bg-pink-100 text-pink-700')}`}>{e.type === 'group' ? (e.location || 'Grupo') : e.patientName.split(' ')[0]}</div>))}{dayEvents.length > 3 && <div className="text-[9px] text-slate-400 pl-1">+{dayEvents.length - 3} más...</div>}</div></div>); })}</div></Card>
                <div className="space-y-6"><Card className="bg-slate-900 text-white border-none p-6 relative overflow-hidden"><div className="relative z-10"><h3 className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">Agenda del Día</h3><p className="text-3xl font-black">{selectedDay.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric' })}</p><p className="text-lg opacity-80">{selectedDay.toLocaleDateString('es-ES', { month: 'long' })}</p></div><div className="absolute right-0 top-0 p-6 opacity-10"><CalendarDays size={100} /></div></Card><div className="p-4 grid grid-cols-2 gap-3 bg-white rounded-xl shadow-sm"><Button size="sm" icon={PlusCircle} onClick={onOpenQuickAppointment} className="w-full">Cita Individual</Button><Button size="sm" variant="secondary" icon={Users2} onClick={onOpenGroupModal} className="w-full">Cita Grupal</Button></div><div className="px-4 pb-4 bg-white rounded-xl shadow-sm"><label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2 mb-2 pt-4"><StickyNote size={14} /> Notas del Día</label><textarea className="w-full bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-slate-700 h-24 resize-none focus:outline-none focus:ring-1 focus:ring-yellow-400" placeholder="Recordatorios..." value={dailyNotes} onChange={(e) => setDailyNotes(e.target.value)} /></div><div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 bg-white rounded-xl p-4 shadow-sm"><h4 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Eventos Programados</h4>{selectedEvents.length > 0 ? selectedEvents.map(e => (<div key={e.id} className={`p-4 rounded-xl border shadow-sm transition-all group relative ${e.isAbsent ? 'opacity-60 bg-red-50 border-red-100' : (e.type === 'group' ? 'bg-indigo-50 border-indigo-100' : 'bg-white border-slate-200')}`}><div className="flex justify-between items-start mb-2"><Badge variant={e.isAbsent ? 'error' : (e.type === 'group' ? 'group' : 'brand')}>{e.isAbsent ? 'Ausencia' : (e.type === 'group' ? 'Grupal' : 'Individual')}</Badge><div className="flex gap-1"><button onClick={() => sendReminder(e)} className="p-1.5 rounded-full bg-white text-emerald-500 hover:bg-emerald-50 shadow-sm" title="Enviar Recordatorio WhatsApp"><MessageSquare size={14} /></button></div></div><div className="flex items-center gap-3 mb-3">{e.type === 'group' ? <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold"><Users2 size={18} /></div> : <PatientAvatar name={e.patientName} size="sm" />}<div><p className="font-bold text-sm text-slate-900">{e.type === 'group' ? (e.location || 'Sesión Grupal') : e.patientName}</p><p className="text-xs text-slate-500">{e.type === 'group' ? 'Dinámica Conjunta' : 'Sesión Clínica'}</p></div></div>{e.type === 'individual' && <Button size="sm" variant="secondary" className="w-full" onClick={() => onNavigate('detail', patients.find(p => p.id === e.patientId))}>Ir a Ficha</Button>}</div>)) : (<div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl"><Clock size={24} className="mx-auto mb-2 opacity-50" /><p className="text-xs font-medium">Sin citas hoy</p></div>)}</div></div>
            </div>
        </div>
    );
};
