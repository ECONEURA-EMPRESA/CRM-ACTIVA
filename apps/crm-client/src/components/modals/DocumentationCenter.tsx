import React from 'react';
import { X } from 'lucide-react';

interface DocumentationCenterProps {
    patient?: any;
    onClose: () => void;
    isTemplate?: boolean;
}

export const DocumentationCenter = ({ patient, onClose, isTemplate }: DocumentationCenterProps) => {
    return (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-xl max-w-4xl w-full h-[80vh] flex flex-col">
                <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-800">Centro de Documentación {isTemplate ? '(Plantillas)' : ''}</h2>
                    <button onClick={onClose}><X className="text-slate-400 hover:text-slate-600" /></button>
                </div>
                <div className="flex-1 bg-slate-100 flex items-center justify-center text-slate-400 rounded-lg border-2 border-dashed border-slate-200">
                    Funcionalidad de Informes PDF disponible en versiones anteriores (restaurada)
                </div>
            </div>
        </div>
    );
};
