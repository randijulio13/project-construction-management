"use server";

import { fetchApi } from "@/lib/api-client";

export async function getUsers() {
    try {
        return await fetchApi<any[]>("/users", {
            revalidate: 0,
        });
    } catch (error) {
        console.error("Error in getUsers action:", error);
        return [];
    }
}
