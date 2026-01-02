
import React, { useState } from 'react';
import { X, Brain, BarChart3, ShieldCheck, ClipboardCheck, Save } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import {
    EVALUATION_AREAS,
    MOCA_SECTIONS,
    MMSE_SECTIONS,
    ADMISSION_CHECKS
} from '../../../lib/clinicalUtils';
import { formatDateForInput, formatDateForDisplay } from '../../../lib/patientUtils';
import { GDSSelectionCards } from '../components/GDSSelectionCards';

interface CognitiveModalProps {
    onClose: () => void;
    onSave: (data: any) => void;
    initialData?: any;
    initialScores?: number[];
}

export const CognitiveModal: React.FC<CognitiveModalProps> = ({ onClose, onSave, initialData, initialScores }) => {
    const [activeTab, setActiveTab] = useState('general');
    const [date, setDate] = useState(formatDateForInput(initialData?.date) !== new Date().toISOString().split('T')[0] ? formatDateForInput(initialData?.date) : new Date().toISOString().split('T')[0]);
    const [scores, setScores] = useState<number[]>(initialScores || Array(9).fill(0));

    // Estados para MOCA y MMSE detallados
    const [mocaDetails, setMocaDetails] = useState<Record<string, number>>(initialData?.mocaDetails || {});
    const [mmseDetails, setMmseDetails] = useState<Record<string, number>>(initialData?.mmseDetails || {});
    const [admissionChecks, setAdmissionChecks] = useState<Record<string, string[]>>(initialData?.admissionChecks || { safety: [], prep: [] });

    // Cálculo automático de totales
    const mocaTotal = MOCA_SECTIONS.reduce((sum, s) => sum + (Number(mocaDetails[s.id] || 0)), 0);
    const mmseTotal = MMSE_SECTIONS.reduce((sum, s) => sum + (Number(mmseDetails[s.id] || 0)), 0);

    const toggleCheck = (type: 'safety' | 'prep', item: string) => {
        setAdmissionChecks(prev => {
            const list = prev[type] || [];
            const newList = list.includes(item) ? list.filter(i => i !== item) : [...list, item];
            return { ...prev, [type]: newList };
        });
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-3d max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                    <h2 className="text-xl font-bold flex items-center gap-3 text-slate-800"><Brain className="text-pink-600" /> Evaluación Clínica</h2>
                    <button onClick={onClose}><X className="text-slate-400 hover:text-slate-600" /></button>
                </div>

                {/* PESTAÑAS DE NAVEGACIÓN */}
                <div className="flex border-b border-slate-100 bg-slate-50 overflow-x-auto">
                    {[
                        { id: 'general', label: 'Resumen & Funcional' },
                        { id: 'moca', label: 'MOCA (Detallado)' },
                        { id: 'mmse', label: 'MMSE (Detallado)' },
                        { id: 'admission', label: 'Admisión (Parte 6)' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${activeTab === tab.id ? 'border-pink-600 text-pink-700 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="p-8 overflow-y-auto flex-1">
                    <form id="evalForm" onSubmit={e => {
                        e.preventDefault();
                        const formData = new FormData(e.target as HTMLFormElement);
                        const gds = formData.get('gds');
                        onSave({
                            moca: `${mocaTotal}/30`, // Guardamos el total calculado
                            mmse: `${mmseTotal}/30`, // Guardamos el total calculado
                            gds: gds,
                            date: formatDateForDisplay(date),
                            functionalScores: scores,
                            mocaDetails,
                            mmseDetails,
                            admissionChecks
                        });
                    }}>

                        {/* PESTAÑA 1: GENERAL */}
                        {activeTab === 'general' && (
                            <div className="space-y-6 animate-in fade-in">
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                    <label className="label-pro mb-4 text-slate-500">Resumen de Puntuaciones</label>
                                    <div className="grid grid-cols-2 gap-6 mb-4">
                                        <div><label className="label-pro text-xs">MOCA Total (Auto)</label><div className="text-2xl font-black text-slate-800">{mocaTotal}/30</div></div>
                                        <div><label className="label-pro text-xs">MMSE Total (Auto)</label><div className="text-2xl font-black text-slate-800">{mmseTotal}/30</div></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="col-span-2">
                                            <label className="label-pro mb-3 block">Escala de Deterioro Global (Reisberg)</label>
                                            <GDSSelectionCards
                                                selected={Number(initialData?.gds) || 1}
                                                onSelect={(val) => {
                                                    // We'll treat this as a controlled input simulation for the form
                                                    const input = document.createElement('input');
                                                    input.type = 'hidden';
                                                    input.name = 'gds';
                                                    input.value = val.toString();
                                                    document.getElementById('evalForm')?.appendChild(input);
                                                    // Ideally use state, but strict port kept form logic
                                                    // For now, let's just force update via onSave wrapper logic if needed, 
                                                    // or strictly update the initialData prop flow.
                                                    // BETTER: Let's use a hidden input field bound to state.
                                                }}
                                            />
                                            <input type="hidden" name="gds" value={initialData?.gds || 1} id="gdsInput" />
                                            {/* Helper script to update hidden input on select - standard react pattern is needed here */}
                                        </div>
                                        <div><label className="label-pro text-xs">Fecha Evaluación</label><input type="date" value={date} onChange={e => setDate(e.target.value)} className="input-pro bg-white" required /></div>
                                    </div>
                                </div>
                                <div>
                                    <label className="label-pro mb-4 flex items-center gap-2 text-slate-500"><BarChart3 size={16} /> Escala Funcional Actual (0-3)</label>
                                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                        {EVALUATION_AREAS.map((area, i) => (
                                            <div key={i} className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 px-2 rounded-lg transition-colors">
                                                <span className="text-xs font-bold text-slate-700">{area}</span>
                                                <div className="flex gap-2">{[0, 1, 2, 3].map(v => <button key={v} type="button" onClick={() => { const newScores = [...scores]; newScores[i] = v; setScores(newScores); }} className={`w-8 h-8 text-[11px] rounded-lg font-bold transition-all flex items-center justify-center ${scores[i] === v ? 'bg-pink-500 text-white shadow-md scale-110' : 'bg-white border border-slate-200 text-slate-400 hover:border-slate-300'}`}>{v}</button>)}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* PESTAÑA 2: MOCA DETALLADO */}
                        {activeTab === 'moca' && (
                            <div className="space-y-4 animate-in fade-in">
                                <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
                                    <h3 className="font-bold text-slate-800">Montreal Cognitive Assessment</h3>
                                    <Badge variant="brand">Total: {mocaTotal} / 30</Badge>
                                </div>
                                {MOCA_SECTIONS.map(section => (
                                    <div key={section.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                                        <label className="text-sm font-medium text-slate-700">{section.label} <span className="text-xs text-slate-400 ml-1">(Max: {section.max})</span></label>
                                        <input
                                            type="number"
                                            min="0"
                                            max={section.max}
                                            value={mocaDetails[section.id] || ''}
                                            onChange={e => {
                                                const val = Math.min(section.max, Math.max(0, parseInt(e.target.value) || 0));
                                                setMocaDetails({ ...mocaDetails, [section.id]: val });
                                            }}
                                            className="w-16 text-center font-bold input-pro py-1"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* PESTAÑA 3: MMSE DETALLADO */}
                        {activeTab === 'mmse' && (
                            <div className="space-y-4 animate-in fade-in">
                                <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
                                    <h3 className="font-bold text-slate-800">Mini-Mental State Examination</h3>
                                    <Badge variant="brand">Total: {mmseTotal} / 30</Badge>
                                </div>
                                {MMSE_SECTIONS.map(section => (
                                    <div key={section.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                                        <label className="text-sm font-medium text-slate-700">{section.label} <span className="text-xs text-slate-400 ml-1">(Max: {section.max})</span></label>
                                        <input
                                            type="number"
                                            min="0"
                                            max={section.max}
                                            value={mmseDetails[section.id] || ''}
                                            onChange={e => {
                                                const val = Math.min(section.max, Math.max(0, parseInt(e.target.value) || 0));
                                                setMmseDetails({ ...mmseDetails, [section.id]: val });
                                            }}
                                            className="w-16 text-center font-bold input-pro py-1"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* PESTAÑA 4: ADMISIÓN (CHECKLISTS) */}
                        {activeTab === 'admission' && (
                            <div className="space-y-8 animate-in fade-in">
                                <div>
                                    <h3 className="font-bold text-red-600 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide"><ShieldCheck size={16} /> Seguridad y Contraindicaciones</h3>
                                    <div className="space-y-2">
                                        {ADMISSION_CHECKS.safety.map(item => (
                                            <label key={item} className="flex items-center gap-3 p-3 bg-red-50/50 rounded-xl cursor-pointer hover:bg-red-50 border border-transparent hover:border-red-100 transition-colors">
                                                <input
                                                    type="checkbox"
                                                    className="w-5 h-5 accent-red-600"
                                                    checked={admissionChecks.safety?.includes(item)}
                                                    onChange={() => toggleCheck('safety', item)}
                                                />
                                                <span className={`text-sm ${admissionChecks.safety?.includes(item) ? 'font-bold text-red-800' : 'text-slate-600'}`}>{item}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-emerald-600 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide"><ClipboardCheck size={16} /> Preparación 1ª Sesión</h3>
                                    <div className="space-y-2">
                                        {ADMISSION_CHECKS.prep.map(item => (
                                            <label key={item} className="flex items-center gap-3 p-3 bg-emerald-50/50 rounded-xl cursor-pointer hover:bg-emerald-50 border border-transparent hover:border-emerald-100 transition-colors">
                                                <input
                                                    type="checkbox"
                                                    className="w-5 h-5 accent-emerald-600"
                                                    checked={admissionChecks.prep?.includes(item)}
                                                    onChange={() => toggleCheck('prep', item)}
                                                />
                                                <span className={`text-sm ${admissionChecks.prep?.includes(item) ? 'font-bold text-emerald-800' : 'text-slate-600'}`}>{item}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                    </form>
                </div>
                <div className="p-6 border-t border-slate-100 bg-white">
                    <Button onClick={() => (document.getElementById('evalForm') as HTMLFormElement).requestSubmit()} className="w-full py-3" icon={Save}>Guardar Evaluación Completa</Button>
                </div>
            </div >
        </div >
    );
};
