import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { email, password, redirect } = await request.json();

        // Extract redirect param from query string
        const redirectUrl = redirect && redirect.startsWith('/') ? redirect : '/';

        // Forward credentials to Spring Boot backend
        const springBootResponse = await fetch(`${process.env.SPRING_API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!springBootResponse.ok) {
            const text = await springBootResponse.text();
            console.error("Spring login error:", text);

            return NextResponse.json(
                { message: springBootResponse.status === 401 ? "Invalid credentials" : "Login failed" },
                { status: springBootResponse.status }
            );
        }

        const data = await springBootResponse.json();
        const { token, roles } = data.data;

        const response = NextResponse.json({
            message: "Login successful",
            roles,
            redirect: redirectUrl,
        });

        // Secure cookie for JWT token
        response.cookies.set({
            name: "token",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24, // 1 day
        });

        response.cookies.set({
            name: "roles",
            value: JSON.stringify(roles),
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24, // 1 day
        });

        return response;
    } catch (error) {
        console.error("Login API error:", error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
