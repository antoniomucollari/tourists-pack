import { ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '403 Access Denied',
    description: 'You do not have permission to view this page.',
};

export default function UnauthorizedPage() {
    return (
        // {/* Changed: Softer page background for better contrast */}
        <main className="flex min-h-screen w-full flex-col items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">

            {/* Changed: Adjusted card background for the new theme */}
            <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg dark:bg-slate-900">

                {/* Changed: Using your custom red color for the icon */}
                <ShieldAlert className="mx-auto h-16 w-16 text-[#e60000]" />

                {/* Changed: Adjusted text colors for better readability on new backgrounds */}
                <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
                    Access Denied
                </h1>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                    Sorry, you don't have the necessary permissions to access this page.
                    Please contact an administrator if you believe this is an error.
                </p>
                <div className="mt-8">
                    <Link
                        href="/"
                        // {/* Changed: Button now uses the custom red and matching focus ring */}
                        className="inline-block rounded-md bg-[#e60000] px-6 py-3 text-base font-medium text-white shadow-sm transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-900"
                    >
                        Go to Homepage
                    </Link>
                </div>
            </div>
        </main>
    );
}