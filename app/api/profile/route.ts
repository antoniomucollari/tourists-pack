// file: app/api/profile/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

export async function GET() {
    const token = (await cookies()).get('token')?.value;

    if (!token) {
        return NextResponse.json({ message: 'Unauthorized: No token found' }, { status: 401 });
    }

    const apiUrl = process.env.SPRING_API_URL;
    if (!apiUrl) {
        console.error("Critical: SPRING_API_URL environment variable is not set.");
        return NextResponse.json({ message: 'Internal Server Error: API URL not configured' }, { status: 500 });
    }
    try {
        const springResponse = await axios.get(`${apiUrl}/users/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return NextResponse.json(springResponse.data);

    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            console.error("🔴 ERROR FROM SPRING BACKEND:", {
                status: error.response.status,
                data: error.response.data
            });
            return NextResponse.json(
                { message: 'Error from backend service', error: error.response.data },
                { status: error.response.status }
            );
        } else {
            console.error('🔴 UNEXPECTED NETWORK/SERVER ERROR:', error);
            return NextResponse.json(
                { message: 'Internal Server Error', error: (error as Error).message },
                { status: 500 }
            );
        }
    }
}