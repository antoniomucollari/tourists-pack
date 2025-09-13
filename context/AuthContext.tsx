'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import User from "@/domain/User";
import ApiResponse from "@/response/ApiResponse";
import { useRouter } from 'next/navigation';
import {Property} from "csstype";
import Order from "@/domain/Order";
import { X } from 'lucide-react';

interface AuthContextType {
    isAuthenticated: boolean;
    isAdmin: boolean;
    isCustomer: boolean; // Added isCustomer to the type definition
    isLoading: boolean;
    user: User | null;
    login: () => Promise<void>;
    logout: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isCustomer, setIsCustomer] = useState(false); // 1. Added state for isCustomer
    const [pendingOrderPrompt, setPendingOrderPrompt] = useState<Order | null>(null);
    const router = useRouter();

    //helper function
    const processUserData = (profileData: User | null): User | null => {
        if (!profileData) {
            return null;
        }
        const transformedRoles = profileData.roles.map(r => r.name);
        if (transformedRoles.includes('CUSTOMER') && !transformedRoles.includes('ADMIN'))  setIsCustomer(true);

        return {
            ...profileData,
            roles: transformedRoles,
        };
    };
    const fetchProfile = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/profile', { credentials: 'include' });
            if (!res.ok) {
                processUserData(null);
                return;
            }
            const apiResponse = await res.json();
            const rawUserData: User = apiResponse.data;
            const processedUser = processUserData(rawUserData);
            setUser(processedUser);

            const lastOrder = processedUser?.lastOrder;
            if (lastOrder && lastOrder.paymentStatus === 'PENDING') {
                console.log("Pending order found:", lastOrder);
                setPendingOrderPrompt(lastOrder);
            }
        } catch (err) {
            console.error('Failed to load profile:', err);
            processUserData(null);
        }finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchProfile();
    }, []);

    //  Login: fetch profile from backend after authentication
    const login = async () => {
        await fetchProfile();
    };

    const logout = () => {
        fetch('/api/logout', { method: 'POST' }).finally(() => {
            setUser(null);
            setIsAdmin(false);
            setIsCustomer(false); // 4. Reset isCustomer on logout
            setPendingOrderPrompt(null);

            router.push('/login');
        });
    };
    const handleContinueOrder = (order: Order) => {
        console.log("Continuing with order:", order.id);
        if (order.paymentUrl) {
            window.open(order.paymentUrl, '_blank');
        } else {
            alert('Payment link is not available.');
        }
        setPendingOrderPrompt(null);
    };
    const handleCancelOrder = async (order: Order) => {
        try {
            console.log(order)
            const res = await fetch(`/api/orders/cancel-order/${order.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                throw new Error('Failed to cancel order');
            }

            alert(`Order #${order.id} has been cancelled.`);
        } catch (err) {
            console.error(err);
            alert('Something went wrong while cancelling the order.');
        } finally {
            alert(`Order #${order.id} has been cancelled.`);
            setPendingOrderPrompt(null);
        }
        setPendingOrderPrompt(null);
    };
    return (
        <AuthContext.Provider value={{ isAuthenticated: !!user, isAdmin, isCustomer, isLoading, user, login, logout }}>
            {pendingOrderPrompt && (
                <div  className="fixed top-19 right-5 z-500000 bg-white p-6 rounded-lg shadow-lg border border-gray-300 max-w-sm">
            {/* Close button */}
                <button style={{cursor:"pointer"}} onClick={() => setPendingOrderPrompt(null)} className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600"><X className="w-4 h-4" />
        </button>

    <h3 className="font-bold text-lg mb-2">Continue your last order?</h3>
    <p className="text-sm text-gray-600 mb-4">
        You have an unpaid order for {pendingOrderPrompt.totalAmount} ALL. Would you like to complete the payment or start a new cart?
    </p>
    <div className="flex justify-end gap-3">
        <button
            onClick={() => handleCancelOrder(pendingOrderPrompt)}
            className="px-4 py-2 text-sm rounded-md bg-gray-200 hover:bg-gray-300"
        >
            Cancel It
        </button>
        <button
            onClick={() => handleContinueOrder(pendingOrderPrompt)}
            className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
        >
            Continue
        </button>
    </div>
</div>
            )}
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
