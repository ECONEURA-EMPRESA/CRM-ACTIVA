import React, { createContext, useContext, useState, useEffect } from 'react';

type UserRole = 'admin' | 'therapist';

interface AuthContextType {
    role: UserRole;
    isAuthenticated: boolean;
    login: (role: UserRole) => void;
    logout: () => void;
    canDelete: boolean;
    canViewFinancials: boolean;
    canEditConfig: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Default to 'admin' for demo velocity, but capable of 'therapist'
    const [role, setRole] = useState<UserRole>('admin');
    const [isAuthenticated, setIsAuthenticated] = useState(true);

    // RBAC LOGIC
    const canDelete = role === 'admin';
    const canViewFinancials = role === 'admin';
    const canEditConfig = role === 'admin';

    const login = (newRole: UserRole) => {
        setRole(newRole);
        setIsAuthenticated(true);
    };

    const logout = () => setIsAuthenticated(false);

    return (
        <AuthContext.Provider value={{ role, isAuthenticated, login, logout, canDelete, canViewFinancials, canEditConfig }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
