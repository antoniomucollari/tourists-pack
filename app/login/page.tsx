// app/login/page.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter(); // Initialize the router

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); // Clear previous errors

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'Failed to login.');
                return;
            }

            // Login successful!
            // In a real app, you'd save the token (e.g., in context or cookies)
            console.log('Login successful:', data);

            // Redirect to a dashboard or home page
            router.push('/dashboard');

        } catch (err) {
            setError('An unexpected error occurred.');
            console.error(err);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
                <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
                    Login to Your Account
                </h1>
                <form onSubmit={handleSubmit}>
                    {/* Form fields remain the same */}
                    <div className="mb-4">
                        <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                            className="block w-full rounded-md border-gray-300 shadow-sm p-3"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                            className="block w-full rounded-md border-gray-300 shadow-sm p-3"
                        />
                    </div>
                    {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
                    <button type="submit" className="w-full rounded-md bg-indigo-600 py-3 text-sm font-semibold text-white">
                        Sign In
                    </button>
                </form>
                <p className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">Sign up</Link>
                </p>
            </div>
        </main>
    );
}