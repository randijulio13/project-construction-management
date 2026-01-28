import { cookies } from "next/headers";

import { API_URL } from "./constants";

type FetchOptions = RequestInit & {
  params?: Record<string, string>;
  revalidate?: number | false;
};

/**
 * Enhanced fetch utility for Server Actions.
 * Automatically handles auth token and standard headers.
 */
export async function fetchApi<T = unknown>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  const { params, headers, revalidate, ...rest } = options;

  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  // Build URL with query params
  let url = endpoint.startsWith("http") ? endpoint : `${API_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  const defaultHeaders: Record<string, string> = {};

  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  if (rest.body && !(rest.body instanceof FormData)) {
    defaultHeaders["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    ...rest,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    next: revalidate !== undefined ? { revalidate } : rest.next,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage =
      errorData.message ||
      errorData.error ||
      `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  // Handle empty responses
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  }

  return {} as T;
}
