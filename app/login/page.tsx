// file: app/login/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { ArrowLeft, Loader2, KeyRound, AtSign, UserPlus } from 'lucide-react';

export default function LoginPage() {
    const searchParams = useSearchParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const { login } = useAuth();
    const redirectUrl = searchParams.get('redirect') || '/';

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, redirect: redirectUrl }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to login");
            }

            await login();
            router.push(data.redirect || '/');
        } catch (err: any) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    const registerHref = redirectUrl
        ? `/register?redirect=${redirectUrl}`
        : '/register';

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-sm">
                <div className="bg-white py-5 rounded-xl shadow-md"> {/* Adjusted padding here */}
                    <div className="text-center mb-6 py-6"> {/* Added bottom margin */}
                        <h1 className="text-2xl font-bold text-gray-800 py">Welcome Back</h1>
                        <p className="text-gray-500 text-sm mt-1">Please sign in to continue.</p> {/* Smaller text */}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4"> {/* Adjusted spacing between elements */}
                        {error && (
                            <p className="text-center text-sm text-red-600 bg-red-50 p-3 rounded-md">
                                {error}
                            </p>
                        )}

                        {/* Email Input */}
                        <div style={{marginBottom:"20px", margin:"10px"}} className="relative my-12">
                            <AtSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /> {/* Smaller icon, centered */}
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Email"
                                className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-4 text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-red-500" // Adjusted padding, font size, ring
                            />
                        </div>

                        {/* Password Input */}
                        <div style={{marginBottom:"20px", margin:"10px"}}  className="relative">
                            <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /> {/* Smaller icon, centered */}
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Password"
                                className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-4 text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-red-500" // Adjusted padding, font size, ring
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            style={{ margin:"10px"}}
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" // Adjusted padding, font size
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" /> {/* Smaller loader icon */}
                                    <span>Logging in...</span>
                                </>
                            ) : (
                                'Login'
                            )}
                        </button>
                    </form>
                </div>

                <div style={{marginTop:"12px"}} className="mt-6 flex items-center justify-between text-sm"> {/* Added justify-between */}
                    <Link href="/" className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1.5 font-medium text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50">
                        <ArrowLeft className="h-4 w-4" />
                        <span>Home</span>
                    </Link>
                    <Link href={registerHref} className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1.5 font-medium text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50">
                        <span>Register</span>
                        <UserPlus className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </main>
    );
}