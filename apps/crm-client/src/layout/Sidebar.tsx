import React, { useState } from 'react';
import {
    Users, Calendar, Activity, Settings, LogOut,
    Menu, X, Sparkles, FileText, ChevronLeft, ChevronRight,
    Fingerprint
} from 'lucide-react';
import { useAuth } from '../auth/useAuth';
import logoCircular from '../assets/logo-circular.png';

interface SidebarProps {
    currentView: string;
    onNavigate: (view: string) => void;
    userEmail?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, userEmail }) => {
    const { signOut } = useAuth();
    const [collapsed, setCollapsed] = useState(false);

    const menuItems = [
        { id: 'dashboard', label: 'Panel Principal', icon: Activity },
        { id: 'patients', label: 'Pacientes', icon: Users },
        { id: 'sessions', label: 'Sesiones', icon: Sparkles },
        { id: 'calendar', label: 'Agenda', icon: Calendar },
        { id: 'resources', label: 'Recursos', icon: FileText },
        { id: 'settings', label: 'Configuración', icon: Settings },
    ];

    return (
        <aside
            className={`
                h-screen sticky top-0 transition-all duration-500 ease-out z-50
                ${collapsed ? 'w-24' : 'w-80'}
                flex flex-col
                border-r border-slate-200
                bg-white/80 backdrop-blur-xl relative shadow-2xl
            `}
        >
            {/* Glossy Overlay for Metallic Feel */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-slate-100/20 pointer-events-none"></div>

            {/* Header: PREMIUM CIRCULAR LOGO (Small and Circular as requested) */}
            <div className={`p-6 flex items-center ${collapsed ? 'justify-center' : 'justify-between'} border-b border-slate-200/60 relative z-10`}>
                <div className={`flex items-center gap-3 transition-all duration-300 ${collapsed ? 'scale-90' : ''}`}>
                    <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-br from-pink-500/20 to-transparent flex items-center justify-center shadow-md shadow-pink-500/10 ring-1 ring-white overflow-hidden">
                        <img
                            src={logoCircular}
                            alt="Activa Logo"
                            className="w-full h-full object-cover rounded-full"
                        />
                    </div>

                    {!collapsed && (
                        <div className="flex flex-col justify-center animate-in fade-in slide-in-from-left-2 duration-500">
                            <span className="text-sm font-black tracking-widest text-slate-800 leading-none">ACTIVA</span>
                            <span className="text-[0.55rem] font-bold text-[#EC008C] uppercase tracking-[0.2em]">Enterprise</span>
                        </div>
                    )}
                </div>

                {!collapsed && (
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors border border-slate-200 shadow-sm"
                    >
                        <ChevronLeft size={14} />
                    </button>
                )}
            </div>

            {/* Toggle for collapsed mode */}
            {collapsed && (
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="mx-auto mt-4 w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors border border-slate-200 shadow-sm"
                >
                    <ChevronRight size={14} />
                </button>
            )}

            {/* Navigation */}
            <nav className="flex-1 py-6 space-y-2 px-3 overflow-y-auto custom-scrollbar relative z-10">
                {menuItems.map((item) => {
                    const isActive = currentView === item.id || (item.id === 'sessions' && currentView === 'group-sessions');
                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={`
                                w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative
                                ${isActive
                                    ? 'bg-gradient-to-r from-slate-100 to-white text-[#EC008C] shadow-md shadow-slate-200 border border-slate-200'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 border border-transparent'
                                }
                                ${collapsed ? 'justify-center px-0' : ''}
                            `}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-[#EC008C] rounded-r-full shadow-[0_0_8px_#EC008C]"></div>
                            )}

                            <item.icon
                                size={20}
                                strokeWidth={isActive ? 2.5 : 2}
                                className={`transition-transform duration-300 ${isActive ? 'scale-110 drop-shadow-sm' : 'group-hover:scale-110'}`}
                            />

                            {!collapsed && (
                                <span className={`font-medium text-sm tracking-wide ${isActive ? 'font-bold' : ''}`}>
                                    {item.label}
                                </span>
                            )}

                            {collapsed && (
                                <div className="absolute left-20 bg-white text-slate-800 px-4 py-2 rounded-xl text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-xl border border-slate-100 translate-x-2 group-hover:translate-x-0 duration-200 pointer-events-none">
                                    {item.label}
                                </div>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* User Footer */}
            <div className="p-4 border-t border-slate-200/60 relative z-10">
                <div className={`
                    flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 border border-slate-200/50
                    ${collapsed ? 'justify-center p-2' : ''}
                `}>
                    <div className="relative">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-200 to-slate-300 flex items-center justify-center text-xs font-bold text-slate-600 shadow-inner ring-2 ring-white">
                            {userEmail?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                    </div>

                    {!collapsed && (
                        <div className="flex-1 overflow-hidden">
                            <p className="text-xs font-bold text-slate-700 truncate tracking-wide">
                                {userEmail?.split('@')[0]}
                            </p>
                            <div className="flex items-center gap-1 mt-0.5">
                                <Fingerprint size={10} className="text-emerald-500" />
                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Verificado</span>
                            </div>
                        </div>
                    )}

                    {!collapsed && (
                        <button
                            onClick={signOut}
                            className="p-1.5 rounded-lg hover:bg-white text-slate-400 hover:text-red-500 transition-all border border-transparent hover:border-slate-100 hover:shadow-sm"
                            title="Cerrar Sesión"
                        >
                            <LogOut size={16} />
                        </button>
                    )}
                </div>
            </div>
        </aside>
    );
};
