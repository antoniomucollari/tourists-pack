// file: app/api/[...slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.SPRING_API_URL;

async function handler(req: NextRequest, { params }: { params: { slug: string[] } }) {
    const token = (await cookies()).get("token")?.value;

    const path = ((params).slug ?? []).join('/');

    // Forward query parameters
    const query = req.nextUrl.search; // includes '?' if present
    const url = `${BACKEND_URL}/${path}${query}`; // append query string

    const headers: HeadersInit = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    let body: BodyInit | undefined = undefined;
    if (req.method !== "GET" && req.method !== "HEAD") {
        try {
            body = JSON.stringify(await req.json());
        } catch {
            // no body or invalid JSON, ignore
        }
    }

    try {
        const response = await fetch(url, {
            method: req.method,
            headers,
            body,
        });

        // try parse JSON, fallback to text
        let data: any;
        const text = await response.text();
        try {
            data = JSON.parse(text);
        } catch {
            data = text;
        }

        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("API proxy error:", error);
        return NextResponse.json(
            { message: "An error occurred while proxying the request." },
            { status: 500 }
        );
    }
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
