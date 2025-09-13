import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        // Destructure all expected fields, including the new 'redirect' field from the frontend.
        const { name, email, password, phoneNumber, address, redirect } = body;

        // --- Security Check for Redirect URL ---
        // Validate that the redirect URL is a relative path to prevent open redirect attacks.
        // Default to a safe path '/' if it's missing or invalid.
        const redirectUrl = (redirect && String(redirect).startsWith('/')) ? redirect : '/';

        const registrationPayload = {
            name,
            email,
            password,
            phoneNumber,
            address,
            roles: ['CUSTOMER']
        };

        // Forward the registration request to your Spring Boot backend
        const springBootResponse = await fetch(`${process.env.SPRING_API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registrationPayload),
        });

        // If the backend returns an error, forward it to the client
        if (!springBootResponse.ok) {
            const errorData = await springBootResponse.json();
            return NextResponse.json({ message: errorData.message || 'Registration failed' }, { status: springBootResponse.status });
        }

        const data = await springBootResponse.json();

        // --- Include Redirect URL in the Response ---
        // Add the validated redirect URL to the successful response payload.
        const responsePayload = {
            ...data,
            redirect: redirectUrl
        };

        return NextResponse.json(responsePayload, { status: 201 });

    } catch (error) {
        console.error("API Route Error:", error);
        return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
    }
}

