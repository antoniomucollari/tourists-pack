// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        // Assuming 'CUSTOMER' is the default role for new sign-ups
        const registrationPayload = { ...body, roles: ['CUSTOMER'] };

        const springBootResponse = await fetch('http://localhost:8080/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registrationPayload),
        });

        const data = await springBootResponse.json();

        if (!springBootResponse.ok) {
            return NextResponse.json(
                { message: data.message || 'Registration failed' },
                { status: springBootResponse.status }
            );
        }

        return NextResponse.json(data, { status: 201 }); // 201 Created is often used for successful registration

    } catch (error) {
        console.error('Register API route error:', error);
        return NextResponse.json(
            { message: 'An internal server error occurred.' },
            { status: 500 }
        );
    }
}