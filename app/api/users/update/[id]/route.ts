import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const userId = params.id;
        if (!userId) {
            return NextResponse.json({ message: 'User ID is missing' }, { status: 400 });
        }

        // Next.js automatically parses the multipart/form-data
        const formData = await request.formData();

        // The backend URL should be stored in environment variables
        const backendUrl = `${process.env.BACKEND_API_URL}/users/update/${userId}`;

        // Forward the request to the Spring Boot backend
        const response = await axios.put(backendUrl, formData, {
            headers: {
                Authorization: `Bearer ${userId}`,
            },
        });

        return NextResponse.json(response.data, { status: response.status });

    } catch (error: any) {
        console.error('API PROXY ERROR:', error);

        // Forward the error response from the backend if available
        if (error.response) {
            return NextResponse.json(
                { message: error.response.data.message || 'An error occurred during the update.' },
                { status: error.response.status }
            );
        }

        return NextResponse.json(
            { message: 'Internal Server Error in proxy.' },
            { status: 500 }
        );
    }
}