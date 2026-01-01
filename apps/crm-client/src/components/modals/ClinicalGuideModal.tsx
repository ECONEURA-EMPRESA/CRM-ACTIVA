import React, { useState } from 'react';
import { BookOpen, X, Zap, CheckCircle2, Music, PlayCircle, AlertCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { CLINICAL_GUIDES } from '../../lib/constants';

interface ClinicalGuideModalProps {
    onClose: () => void;
    defaultTab?: string;
}

export const ClinicalGuideModal = ({ onClose, defaultTab = 'dementia' }: ClinicalGuideModalProps) => {
    const [activeTab, setActiveTab] = useState(defaultTab);
    const guide = CLINICAL_GUIDES[activeTab];

    return (<div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"> <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"> <div className="p-6 border-b flex justify-between items-center bg-white sticky top-0 z-10"> <h2 className="text-lg font-bold flex items-center gap-2"><BookOpen className="text-pink-600" /> Guía Clínica (Manual Sección 5)</h2> <button onClick={onClose}><X className="text-slate-400" /></button> </div> <div className="flex border-b"> {Object.keys(CLINICAL_GUIDES).map(key => (<button key={key} onClick={() => setActiveTab(key)} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider ${activeTab === key ? 'text-pink-600 border-b-2 border-pink-600 bg-pink-50' : 'text-slate-500 hover:bg-slate-50'}`}>{key === 'dementia' ? 'Demencias' : key === 'mood' ? 'Ánimo' : 'Neurológico'}</button>))} </div> <div className="p-8 space-y-6"> <div><h3 className="text-xl font-black text-slate-800 mb-2">{guide.title}</h3><p className="text-slate-500 text-sm italic">Recomendaciones del Método Activa</p></div> <div className="grid grid-cols-2 gap-6"> <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100"> <h4 className="font-bold text-emerald-800 text-sm mb-3 flex items-center gap-2"><Zap size={16} /> Objetivos Prioritarios</h4> <ul className="space-y-2">{guide.objectives.map((o: string) => <li key={o} className="text-xs text-emerald-700 flex gap-2"><CheckCircle2 size={12} className="shrink-0 mt-0.5" /> {o}</li>)}</ul> </div> <div className="bg-blue-50 p-4 rounded-xl border border-blue-100"> <h4 className="font-bold text-blue-800 text-sm mb-3 flex items-center gap-2"><Music size={16} /> Técnicas Sugeridas</h4> <ul className="space-y-2">{guide.techniques.map((t: string) => <li key={t} className="text-xs text-blue-700 flex gap-2"><PlayCircle size={12} className="shrink-0 mt-0.5" /> {t}</li>)}</ul> </div> </div> <div className="bg-amber-50 p-4 rounded-xl border border-amber-100"> <h4 className="font-bold text-amber-800 text-sm mb-2 flex items-center gap-2"><AlertCircle size={16} /> Precauciones Clínicas</h4> <p className="text-xs text-amber-700">{guide.precautions.join(" • ")}</p> </div> </div> </Card> </div>);
};
