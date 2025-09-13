"use client";

import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
    const { user } = useAuth();

    if (!user) return <p>Loading...</p>;

    return (
        <div className="bg-gray-100 min-h-screen font-sans">
            <header className="flex justify-between items-center p-6 bg-white shadow-md">
                <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            </header>

            <main className="p-6 md:p-10">
                <div className="bg-white p-8 rounded-xl shadow-md mb-6">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Welcome!</h2>
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Your Role(s):</strong> {user.roles.map(obj => obj + " ")}</p>
                </div>
            </main>
        </div>
    );
}
