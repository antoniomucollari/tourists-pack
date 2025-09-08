// file: app/api/login/route.js
import {NextRequest, NextResponse} from 'next/server';

export async function POST(request:NextRequest) {
    try {
        const { email, password } = await request.json();
        //
        const springBootResponse = await fetch(`${process.env.SPRING_API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!springBootResponse.ok) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        const data = await springBootResponse.json();
        const { token, roles } = data.data;

        const response = NextResponse.json({ roles: roles, message: "Login successful" });

        response.cookies.set({
            name: 'token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24, // 1 day
        });
        response.cookies.set({
            name: 'roles',
            value: JSON.stringify(roles),
            path: '/',
            maxAge: 60 * 60 * 24, // 1 day
        });

        return response;

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
    }
}