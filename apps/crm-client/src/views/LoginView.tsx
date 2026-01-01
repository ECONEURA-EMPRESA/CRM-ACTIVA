import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Button } from '../components/ui/Button';
import { Lock, Mail, ArrowRight, Music, AlertCircle, Loader2 } from 'lucide-react';

export const LoginView = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            // App.tsx handles the redirect via onAuthStateChanged
        } catch (err: any) {
            console.error("Login failed", err);
            if (err.code === 'auth/invalid-credential') {
                setError("Credenciales incorrectas. Verifique su email y contraseña.");
            } else if (err.code === 'auth/too-many-requests') {
                setError("Demasiados intentos. Intente más tarde.");
            } else {
                setError("Error al iniciar sesión. Intente nuevamente.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-50 font-sans">
            {/* LEFT COLUMN - BRAND VISUAL */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-pink-900 opacity-90 z-10"></div>
                {/* Abstract Shapes Decoration */}
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-pink-600/20 blur-3xl animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

                <div className="relative z-20 text-white max-w-lg p-12 space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-bold tracking-wider uppercase">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Sistema Clínico v2.0
                    </div>

                    <h1 className="text-6xl font-black tracking-tight leading-tight">
                        La evolución de la <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">Musicoterapia</span>
                    </h1>

                    <p className="text-lg text-slate-300 leading-relaxed font-light">
                        Gestione pacientes, visualice el progreso cognitivo y automatice sus informes clínicos con la primera plataforma diseñada para el Método Activa.
                    </p>

                    <div className="grid grid-cols-2 gap-6 pt-8">
                        <div>
                            <h3 className="font-bold text-xl mb-1 flex items-center gap-2"><Music className="text-pink-400" /> Protocolos ISO</h3>
                            <p className="text-sm text-slate-400">Integración nativa de principios de identidad sonora.</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-xl mb-1 flex items-center gap-2"><Lock className="text-indigo-400" /> HIPAA Secure</h3>
                            <p className="text-sm text-slate-400">Encriptación de extremo a extremo para datos sensibles.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN - LOGIN FORM */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>

                <div className="w-full max-w-md space-y-8 animate-fade-in-up">
                    <div className="text-center lg:text-left">
                        <div className="inline-block p-3 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg shadow-pink-500/30 mb-6 lg:hidden">
                            <Music className="text-white w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Bienvenido de nuevo</h2>
                        <p className="text-slate-500 mt-2">Ingrese sus credenciales para acceder al panel.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 animate-scale-in">
                                <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={18} />
                                <p className="text-sm text-red-700 font-medium">{error}</p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Correo Electrónico</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-pink-600 transition-colors">
                                    <Mail size={20} />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all font-medium"
                                    placeholder="nombre@clinica.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-bold text-slate-700">Contraseña</label>
                                <a href="#" className="text-xs font-bold text-pink-600 hover:text-pink-700">¿Olvidó su clave?</a>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-pink-600 transition-colors">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all font-medium"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center items-center gap-2 py-4 px-6 border border-transparent rounded-xl text-sm font-bold text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 shadow-lg shadow-pink-500/30 transition-all transform hover:-translate-y-0.5 ${loading ? 'opacity-80 cursor-wait' : ''}`}
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <>Ingresar al Sistema <ArrowRight size={18} /></>}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-400">
                        ¿No tiene acceso? <a href="#" className="font-bold text-slate-600 hover:text-pink-600 transition-colors">Contacte al Administrador</a>
                    </p>
                </div>

                <div className="absolute bottom-6 text-center w-full text-xs text-slate-300">
                    &copy; 2026 Metodo Activa SaaS. Todos los derechos reservados.
                </div>
            </div>
        </div>
    );
};
