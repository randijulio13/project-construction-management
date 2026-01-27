"use server";

import { Project, CreateProjectOutput } from "@construction/shared";
import { fetchApi } from "@/lib/api-client";

export async function getProjects(): Promise<Project[]> {
  try {
    return await fetchApi<Project[]>("/projects", {
      revalidate: 0,
    });
  } catch (error) {
    console.error("Error in getProjects action:", error);
    return [];
  }
}

export async function createProject(data: CreateProjectOutput | FormData) {
  try {
    const isFormData = data instanceof FormData;
    const body = isFormData ? data : JSON.stringify(data);

    const result = await fetchApi<Project>("/projects", {
      method: "POST",
      body,
    });

    return { success: true, data: result };
  } catch (error) {
    console.error("Error in createProject action:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return { success: false, error: errorMessage };
  }
}
