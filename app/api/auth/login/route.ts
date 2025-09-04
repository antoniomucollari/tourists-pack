// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Call your Spring Boot backend
        const springBootResponse = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await springBootResponse.json();

        // Check if the backend login was successful
        if (!springBootResponse.ok) {
            // Forward the error from the backend
            return NextResponse.json(
                { message: data.message || 'Authentication failed' },
                { status: springBootResponse.status }
            );
        }

        // The response from your Spring backend which includes the token and roles
        return NextResponse.json(data, { status: 200 });

    } catch (error) {
        console.error('Login API route error:', error);
        return NextResponse.json(
            { message: 'An internal server error occurred.' },
            { status: 500 }
        );
    }
}