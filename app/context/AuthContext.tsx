// context/AuthContext.tsx
"use client";
import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthData {
    token: string | null;
    roles: string[];
}

interface AuthContextType {
    auth: AuthData | null;
    login: (data: AuthData) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [auth, setAuth] = useState<AuthData | null>(null);

    const login = (data: AuthData) => {
        setAuth(data);
        // For persistence across page reloads, you would use localStorage or cookies
        localStorage.setItem('authData', JSON.stringify(data));
    };

    const logout = () => {
        setAuth(null);
        localStorage.removeItem('authData');
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};