import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { RefreshCw } from 'lucide-react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex h-screen w-full items-center justify-center bg-slate-50 p-4">
                    <Card className="max-w-md w-full p-8 text-center border-red-100 shadow-xl">
                        <div className="mx-auto w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 text-3xl font-bold">!</div>
                        <h2 className="text-2xl font-black text-slate-800 mb-2">Algo salió mal</h2>
                        <p className="text-slate-500 mb-6">Ha ocurrido un error inesperado en la aplicación.</p>
                        <div className="bg-slate-50 p-3 rounded-lg text-xs text-left mb-6 overflow-auto max-h-32 text-slate-600 font-mono border border-slate-200">
                            {this.state.error?.message}
                        </div>
                        <Button onClick={() => window.location.reload()} icon={RefreshCw} className="w-full">
                            Recargar Aplicación
                        </Button>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}
