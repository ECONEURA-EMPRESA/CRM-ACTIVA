
import { useState, useEffect } from 'react';
import {
    onAuthStateChanged,
    User,
    signOut as firebaseSignOut,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '../lib/firebase';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [demoMode, setDemoMode] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
            if (currentUser) {
                setDemoMode(false);
                setError(null);
            }
        });
        return unsubscribe;
    }, []);

    const signIn = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err: any) {
            console.error("Login Failed:", err);
            setError(err.message || 'Error al iniciar sesión');
            setLoading(false);
        }
    };

    const signUp = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (err: any) {
            console.error("Registration Failed:", err);
            setError(err.message || 'Error al registrar usuario');
            setLoading(false);
        }
    };

    const signOut = async () => {
        setDemoMode(false);
        await firebaseSignOut(auth);
    };

    const enterDemoMode = () => {
        setDemoMode(true);
    };

    const signInWithGoogle = async () => {
        setLoading(true);
        setError(null);
        try {
            const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
        } catch (err: any) {
            console.error("Google Login Failed:", err);
            setError(err.message || 'Error al iniciar sesión con Google');
            setLoading(false);
        }
    };

    return { user, loading, error, demoMode, signIn, signUp, signInWithGoogle, signOut, enterDemoMode };
}
