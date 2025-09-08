'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import User from "@/domain/User";
import ApiResponse from "@/response/ApiResponse";

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: () => Promise<void>;
    logout: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch('/api/profile', { credentials: 'include' });
                if (res.ok) {
                    const data: ApiResponse<User> = await res.json();

                    const normalizedUser:User = {
                        ...data.data,
                        roles: data.data.roles
                    };

                    setUser(normalizedUser);
                }} catch (err) {
                console.error('Failed to load profile:', err);
            }
        };
        fetchProfile();
    }, []);

    // 🔑 Login: fetch profile from backend after authentication
    const login = async () => {
        try {
            const res = await fetch('/api/profile', { credentials: 'include' });
            if (!res.ok) throw new Error('Failed to fetch profile after login');
            const data = await res.json();
            setUser(data.data);
        } catch (err) {
            console.error('Login failed:', err);
        }
    };

    const logout = () => {
        fetch('/api/logout', { method: 'POST' }).finally(() => {
            setUser(null);
            window.location.href = '/login';
        });
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
