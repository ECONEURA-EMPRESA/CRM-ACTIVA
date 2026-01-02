import React, { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import dashboardBg from '../assets/dashboard-bg-metallic.png';

interface AppLayoutProps {
    children: ReactNode;
    currentView: string;
    onNavigate: (view: string) => void;
    userEmail?: string;
    onLogout: () => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
    children,
    currentView,
    onNavigate,
    userEmail
}) => {
    return (
        <div className="flex min-h-screen relative overflow-hidden bg-slate-100 font-sans">
            {/* GLOBAL METALLIC DASHBOARD BACKGROUND */}
            <div className="fixed inset-0 z-0">
                <img
                    src={dashboardBg}
                    alt="Clinical Metallic Atmosphere"
                    className="w-full h-full object-cover opacity-60"
                />
                {/* White overlay for content readability */}
                <div className="absolute inset-0 bg-white/40 pointer-events-none"></div>
            </div>

            <Sidebar currentView={currentView} onNavigate={onNavigate} userEmail={userEmail} />

            <main className="flex-1 relative z-10 transition-all duration-300 overflow-y-auto h-screen">
                <div className="container mx-auto p-4 md:p-8 lg:p-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {children}
                </div>
            </main>
        </div>
    );
};
