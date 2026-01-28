"use server";

import {
  Project,
  CreateProjectOutput,
  ProjectUnit,
} from "@construction/shared";
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

export async function getProjectById(id: string): Promise<Project | null> {
  try {
    return await fetchApi<Project>(`/projects/${id}`, {
      revalidate: 0,
    });
  } catch (error) {
    console.error(`Error in getProjectById action for ID ${id}:`, error);
    return null;
  }
}

export async function updateProjectSiteplan(id: string, formData: FormData) {
  try {
    const result = await fetchApi<Project>(`/projects/${id}`, {
      method: "PUT",
      body: formData,
    });
    return { success: true, data: result };
  } catch (error) {
    console.error(`Error in updateProjectSiteplan action for ID ${id}:`, error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return { success: false, error: errorMessage };
  }
}

export async function updateUnit(projectId: string, unitId: string, data: any) {
  try {
    const result = await fetchApi<any>(
      `/projects/${projectId}/units/${unitId}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
    );
    return { success: true, data: result };
  } catch (error) {
    console.error(`Error in updateUnit action for ID ${unitId}:`, error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return { success: false, error: errorMessage };
  }
}

export async function createProjectUnit(projectId: string, data: any) {
  try {
    const result = await fetchApi<any>(`/projects/${projectId}/units`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return { success: true, data: result };
  } catch (error) {
    console.error(
      `Error in createProjectUnit action for project ${projectId}:`,
      error,
    );
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return { success: false, error: errorMessage };
  }
}

export async function getUnitById(
  projectId: string,
  unitId: string,
): Promise<ProjectUnit | null> {
  try {
    return await fetchApi<ProjectUnit>(
      `/projects/${projectId}/units/${unitId}`,
      {
        revalidate: 0,
      },
    );
  } catch (error) {
    console.error(`Error in getUnitById action for ID ${unitId}:`, error);
    return null;
  }
}
