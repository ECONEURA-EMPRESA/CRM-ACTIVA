import React, { useState } from 'react';
import { Clock, X, CalendarCheck } from 'lucide-react';
import { Button } from '../ui/Button';

interface QuickAppointmentModalProps {
    onClose: () => void;
    patients: any[];
    onSave: (data: any) => void;
}

export const QuickAppointmentModal = ({ onClose, patients, onSave }: QuickAppointmentModalProps) => {
    const [mode, setMode] = useState('existing');
    const [selectedPatientId, setSelectedPatientId] = useState('');
    const [newPatientName, setNewPatientName] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState('10:00');

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ mode, patientId: selectedPatientId, name: newPatientName, date, time });
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-3d overflow-hidden animate-in fade-in zoom-in-95">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                    <h2 className="text-xl font-bold flex items-center gap-3 text-slate-800"><Clock className="text-pink-600" /> Agendar Cita</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><X /></button>
                </div>
                <form className="p-6 space-y-6" onSubmit={handleSave}>
                    <div className="flex bg-slate-50 p-1.5 rounded-xl mb-4 border border-slate-100">
                        <button type="button" onClick={() => setMode('existing')} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${mode === 'existing' ? 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>Paciente Existente</button>
                        <button type="button" onClick={() => setMode('new')} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${mode === 'new' ? 'bg-white text-pink-600 shadow-sm ring-1 ring-pink-100' : 'text-slate-500 hover:text-slate-700'}`}>Nuevo Paciente</button>
                    </div>

                    {mode === 'existing' ? (
                        <div>
                            <label className="label-pro">Seleccionar Paciente</label>
                            <select className="input-pro" value={selectedPatientId} onChange={e => setSelectedPatientId(e.target.value)} required>
                                <option value="">- Buscar en la lista -</option>
                                {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                    ) : (
                        <div>
                            <label className="label-pro">Nombre del Nuevo Paciente</label>
                            <input className="input-pro" placeholder="Ej. Ana García" value={newPatientName} onChange={e => setNewPatientName(e.target.value)} required autoFocus />
                            <p className="text-xs text-slate-500 mt-2 font-medium">✨ Se creará una ficha rápida automáticamente.</p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="label-pro">Fecha</label><input type="date" className="input-pro" value={date} onChange={e => setDate(e.target.value)} required /></div>
                        <div><label className="label-pro">Hora</label><input type="time" className="input-pro" value={time} onChange={e => setTime(e.target.value)} required /></div>
                    </div>

                    <Button type="submit" className="w-full py-3 text-base shadow-lg hover:shadow-xl" icon={CalendarCheck}>Confirmar Cita</Button>
                </form>
            </div>
        </div>
    );
};
