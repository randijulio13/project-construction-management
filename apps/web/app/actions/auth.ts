"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decodeJwt, ApiResponse, AuthResponse, RegisterRequest, LoginRequest, UserSession } from "@construction/shared";
import { fetchApi } from "@/lib/api-client";



export async function login(formData: FormData) {
    const email = formData.get("email");
    const password = formData.get("password");

    try {
        const data = await fetchApi<AuthResponse & ApiResponse>("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });

        if (!data.token) {
            return { error: data.error || data.message || "Login failed" };
        }

        // Example usage of shared utility
        const decoded = decodeJwt(data.token);
        console.log("Login successful for user:", decoded?.email);

        const cookieStore = await cookies();
        cookieStore.set("auth_token", data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24, // 1 day
            path: "/",
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Login failed";
        return { error: errorMessage };
    }

    redirect("/dashboard");
}

export async function register(formData: FormData) {
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
        await fetchApi<ApiResponse>("/auth/register", {
            method: "POST",
            body: JSON.stringify({ firstName, lastName, email, password }),
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Registration failed";
        return { error: errorMessage };
    }

    redirect("/login");
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");
    redirect("/login");
}

export async function getProfile() {
    try {
        const data = await fetchApi<ApiResponse<UserSession>>("/auth/profile");
        return { data: data.data };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch profile";
        return { error: errorMessage };
    }
}

export async function updatePassword(formData: FormData) {
    const currentPassword = formData.get("currentPassword");
    const newPassword = formData.get("newPassword");
    const confirmPassword = formData.get("confirmPassword");

    if (newPassword !== confirmPassword) {
        return { error: "Passwords do not match" };
    }

    try {
        const data = await fetchApi<ApiResponse>("/auth/update-password", {
            method: "POST",
            body: JSON.stringify({ currentPassword, newPassword }),
        });

        return { success: true, message: data.message };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to update password";
        return { error: errorMessage };
    }
}
