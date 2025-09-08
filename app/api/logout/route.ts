// file: app/api/logout/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
    const response = NextResponse.json({ message: 'Logged out successfully' });

    // Instruct the browser to clear the cookies
    response.cookies.set('token', '', { path: '/', expires: new Date(0) });
    response.cookies.set('roles', '', { path: '/', expires: new Date(0) });

    return response;
}