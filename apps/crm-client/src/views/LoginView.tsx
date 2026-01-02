import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, signInAnonymously } from 'firebase/auth';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Loader2, Music, CheckCircle2, ShieldCheck } from 'lucide-react';

export const LoginView = ({ onLogin, onDemoLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const auth = getAuth();

        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Auth state listener in App.tsx will handle the rest
        } catch (err) {
            console.error("Login error:", err);
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                setError('Credenciales incorrectas. Verifique su correo y contraseña.');
            } else if (err.code === 'auth/too-many-requests') {
                setError('Muchos intentos fallidos. Intente más tarde.');
            } else {
                setError('Error al iniciar sesión. Intente nuevamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDemo = async () => {
        setLoading(true);
        try {
            await onDemoLogin();
        } catch (err) {
            setError('No se pudo iniciar el modo demo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-[#F3F6F9] font-['Inter']">
            {/* SECCIÓN IZQUIERDA - BRANDING (Oculta en móviles) */}
            <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center p-12">
                {/* Fondo con efectos */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#1e1b4b] to-[#310b1e] z-0"></div>
                <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-0"></div>
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

                <div className="relative z-10 max-w-lg">
                    <div className="mb-8 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Sistema Clínico v2.0
                    </div>
                    <h1 className="text-5xl font-black text-white mb-6 leading-tight tracking-tight">
                        La evolución de <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">la Musicoterapia</span>
                    </h1>
                    <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                        Gestione pacientes, visualice el progreso cognitivo y automatice sus informes clínicos con la primera plataforma diseñada para el Método Activa.
                    </p>

                    <div className="grid grid-cols-2 gap-6 mt-12">
                        <div className="flex flex-col gap-2">
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-pink-400 mb-2">
                                <Music size={20} />
                            </div>
                            <h3 className="text-white font-bold">Protocolos ISO</h3>
                            <p className="text-sm text-slate-400">Integración nativa de principios de identidad sonora.</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-indigo-400 mb-2">
                                <ShieldCheck size={20} />
                            </div>
                            <h3 className="text-white font-bold">HIPAA Secure</h3>
                            <p className="text-sm text-slate-400">Encriptación de extremo a extremo para datos sensibles.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECCIÓN DERECHA - LOGIN FORM */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
                <div className="absolute top-0 right-0 w-full h-full bg-white/50 backdrop-blur-3xl z-0 lg:hidden"></div>

                <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white/50 relative z-10">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-black text-slate-900 mb-2">Bienvenido de nuevo</h2>
                        <p className="text-slate-500">Ingrese sus credenciales para acceder al panel.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide ml-1">Correo Electrónico</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-pink-600 transition-colors" size={18} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all placeholder:text-slate-400"
                                    placeholder="nombre@clinica.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Contraseña</label>
                                <a href="#" className="text-xs font-bold text-pink-600 hover:text-pink-700">¿Olvidó su clave?</a>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-pink-600 transition-colors" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-11 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all placeholder:text-slate-400"
                                    placeholder="••••••••••••"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600">
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 text-red-700 text-sm animate-in slide-in-from-top-2">
                                <div className="min-w-[4px] h-4 mt-0.5 rounded-full bg-red-500"></div>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#EC008C] to-[#be0070] text-white font-bold py-4 rounded-xl shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/40 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <>Ingresar al Sistema <ArrowRight size={18} /></>}
                        </button>
                    </form>

                    <div className="mt-8 relative flex py-5 items-center">
                        <div className="flex-grow border-t border-slate-200"></div>
                        <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-bold uppercase">O continúe como</span>
                        <div className="flex-grow border-t border-slate-200"></div>
                    </div>

                    <button
                        onClick={handleDemo}
                        disabled={loading}
                        className="w-full bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2 text-sm shadow-sm"
                    >
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Acceso Demo / Invitado
                    </button>

                    <p className="mt-8 text-center text-xs text-slate-400 font-medium">
                        ¿No tiene acceso? <a href="#" className="text-slate-600 font-bold hover:text-slate-800">Contacte al Administrador</a>
                    </p>
                </div>

                <div className="absolute bottom-6 text-center w-full text-[10px] text-slate-400/60 font-medium">
                    © 2026 Método Activa SaaS. Todos los derechos reservados.
                </div>
            </div>
        </div>
    );
};
