'use client';

// import { Link } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Link from "next/link";

// --- Helper Types & Enums ---
enum Status {
    Loading = 'loading',
    Success = 'success',
    Error = 'error',
}

// Define types for the API response data
interface OrderDetails {
    id: number;
    paymentStatus: 'PAID' | 'COMPLETED' | 'PENDING' | 'FAILED';
    // Add other relevant order fields you want to display
}

interface VerifiedOrderResponse {
    statusCode: number;
    message: string;
    data: OrderDetails;
}

// --- Icon Components ---
const CheckCircleIcon = () => ( <svg className="h-24 w-24 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> );
const ExclamationCircleIcon = () => ( <svg className="h-24 w-24 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> );
const BackArrowIcon = () => ( <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg> );
const LoadingSpinner = () => ( <div className="animate-spin rounded-full h-24 w-24 border-b-4 border-blue-600 mx-auto"></div> );


export default function PaymentSuccessPage() {
    const [status, setStatus] = useState<Status>(Status.Loading);
    const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const gatewayOrderId = params.get('orderId');

        if (!gatewayOrderId) {
            setStatus(Status.Error);
            setError('No order ID found in URL.');
            return;
        }

        const verifyPayment = async () => {
            try {
                // CORRECTED: Point the fetch call to your Next.js API proxy
                const response = await fetch(`/api/orders/by-gateway-id/${gatewayOrderId}`, {
                    headers: {
                        // The Authorization header is no longer needed here.
                        // Your API proxy route adds it automatically from the secure cookie.
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    const errorResult = await response.json();
                    throw new Error(errorResult.message || `Failed to verify order. Status: ${response.status}`);
                }

                const result: VerifiedOrderResponse = await response.json();

                if (result.data && (result.data.paymentStatus === 'PAID' || result.data.paymentStatus === 'COMPLETED')) {
                    setOrderDetails(result.data);
                    setStatus(Status.Success);
                } else {
                    throw new Error(result.data.paymentStatus ? `Payment status is ${result.data.paymentStatus}.` : 'Payment confirmation is still pending.');
                }

            } catch (err) {
                setStatus(Status.Error);
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unexpected error occurred.');
                }
            }
        };

        verifyPayment();
    }, []);

    const renderContent = () => {
        switch (status) {
            case Status.Loading:
                return (
                    <>
                        <LoadingSpinner />
                        <h1 className="text-3xl font-bold text-gray-800 mt-4">Verifying Payment...</h1>
                        <p className="text-gray-600 mt-2">Please wait while we confirm your transaction.</p>
                    </>
                );
            case Status.Success:
                return (
                    <>
                        <CheckCircleIcon />
                        <h1 className="text-3xl font-bold text-gray-800 mt-4">Payment Successful!</h1>
                        <p className="text-gray-600 mt-2">Thank you! Your order has been confirmed.</p>
                        {orderDetails && (
                            <div className="mt-6 bg-gray-50 p-3 rounded-md text-sm">
                                <span className="font-semibold text-gray-700">Order Reference:</span>
                                <p className="text-gray-500 font-mono break-all">{orderDetails.id}</p>
                            </div>
                        )}
                        <Link href="/orders" className="mt-8 block w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition text-center">
                            View My Orders
                        </Link>
                    </>
                );
            case Status.Error:
                return (
                    <>
                        <ExclamationCircleIcon />
                        <h1 className="text-3xl font-bold text-gray-800 mt-4">Verification Failed</h1>
                        <p className="text-gray-600 mt-2">There was an issue confirming your payment.</p>
                        <div className="mt-6 bg-red-50 p-3 rounded-md text-sm text-red-700">
                            <p>{error}</p>
                        </div>
                        <a href="/support" className="mt-8 block w-full bg-gray-800 text-white font-semibold py-3 rounded-md hover:bg-gray-900 transition text-center">
                            Contact Support
                        </a>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-gray-100">
            <Link href="/" className="absolute top-6 left-6 flex items-center text-gray-700 bg-white py-2 px-4 rounded-lg shadow-md hover:bg-gray-50 transition">
                <BackArrowIcon />
                Go to Home
            </Link>
            <div className="bg-white p-8 md:p-12 rounded-lg shadow-xl text-center max-w-md mx-auto">
                {renderContent()}
            </div>
        </div>
    );
}
