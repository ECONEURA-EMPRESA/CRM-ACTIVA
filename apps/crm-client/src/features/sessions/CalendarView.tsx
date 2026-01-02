
import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react';
import { Patient } from '../../lib/types';

interface CalendarViewProps {
    patients: Patient[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ patients }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Extract events from patients sessions
    const events = patients.flatMap(p => (p.sessions || []).map(s => {
        const [d, m, y] = s.date.split('/');
        return {
            ...s,
            dateObj: new Date(parseInt(y), parseInt(m) - 1, parseInt(d)),
            patientName: p.name,
            color: s.type === 'group' ? 'bg-indigo-100 border-indigo-200 text-indigo-700' : 'bg-pink-50 border-pink-100 text-pink-700'
        };
    }));

    const eventsForDay = events.filter(e =>
        e.dateObj.getDate() === selectedDate.getDate() &&
        e.dateObj.getMonth() === selectedDate.getMonth() &&
        e.dateObj.getFullYear() === selectedDate.getFullYear()
    ).sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

    const changeDate = (days: number) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + days);
        setSelectedDate(newDate);
    };

    return (
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 animate-in fade-in">
            {/* Agenda List */}
            <div className="flex-1 space-y-6">
                <header className="flex items-center justify-between bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 capitalize">
                            {selectedDate.toLocaleDateString('es-ES', { weekday: 'long' })}
                        </h2>
                        <p className="text-slate-500 font-medium">
                            {selectedDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => changeDate(-1)} className="p-3 hover:bg-slate-50 rounded-xl transition-colors border border-slate-200"><ChevronLeft size={20} /></button>
                        <button onClick={() => setSelectedDate(new Date())} className="px-4 font-bold text-sm hover:bg-slate-50 rounded-xl transition-colors border border-slate-200">Hoy</button>
                        <button onClick={() => changeDate(1)} className="p-3 hover:bg-slate-50 rounded-xl transition-colors border border-slate-200"><ChevronRight size={20} /></button>
                    </div>
                </header>

                <div className="space-y-4">
                    {eventsForDay.map((evt, i) => (
                        <Card key={i} className={`p-6 border-l-4 ${evt.type === 'group' ? 'border-indigo-500' : 'border-pink-500'} flex gap-6 items-center`}>
                            <div className="text-center w-16 shrink-0">
                                <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Hora</div>
                                <div className="bg-slate-100 rounded-lg py-2 font-mono font-bold text-slate-700">10:00</div>
                            </div>
                            <div className="flex-1 border-l border-slate-100 pl-6">
                                <h3 className="font-bold text-lg text-slate-900 mb-1">{evt.type === 'group' ? 'Sesión Grupal' : evt.patientName}</h3>
                                <div className="flex items-center gap-4 text-sm text-slate-500">
                                    <span className={`px-2 py-0.5 rounded textxs font-bold uppercase ${evt.color}`}>
                                        {evt.type === 'group' ? 'Taller' : 'Individual'}
                                    </span>
                                    {evt.location && <span className="flex items-center gap-1"><MapPin size={14} /> {evt.location}</span>}
                                </div>
                            </div>
                        </Card>
                    ))}
                    {eventsForDay.length === 0 && (
                        <div className="py-20 text-center text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">
                            <Clock size={48} className="mx-auto mb-4 opacity-50" />
                            <p className="font-medium">No hay citas programadas para este día</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Mini Calendar Side */}
            <div className="w-full lg:w-80 shrink-0">
                <Card className="p-6">
                    <h3 className="font-bold text-slate-800 mb-4">Notas del Día</h3>
                    <textarea className="input-pro min-h-[150px]" placeholder="Recordatorios..." />
                </Card>
            </div>
        </div>
    );
};
