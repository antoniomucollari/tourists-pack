import { NextRequest, NextResponse } from "next/server";
import {cookies} from "next/headers";

export const PUT = async (req: NextRequest) => {
    try {
        // Parse incoming multipart/form-data
        const body = await req.formData();

        // Create new FormData to forward
        const formData = new FormData();
        body.forEach((value, key) => {
            formData.append(key, value as any);
        });

        // Extract token from incoming cookies
        const token = (await cookies()).get('token')?.value;

        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // Forward request to Spring backend
        const res = await fetch(`${process.env.SPRING_API_URL}/users/update`, {
            method: "PUT",
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            const text = await res.text();
            return NextResponse.json({ success: false, message: text }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
};
