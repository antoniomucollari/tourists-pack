import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, password, phoneNumber, address } = body;
        const registrationPayload = {
            name,
            email,
            password,
            phoneNumber,
            address,
            roles: ['CUSTOMER']
        };

        const springBootResponse = await fetch(`${process.env.SPRING_API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registrationPayload),
        });

        if (!springBootResponse.ok) {
            const errorData = await springBootResponse.json();
            return NextResponse.json({ message: errorData.message || 'Registration failed' }, { status: springBootResponse.status });
        }

        const data = await springBootResponse.json();

        return NextResponse.json(data, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
    }
}