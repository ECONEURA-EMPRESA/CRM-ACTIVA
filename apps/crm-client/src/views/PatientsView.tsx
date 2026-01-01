import React, { useState } from 'react';
import { Search, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { PatientAvatar } from '../components/ui/Avatar';

interface PatientsViewProps {
    patients: any[];
    onNavigate: (view: string, data?: any) => void;
    filter: string;
    setFilter: (filter: string) => void;
}

export const PatientsView = ({ patients, onNavigate, filter, setFilter }: PatientsViewProps) => {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const itemsPerPage = 12;
    const filtered = patients.filter(p => {
        let ageMatch = true;
        if (filter === 'adults') ageMatch = p.age >= 18;
        if (filter === 'adolescents') ageMatch = p.age >= 12 && p.age < 18;
        if (filter === 'children') ageMatch = p.age < 12;
        return ageMatch && (p.name.toLowerCase().includes(search.toLowerCase()) || p.diagnosis.toLowerCase().includes(search.toLowerCase()));
    });
    return (
        <div className="space-y-6 animate-in fade-in max-w-7xl mx-auto">
            <header className="flex justify-between items-center"><div><h1 className="text-2xl font-bold text-slate-900">Directorio Pacientes</h1><p className="text-slate-500 text-sm">Filtro actual: <span className="font-bold uppercase">{filter}</span></p></div><div className="relative"><Search className="absolute left-3 top-2.5 text-slate-400" size={18} /><input className="input-pro pl-10" placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} /></div></header>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
                {filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage).map(p => {
                    const validSessionsCount = p.sessions ? p.sessions.filter((s: any) => !s.isAbsent).length : 0;
                    return (
                        <Card key={p.id} noPadding className="hover:ring-2 hover:ring-pink-500/20 cursor-pointer group transition-all hover:shadow-xl">
                            <div onClick={() => onNavigate('detail', p)} className="p-6">
                                <div className="flex justify-between mb-4">
                                    <PatientAvatar photo={p.photo} name={p.name} size="sm" />
                                    <Badge variant="brand">S. {validSessionsCount}</Badge>
                                </div>
                                <h3 className="font-bold text-lg text-slate-800 group-hover:text-pink-600 transition-colors">{p.name}</h3>
                                <p className="text-sm text-slate-500 mb-2 line-clamp-1">{p.diagnosis}</p>
                                <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                                    <Clock size={12} /> {p.age} años
                                </div>
                                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full" style={{ width: `${Math.min(100, (validSessionsCount / 20) * 100)}%` }}></div>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* PAGINATION CONTROLS */}
            {filtered.length > itemsPerPage && (
                <div className="flex justify-center items-center gap-4 pt-8">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed">
                        <ChevronLeft className="text-slate-600" />
                    </button>
                    <span className="font-bold text-slate-600">Página {page} de {Math.ceil(filtered.length / itemsPerPage)}</span>
                    <button onClick={() => setPage(p => Math.min(Math.ceil(filtered.length / itemsPerPage), p + 1))} disabled={page >= Math.ceil(filtered.length / itemsPerPage)} className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed">
                        <ChevronRight className="text-slate-600" />
                    </button>
                </div>
            )}
        </div>
    );
};
