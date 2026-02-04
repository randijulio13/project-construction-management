"use server";

import { fetchApi } from "@/lib/api-client";
import { CreateSalesOrderInput, SalesOrder } from "@construction/shared";
import { revalidatePath } from "next/cache";

export async function createSalesOrder(data: CreateSalesOrderInput) {
    try {
        const result = await fetchApi<SalesOrder>("/sales", {
            method: "POST",
            body: JSON.stringify(data),
        });
        revalidatePath("/(dashboard)/projects", "layout");
        return { success: true, data: result };
    } catch (error) {
        console.error("Error in createSalesOrder action:", error);
        const errorMessage =
            error instanceof Error ? error.message : "An unexpected error occurred";
        return { success: false, error: errorMessage };
    }
}

export async function getSalesOrders(): Promise<SalesOrder[]> {
    try {
        const result = await fetchApi<SalesOrder[]>("/sales", {
            revalidate: 0,
        });
        revalidatePath("/(dashboard)/projects", "layout");
        return result;
    } catch (error) {
        console.error("Error in getSalesOrders action:", error);
        return [];
    }
}

export async function getSalesOrderById(id: string): Promise<SalesOrder | null> {
    try {
        return await fetchApi<SalesOrder>(`/sales/${id}`, {
            revalidate: 0,
        });
    } catch (error) {
        console.error(`Error in getSalesOrderById action for ID ${id}:`, error);
        return null;
    }
}

export async function addSalesDocument(orderId: string, formData: FormData) {
    try {
        const result = await fetchApi<any>(`/sales/${orderId}/documents`, {
            method: "POST",
            body: formData,
        });
        revalidatePath("/(dashboard)/projects", "layout");
        return { success: true, data: result };
    } catch (error) {
        console.error(`Error in addSalesDocument action for order ${orderId}:`, error);
        const errorMessage =
            error instanceof Error ? error.message : "An unexpected error occurred";
        return { success: false, error: errorMessage };
    }
}
