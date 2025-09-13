"use client";

import React, { useState, FormEvent, ChangeEvent } from 'react';

export default function RegisterPage() {
    // --- State Management ---
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phoneNumber: '', // Added to match API
        address: '',     // Added to match API
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // --- Browser-native replacements for Next.js hooks ---
    // Mock router for standard browser navigation
    const router = {
        push: (path: string) => {
            if (typeof window !== 'undefined') {
                window.location.href = path;
            }
        }
    };
    // Use URLSearchParams for standard URL parsing
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams('');


    // --- Dynamic Redirect Logic ---
    // 1. Read the redirect parameter from the page's URL.
    const redirectUrl = searchParams.get('redirect');
    // 2. Create a dynamic href for the "Sign in" link to preserve the redirect context.
    const loginHref = redirectUrl ? `/login?redirect=${redirectUrl}` : '/login';

    // --- Handlers ---
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // 3. Send the redirectUrl to the backend in the request body.
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    redirect: redirectUrl || '/', // Provide a default fallback
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to register');
            }

            // 4. On success, prompt the user and redirect them to the login page.
            // The login link already contains the original redirect parameter.
            alert('Registration successful! Please sign in to continue.');
            router.push(loginHref);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
                <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
                    Create an Account
                </h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <p className="text-center text-sm text-red-600">{error}</p>}

                    <div>
                        <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" id="name" value={formData.name} onChange={handleChange} required className="block w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                    </div>

                    <div>
                        <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">Email Address</label>
                        <input type="email" id="email" value={formData.email} onChange={handleChange} required className="block w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                    </div>

                    <div>
                        <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" id="password" value={formData.password} onChange={handleChange} required className="block w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                    </div>

                    <div>
                        <label htmlFor="phoneNumber" className="mb-2 block text-sm font-medium text-gray-700">Phone Number</label>
                        <input type="tel" id="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required className="block w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                    </div>

                    <div>
                        <label htmlFor="address" className="mb-2 block text-sm font-medium text-gray-700">Address</label>
                        <input type="text" id="address" value={formData.address} onChange={handleChange} required className="block w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                    </div>

                    <button type="submit" disabled={isLoading} className="w-full rounded-md bg-indigo-600 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50">
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>
                <p className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    {/* 5. Use a standard <a> tag for the sign-in link */}
                    <a href={loginHref} className="font-medium text-indigo-600 hover:text-indigo-500">
                        Sign in
                    </a>
                </p>
            </div>
        </main>
    );
}

