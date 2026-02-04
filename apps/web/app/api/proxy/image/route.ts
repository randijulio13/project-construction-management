import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get("path");

    if (!path) {
        return new NextResponse("Missing path parameter", { status: 400 });
    }

    // Use internal API URL (localhost) to fetch the image
    const apiUrl = process.env.API_URL || "http://localhost:4000";
    const imageUrl = `${apiUrl}${path}`;

    try {
        const response = await fetch(imageUrl);

        if (!response.ok) {
            return new NextResponse("Failed to fetch image", { status: response.status });
        }

        const contentType = response.headers.get("content-type");
        const buffer = await response.arrayBuffer();

        return new NextResponse(buffer, {
            headers: {
                "Content-Type": contentType || "image/jpeg",
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    } catch (error) {
        console.error("Image proxy error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
