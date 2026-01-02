
import React, { useState } from 'react';
import {
    LayoutDashboard, Users, User, Smile, Baby,
    Users2, FileText, Settings, Music, X, ChevronLeft, ChevronRight
} from 'lucide-react';

interface SidebarProps {
    view: string;
    setView: (view: string) => void;
    filter: string;
    setFilter: (filter: string) => void;
    // events prop needed for the calendar widget indicators
    events: Array<{ dateObj: Date }>;
    isOpen: boolean;
    toggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ view, setView, filter, setFilter, events = [], isOpen, toggle }) => {
    const [calendarDate, setCalendarDate] = useState(new Date());

    // WIDGET CALENDARIO LATERAL (INTERNO)
    const SidebarCalendar = () => {
        const getDaysInMonth = (date: Date) => {
            const year = date.getFullYear();
            const month = date.getMonth();
            const days = new Date(year, month + 1, 0).getDate();
            const firstDay = new Date(year, month, 1).getDay();
            const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
            return { days, firstDay: adjustedFirstDay };
        };

        const { days, firstDay } = getDaysInMonth(calendarDate);
        const today = new Date();

        const hasEvent = (day: number) => {
            return events.some(e =>
                e.dateObj && // Ensure object exists
                e.dateObj.getDate() === day &&
                e.dateObj.getMonth() === calendarDate.getMonth() &&
                e.dateObj.getFullYear() === calendarDate.getFullYear()
            );
        };

        return (
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm mt-6 mx-2">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={() => setCalendarDate(new Date(calendarDate.setMonth(calendarDate.getMonth() - 1)))} className="p-1 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"><ChevronLeft size={16} /></button>
                    <span className="text-xs font-black text-slate-800 uppercase tracking-widest">{calendarDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</span>
                    <button onClick={() => setCalendarDate(new Date(calendarDate.setMonth(calendarDate.getMonth() + 1)))} className="p-1 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"><ChevronRight size={16} /></button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => <span key={d} className="text-[9px] font-black text-slate-300 uppercase">{d}</span>)}
                </div>
                <div className="grid grid-cols-7 gap-1.5">
                    {Array(firstDay).fill(null).map((_, i) => <div key={`e-${i}`} />)}
                    {Array(days).fill(null).map((_, i) => {
                        const day = i + 1;
                        const isToday = day === today.getDate() && calendarDate.getMonth() === today.getMonth() && calendarDate.getFullYear() === today.getFullYear();
                        const dayHasEvent = hasEvent(day);
                        return (
                            <div key={day} className={`h-7 w-7 flex items-center justify-center rounded-full text-[10px] relative transition-all duration-200
                                ${isToday ? 'bg-slate-900 text-white font-bold shadow-md' : 'text-slate-500 hover:bg-slate-50 font-medium'}
                            `}>
                                {day}
                                {dayHasEvent && <div className={`absolute -bottom-0.5 w-1 h-1 rounded-full ${isToday ? 'bg-white' : 'bg-pink-500'}`}></div>}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <>
            {/* OVERLAY PARA MÓVIL */}
            {isOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-20 lg:hidden" onClick={toggle} />
            )}

            <aside className={`w-72 bg-white border-r border-slate-200 flex flex-col fixed h-full z-30 transition-transform duration-300 ease-out shadow-2xl lg:shadow-none lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#EC008C] to-[#C20072] rounded-xl flex items-center justify-center text-white shadow-lg"><Music size={20} strokeWidth={3} /></div>
                        <div>
                            <h1 className="font-black text-slate-900 text-lg leading-none tracking-tight">MÉTODO</h1>
                            <span className="text-pink-600 font-medium text-xs tracking-[0.2em] uppercase">ACTIVA</span>
                        </div>
                    </div>
                    {/* BOTÓN CERRAR EN MÓVIL */}
                    <button onClick={toggle} className="lg:hidden text-slate-400 hover:text-slate-600">
                        <X size={24} />
                    </button>
                </div>

                {/* WIDGET CALENDARIO LATERAL */}
                <SidebarCalendar />

                <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto mt-6 custom-scrollbar">
                    <button onClick={() => { setView('dashboard'); setFilter('all'); toggle(); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${view === 'dashboard' ? 'bg-pink-50 text-pink-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}><LayoutDashboard size={18} /> Dashboard</button>
                    <button onClick={() => { setView('patients'); setFilter('all'); toggle(); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${view === 'patients' && filter === 'all' ? 'bg-pink-50 text-pink-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}><Users size={18} /> Directorio</button>

                    {/* CATEGORÍAS EDAD */}
                    <div className="pt-6 pb-2"><p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Pacientes</p>
                        {[{ id: 'adults', icon: User, label: 'Adultos' }, { id: 'adolescents', icon: Smile, label: 'Adolescentes' }, { id: 'children', icon: Baby, label: 'Niños' }].map(item => (
                            <button key={item.id} onClick={() => { setView('patients'); setFilter(item.id); toggle(); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${filter === item.id ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}><item.icon size={16} /> {item.label}</button>
                        ))}</div>

                    {/* CATEGORÍAS TIPO SESIÓN */}
                    <div className="pt-4 pb-2"><p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Gestión</p>
                        <button onClick={() => { setView('sessions'); setFilter('individual'); toggle(); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${view === 'sessions' && filter === 'individual' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}><User size={16} /> Individual</button>
                        <button onClick={() => { setView('sessions'); setFilter('group'); toggle(); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${view === 'sessions' && filter === 'group' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}><Users2 size={16} /> Grupal</button>
                    </div>

                    <div className="pt-4 mt-auto">
                        <button onClick={() => { setView('reports'); toggle(); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 mt-1 transition-colors"><FileText size={18} /> Informes</button>
                        <button onClick={() => { setView('settings'); toggle(); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${view === 'settings' ? 'bg-amber-50 text-amber-700' : 'text-slate-500 hover:bg-slate-50'}`}><Settings size={18} /> Configuración</button>
                    </div>
                </nav>
            </aside>
        </>
    );
};
