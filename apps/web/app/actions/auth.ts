"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decodeJwt, ApiResponse, AuthResponse, RegisterRequest, LoginRequest, UpdatePasswordRequest, UserSession } from "@construction/shared";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function login(formData: FormData) {
    const email = formData.get("email");
    const password = formData.get("password");

    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    const data: AuthResponse & ApiResponse = await response.json();

    if (!response.ok || !data.token) {
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

    redirect("/dashboard");
}

export async function register(formData: FormData) {
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const email = formData.get("email");
    const password = formData.get("password");

    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
    });

    const data: ApiResponse = await response.json();

    if (!response.ok) {
        return { error: data.error || data.message || "Registration failed" };
    }

    redirect("/login");
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");
    redirect("/login");
}

export async function getProfile() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
        return { error: "Not authenticated" };
    }

    const response = await fetch(`${API_URL}/auth/profile`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });

    const data: ApiResponse<UserSession> = await response.json();

    if (!response.ok) {
        return { error: data.error || data.message || "Failed to fetch profile" };
    }

    return { data: data.data };
}

export async function updatePassword(formData: FormData) {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
        return { error: "Not authenticated" };
    }

    const currentPassword = formData.get("currentPassword");
    const newPassword = formData.get("newPassword");
    const confirmPassword = formData.get("confirmPassword");

    if (newPassword !== confirmPassword) {
        return { error: "Passwords do not match" };
    }

    const response = await fetch(`${API_URL}/auth/update-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data: ApiResponse = await response.json();

    if (!response.ok) {
        return { error: data.error || data.message || "Failed to update password" };
    }

    return { success: true, message: data.message };
}
