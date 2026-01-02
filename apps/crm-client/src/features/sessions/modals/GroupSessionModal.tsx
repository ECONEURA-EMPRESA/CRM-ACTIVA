
import React, { useState } from 'react';
import { X, Save, Clock, Euro, Users, MapPin } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Session } from '../../../lib/types'; // Using Shared types
import { formatDateForInput } from '../../../lib/utils';
import { Patient } from '../../../lib/types';

interface GroupSessionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (session: Session) => void;
    patients: Patient[]; // Requerido para seleccionar participantes
}

export const GroupSessionModal: React.FC<GroupSessionModalProps> = ({ isOpen, onClose, onSave, patients }) => {
    const [date, setDate] = useState(formatDateForInput(new Date().toISOString()));
    const [price, setPrice] = useState(25); // Precio por persona default
    const [notes, setNotes] = useState('');
    const [location, setLocation] = useState('Sala Principal');
    const [selectedPatients, setSelectedPatients] = useState<string[]>([]); // Array of IDs
    const [groupAnalysis, setGroupAnalysis] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Mapeamos los nombres para guardarlos en la sesión (legacy support)
        const participantNames = patients.filter(p => selectedPatients.includes(String(p.id))).map(p => p.name);

        const newSession: Session = {
            id: Date.now(),
            date: new Date(date).toLocaleDateString('es-ES'),
            type: 'group',
            price: Number(price), // Precio por persona
            paid: false, // Default
            isAbsent: false,
            notes,
            location,
            participantNames, // IDs o Nombres
            groupAnalysis
            // En backend real, aquí guardaríamos 'participantIds': selectedPatients
        };

        onSave(newSession);
        onClose();
        // Reset basic fields
        setNotes(''); setGroupAnalysis(''); setSelectedPatients([]);
    };

    const togglePatient = (id: string) => {
        setSelectedPatients(prev => prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl flex flex-col overflow-hidden max-h-[90vh]">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center"><Users size={20} /></div>
                        <div>
                            <h2 className="text-xl font-black text-slate-800">Nueva Sesión Grupal</h2>
                            <p className="text-sm text-slate-500 font-medium">Registro colectivo / taller</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
                    {/* Datos Logísticos */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="label-pro">Fecha</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input type="date" className="input-pro pl-10" required value={date} onChange={e => setDate(e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="label-pro">Precio / Persona</label>
                            <div className="relative">
                                <Euro className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input type="number" className="input-pro pl-10" required value={price} onChange={e => setPrice(Number(e.target.value))} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="label-pro">Ubicación</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input className="input-pro pl-10" value={location} onChange={e => setLocation(e.target.value)} />
                            </div>
                        </div>
                    </div>

                    {/* Selección Participantes */}
                    <div className="border rounded-2xl p-6 border-slate-200 bg-slate-50">
                        <h4 className="font-bold text-slate-800 mb-4 flex justify-between">
                            <span>Participantes</span>
                            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">{selectedPatients.length} Seleccionados</span>
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                            {patients.map(p => (
                                <label key={p.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedPatients.includes(String(p.id)) ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-slate-200 hover:border-indigo-300'}`}>
                                    <input type="checkbox" className="hidden" checked={selectedPatients.includes(String(p.id))} onChange={() => togglePatient(String(p.id))} />
                                    <span className="font-bold text-xs truncate">{p.name}</span>
                                </label>
                            ))}
                        </div>
                        {patients.length === 0 && <p className="text-sm text-slate-400 italic text-center">No hay pacientes registrados.</p>}
                    </div>

                    {/* Análisis Grupal */}
                    <div className="space-y-2">
                        <label className="label-pro">Análisis de Dinámica Grupal</label>
                        <textarea
                            className="input-pro min-h-[120px]"
                            placeholder="Describa la interacción, clima grupal, participación general..."
                            value={groupAnalysis}
                            onChange={e => setGroupAnalysis(e.target.value)}
                        />
                    </div>
                </form>

                <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                    <Button variant="secondary" onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleSubmit} icon={Save} disabled={selectedPatients.length === 0}>Guardar Sesión Grupal</Button>
                </div>
            </div>
        </div>
    );
};

