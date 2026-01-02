
import React, { useState } from 'react';
import { X, CalendarCheck, Clock, User } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Patient } from '../../../lib/types';
import { formatDateForInput } from '../../../lib/utils';

interface QuickAppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    patients: Patient[];
    onSave: (appointment: any) => void;
}

export const QuickAppointmentModal: React.FC<QuickAppointmentModalProps> = ({ isOpen, onClose, patients, onSave }) => {
    const [date, setDate] = useState(formatDateForInput(new Date().toISOString()));
    const [time, setTime] = useState('10:00');
    const [patientId, setPatientId] = useState('');
    const [note, setNote] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            date, time, patientId, note, type: 'appointment'
        });
        onClose();
        setPatientId(''); setNote('');
    };

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-pink-50/50">
                    <h2 className="text-lg font-black text-slate-800 flex items-center gap-2"><CalendarCheck className="text-pink-600" /> Agendar Cita</h2>
                    <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full"><X size={18} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="label-pro">Fecha</label>
                            <input type="date" required className="input-pro" value={date} onChange={e => setDate(e.target.value)} />
                        </div>
                        <div className="space-y-1">
                            <label className="label-pro">Hora</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-3 text-slate-400" size={16} />
                                <input type="time" required className="input-pro pl-10" value={time} onChange={e => setTime(e.target.value)} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="label-pro">Paciente</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-slate-400" size={16} />
                            <select className="input-pro pl-10 appearance-none" required value={patientId} onChange={e => setPatientId(e.target.value)}>
                                <option value="">Seleccionar...</option>
                                {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="label-pro">Nota (Opcional)</label>
                        <textarea className="input-pro" placeholder="Detalles de la cita..." value={note} onChange={e => setNote(e.target.value)} />
                    </div>

                    <Button className="w-full mt-4" type="submit">Confirmar Cita</Button>
                </form>
            </div>
        </div>
    );
};

