"use server";

import { Project } from "@construction/shared";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function getProjects(): Promise<Project[]> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        const response = await fetch(`${API_URL}/projects`, {
            headers: {
                "Authorization": `Bearer ${token}`
            },
            next: { revalidate: 0 } // No cache for now to ensure fresh data
        });

        if (!response.ok) {
            console.error("Failed to fetch projects:", await response.text());
            return [];
        }

        return await response.json();
    } catch (error) {
        console.error("Error in getProjects action:", error);
        return [];
    }
}
