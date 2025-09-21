// file: app/api/[...slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios, { AxiosError } from "axios";

const BACKEND_URL = process.env.SPRING_API_URL;

async function handler(req: NextRequest, { params }: { params: { slug: string[] } }) {
    if (!BACKEND_URL) {
        console.error("SPRING_API_URL is not set in environment variables.");
        return NextResponse.json(
            { message: "Backend service URL is not configured." },
            { status: 500 }
        );
    }

    const token = (await cookies()).get("token")?.value;
    const path = (await params).slug.join('/');
    const url = `${BACKEND_URL}/${path}${req.nextUrl.search}`;

    const headers: Record<string, string> = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log(`[API Proxy] Forwarding to ${url} WITH Authorization header.`);
    } else {
        console.log(`[API Proxy] Forwarding to ${url} WITHOUT Authorization header.`);
    }

    const bodyText = await req.text();
    let body: any;
    try {
        body = bodyText ? JSON.parse(bodyText) : undefined;
    } catch {
        body = bodyText;
    }

    try {
        const response = await axios({
            url,
            method: req.method,
            headers,
            data: body,
            timeout: 10000,
        });

        return NextResponse.json(response.data, { status: response.status });

    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            console.error(`[API Proxy] Error from backend (${error.response.status}):`, error.response.data);
            return NextResponse.json(error.response.data, { status: error.response.status });
        }

        console.error("[API Proxy] Network or unhandled error:", error);
        return NextResponse.json(
            { message: "Could not connect to the backend service." },
            { status: 502 }
        );
    }
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };

