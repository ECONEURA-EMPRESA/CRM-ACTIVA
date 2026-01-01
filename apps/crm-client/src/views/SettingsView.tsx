import React from 'react';
import { Save } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

interface SettingsViewProps {
    clinicSettings: any;
    onSaveSettings: (settings: any) => void;
}

export const SettingsView = ({ clinicSettings, onSaveSettings }: SettingsViewProps) => {
    return (
        <div className="space-y-8 animate-in fade-in max-w-4xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Configuración de la Clínica</h1>
                <p className="text-slate-500 text-lg mt-1">Datos fiscales y de personalización para documentos.</p>
            </header>
            <Card className="p-8">
                <form className="space-y-8" onSubmit={(e) => {
                    e.preventDefault();
                    const d = new FormData(e.target as HTMLFormElement);
                    onSaveSettings(Object.fromEntries(d));
                }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div><label className="label-pro">Nombre del Centro / Profesional</label><input name="name" defaultValue={clinicSettings.name || ''} className="input-pro" placeholder="Ej: Centro Activa Musicoterapia" required /></div>
                        <div><label className="label-pro">CIF / NIF</label><input name="cif" defaultValue={clinicSettings.cif || ''} className="input-pro" placeholder="12345678X" required /></div>
                        <div className="md:col-span-2"><label className="label-pro">Dirección Completa</label><input name="address" defaultValue={clinicSettings.address || ''} className="input-pro" placeholder="C/ Ejemplo 123, Madrid" required /></div>
                        <div><label className="label-pro">Teléfono</label><input name="phone" defaultValue={clinicSettings.phone || ''} className="input-pro" placeholder="+34 600 000 000" /></div>
                        <div><label className="label-pro">Email</label><input name="email" defaultValue={clinicSettings.email || ''} className="input-pro" placeholder="hola@centro.com" /></div>
                        <div className="md:col-span-2"><label className="label-pro">Texto Legal (Pie de Factura)</label><textarea name="legalText" defaultValue={clinicSettings.legalText || ''} className="input-pro h-24 resize-none" placeholder="Información sobre protección de datos, registro mercantil, etc." /></div>
                    </div>
                    <div className="flex justify-end pt-6 border-t border-slate-100">
                        <Button type="submit" icon={Save} size="md">Guardar Configuración</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};
