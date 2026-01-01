import React, { useState } from 'react';
import { Users2, X, PlusCircle, Save } from 'lucide-react';
import { Button } from '../ui/Button';

interface GroupSessionModalProps {
    onClose: () => void;
    patients: any[];
    onSave: (data: any) => void;
}

export const GroupSessionModal = ({ onClose, patients, onSave }: GroupSessionModalProps) => {
    const [participants, setParticipants] = useState<string[]>([]);
    const [newParticipant, setNewParticipant] = useState("");
    const [priceGroup, setPriceGroup] = useState(150);
    const [defaultDate] = useState(new Date().toISOString().split('T')[0]);

    const addParticipant = () => { if (newParticipant.trim()) { setParticipants([...participants, newParticipant.trim()]); setNewParticipant(""); } };
    const removeParticipant = (index: number) => { setParticipants(participants.filter((_, i) => i !== index)); };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-3d rounded-2xl animate-in zoom-in-95">
                <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10"><h2 className="text-xl font-bold flex items-center gap-2 text-indigo-700"><Users2 /> Nueva Sesión Grupal</h2><button onClick={onClose}><X className="text-slate-400 hover:text-slate-600" /></button></div>
                <form className="p-8 space-y-8" onSubmit={e => {
                    e.preventDefault();
                    const d = new FormData(e.target as HTMLFormElement);

                    const rawDate = d.get('date') as string;
                    let formattedDate = new Date().toLocaleDateString('es-ES');
                    if (rawDate) {
                        const [y, m, day] = rawDate.split('-');
                        formattedDate = `${day}/${m}/${y}`;
                    }

                    onSave({
                        id: `group-${Date.now()}`,
                        date: formattedDate,
                        time: d.get('time'),
                        phase: 2,
                        activities: ["Dinámica Grupal"],
                        notes: d.get('notes'),
                        groupAnalysis: d.get('groupAnalysis'),
                        location: d.get('location'),
                        type: 'group',
                        participantNames: participants,
                        price: priceGroup,
                        paid: false
                    });
                }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <div className="flex justify-between items-center mb-2"><label className="label-pro">1. Participantes del Grupo</label><div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1.5 rounded-lg"><span className="text-xs font-bold text-slate-500 pl-2">Total Grupo:</span><input type="number" value={priceGroup} onChange={e => setPriceGroup(Number(e.target.value))} className="w-16 bg-transparent text-right font-bold text-slate-700 text-xs outline-none" /><span className="text-xs text-slate-500 pr-2">€</span></div></div>
                            <div className="flex gap-2 mb-3"><input className="input-pro flex-1" placeholder="Nombre participante..." value={newParticipant} onChange={(e) => setNewParticipant(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addParticipant())} /><Button type="button" size="sm" onClick={addParticipant} icon={PlusCircle}>Añadir</Button></div>
                            <div className="border border-slate-200 rounded-xl min-h-[150px] max-h-60 overflow-y-auto p-3 bg-slate-50 flex flex-wrap content-start gap-2">{participants.map((p, i) => (<div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm text-sm font-medium text-slate-700 animate-in fade-in zoom-in">{p}<button type="button" onClick={() => removeParticipant(i)} className="text-slate-400 hover:text-red-500 transition-colors"><X size={14} /></button></div>))}</div>
                        </div>
                        <div className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="label-pro">Fecha</label><input type="date" name="date" defaultValue={defaultDate} className="input-pro" required /></div>
                                <div><label className="label-pro">Hora</label><input type="time" name="time" defaultValue="10:00" className="input-pro" required /></div>
                            </div>
                            <div><label className="label-pro">2. Lugar / Sala (Para Recordatorio)</label><input name="location" className="input-pro" placeholder="Ej: Sala Polivalente, Centro Cívico..." required /></div>
                            <div><label className="label-pro">3. Análisis Grupal</label><textarea name="groupAnalysis" className="input-pro h-24 resize-none" placeholder="Cohesión, liderazgo, escucha..." required /></div>
                            <div><label className="label-pro">4. Actividad</label><textarea name="notes" className="input-pro h-20 resize-none" placeholder="Descripción general..." required /></div>
                        </div>
                    </div>
                    <div className="flex justify-end pt-6 border-t border-slate-100"><Button type="submit" icon={Save} disabled={participants.length === 0} size="md" className="shadow-lg">Guardar y Facturar</Button></div>
                </form>
            </div>
        </div>
    );
};
