// file: middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/userSettings'];
const adminRoutes = ['/dashboard'];


export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

    // Redirect unauthenticated users from protected routes
    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
    if (token && pathname === '/login') {
        return NextResponse.redirect(new URL('/', request.url));
    }
    // Handle authorization for admin routes
    if (isAdminRoute) {
        const rolesCookie = request.cookies.get('roles')?.value;
        if (!rolesCookie) {
            return NextResponse.redirect(new URL('/unauthorized', request.url));
        }

        try {
            const roles: string[] = JSON.parse(rolesCookie);
            if (!roles.includes('ADMIN')) {
                return NextResponse.redirect(new URL('/unauthorized', request.url));
            }
        } catch (e) {
            return NextResponse.redirect(new URL('/login', request.url)); // Invalid roles cookie
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/dashboard', '/admin/:path*', '/admin', '/login']
};