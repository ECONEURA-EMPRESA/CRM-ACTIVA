
import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Save, Building, CreditCard, Mail, Globe } from 'lucide-react';
import { ClinicSettings } from '../../lib/types';
import { Toast } from '../../components/ui/Toast';

interface SettingsViewProps {
    settings: ClinicSettings;
    onSave: (newSettings: ClinicSettings) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ settings, onSave }) => {
    const [formData, setFormData] = useState<ClinicSettings>(settings);
    const [toast, setToast] = useState<{ msg: string, type: 'success' | 'error' } | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        setToast({ msg: 'Configuración guardada correctamente', type: 'success' });
        setTimeout(() => setToast(null), 3000);
    };

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Configuración Clínica</h1>
                    <p className="text-slate-500 mt-1">Datos de facturación y perfil profesional</p>
                </div>
            </header>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* General Info */}
                    <Card className="p-8 space-y-6">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4">
                            <Building size={20} className="text-pink-600" /> Información General
                        </h3>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="label-pro">Nombre de la Clínica / Profesional</label>
                                <input required className="input-pro" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Ej: Centro de Musicoterapia Activa" />
                            </div>
                            <div className="space-y-2">
                                <label className="label-pro">Dirección Fiscal</label>
                                <textarea className="input-pro min-h-[80px]" value={formData.address || ''} onChange={e => setFormData({ ...formData, address: e.target.value })} placeholder="Calle, Ciudad, Código Postal..." />
                            </div>
                            <div className="space-y-2">
                                <label className="label-pro">Teléfono de Contacto</label>
                                <input className="input-pro" value={formData.phone || ''} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="+34 600 000 000" />
                            </div>
                        </div>
                    </Card>

                    {/* Legal & Invoice Data */}
                    <div className="space-y-6">
                        <Card className="p-8 space-y-6">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4">
                                <CreditCard size={20} className="text-indigo-600" /> Datos de Facturación
                            </h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="label-pro">CIF / NIF</label>
                                    <input className="input-pro font-mono" value={formData.cif || ''} onChange={e => setFormData({ ...formData, cif: e.target.value })} placeholder="B-12345678" />
                                </div>
                                <div className="space-y-2">
                                    <label className="label-pro">Email para Facturas</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 text-slate-400" size={16} />
                                        <input type="email" className="input-pro pl-10" value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="facturacion@empresa.com" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="label-pro">Sitio Web</label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-3 text-slate-400" size={16} />
                                        <input className="input-pro pl-10" value={formData.website || ''} onChange={e => setFormData({ ...formData, website: e.target.value })} placeholder="www.metodoactiva.com" />
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-8 space-y-4 bg-slate-50 border-slate-200">
                            <div className="space-y-2">
                                <label className="label-pro">Texto Legal (Pie de Factura)</label>
                                <textarea className="input-pro text-xs text-slate-500 min-h-[100px]" value={formData.legalText || ''} onChange={e => setFormData({ ...formData, legalText: e.target.value })} placeholder="Términos y condiciones legales..." />
                            </div>
                        </Card>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <Button type="submit" className="w-full md:w-auto px-8" icon={Save}>Guardar Cambios</Button>
                </div>
            </form>

            {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};
