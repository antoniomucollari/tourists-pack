// file: middleware.ts purpose-> protecting pages on the server before they are rendered
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import product from "@/domain/Product";

const protectedRoutes = ['/userSettings', '/orders'];
const adminRoutes = ['/dashboard','/products'];


export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    function isAdminRoute(pathname: string) {
        return adminRoutes.some(route =>
            pathname === route || pathname.startsWith(route + '/')
        );
    }

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
    matcher: ['/dashboard/:path*', '/dashboard', '/admin/:path*', '/admin', '/login', '/products/:path*', '/products']
};
