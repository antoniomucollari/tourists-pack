// file: app/api/profile/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
    const token = (await cookies()).get('token')?.value;

    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Forward the request to your Spring backend with the token
        const springResponse = await fetch(`${process.env.SPRING_API_URL}/users/account`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!springResponse.ok) {
            throw new Error('Failed to fetch data from Spring Boot');
        }

        const data = await springResponse.json();
        return NextResponse.json(data);

    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}