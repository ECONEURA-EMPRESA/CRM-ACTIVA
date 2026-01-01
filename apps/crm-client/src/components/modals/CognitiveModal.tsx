import React, { useState } from 'react';
import { X, Brain, BarChart3, Save } from 'lucide-react';
import { Button } from '../ui/Button';
import { EVALUATION_AREAS } from '../../lib/constants';
import { formatDateForInput, formatDateForDisplay } from '../../lib/utils';

interface CognitiveModalProps {
    onClose: () => void;
    onSave: (data: any) => void;
    initialData?: any;
    initialScores?: number[];
}

export const CognitiveModal = ({ onClose, onSave, initialData, initialScores }: CognitiveModalProps) => {
    const [date, setDate] = useState(formatDateForInput(initialData?.date) !== new Date().toISOString().split('T')[0] ? formatDateForInput(initialData?.date) : new Date().toISOString().split('T')[0]);
    const [scores, setScores] = useState<number[]>(initialScores || Array(9).fill(0));

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-3d max-h-[90vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-4">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <h2 className="text-xl font-bold flex items-center gap-3 text-slate-800"><Brain className="text-pink-600" /> Evaluación Clínica</h2>
                    <button onClick={onClose}><X className="text-slate-400 hover:text-slate-600" /></button>
                </div>
                <form className="p-8 space-y-8" onSubmit={e => {
                    e.preventDefault();
                    const d = new FormData(e.target as HTMLFormElement);
                    onSave({
                        moca: d.get('moca'),
                        mmse: d.get('mmse'),
                        gds: d.get('gds'),
                        date: formatDateForDisplay(date),
                        functionalScores: scores
                    });
                }}>
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                        <label className="label-pro mb-4 text-slate-500">1. Pruebas Estandarizadas</label>
                        <div className="grid grid-cols-2 gap-6 mb-4">
                            <div><label className="label-pro text-xs">MOCA (/30)</label><input name="moca" defaultValue={initialData?.moca} className="input-pro bg-white" placeholder="Ej. 24/30" /></div>
                            <div><label className="label-pro text-xs">MMSE (/30)</label><input name="mmse" defaultValue={initialData?.mmse} className="input-pro bg-white" placeholder="Ej. 22/30" /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div><label className="label-pro text-xs">Escala GDS</label><select name="gds" defaultValue={initialData?.gds} className="input-pro bg-white"><option value="-">-</option>{[1, 2, 3, 4, 5, 6, 7].map(n => <option key={n} value={n}>{n}</option>)}</select></div>
                            <div><label className="label-pro text-xs">Fecha</label><input type="date" value={date} onChange={e => setDate(e.target.value)} className="input-pro bg-white" required /></div>
                        </div>
                    </div>
                    <div>
                        <label className="label-pro mb-4 flex items-center gap-2 text-slate-500"><BarChart3 size={16} /> 2. Escala Funcional Actual (0-3)</label>
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            {EVALUATION_AREAS.map((area, i) => (
                                <div key={i} className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 px-2 rounded-lg transition-colors">
                                    <span className="text-xs font-bold text-slate-700">{area}</span>
                                    <div className="flex gap-2">{[0, 1, 2, 3].map(v => <button key={v} type="button" onClick={() => { const newScores = [...scores]; newScores[i] = v; setScores(newScores); }} className={`w-8 h-8 text-[11px] rounded-lg font-bold transition-all flex items-center justify-center ${scores[i] === v ? 'bg-pink-500 text-white shadow-md scale-110' : 'bg-white border border-slate-200 text-slate-400 hover:border-slate-300'}`}>{v}</button>)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Button type="submit" className="w-full py-3" icon={Save}>Guardar Evaluación Completa</Button>
                </form>
            </div>
        </div>
    );
};
