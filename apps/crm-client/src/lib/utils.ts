
// --- UTILS ---
export const generateInvoiceHTML = (clinicData: any, patient: any, sessions: any[], invoiceNumber: string) => {
    // const total = sessions.reduce((sum, s) => sum + (s.price || 0), 0);
    // const date = new Date().toLocaleDateString('es-ES');
    return `<html><body><h1>FACTURA ${invoiceNumber}</h1><p>Funcionalidad de impresión simulada</p></body></html>`;
};

export const printInvoice = (clinicData: any, patient: any, sessions: any[], invoiceNumber: string) => {
    console.log("Imprimiendo factura...", invoiceNumber);
    alert(`Imprimiendo Factura ${invoiceNumber}\n(Simulación: En producción esto abriría el PDF)`);
};

export const printConsent = (clinicData: any, patientData: any) => {
    console.log("Imprimiendo consentimiento...");
    alert("Imprimiendo Consentimiento Informado...\n(Simulación)");
};

// --- HELPERS FECHA ---
export const formatDateForInput = (dateStr: string) => {
    if (!dateStr) return new Date().toISOString().split('T')[0];
    const parts = dateStr.split('/');
    if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
    return dateStr;
};

export const formatDateForDisplay = (isoDate: string) => {
    if (!isoDate) return new Date().toLocaleDateString('es-ES');
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
};

export const parseDate = (str: string) => {
    if (!str) return new Date();
    const [d, m, y] = str.split('/');
    return new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
};
