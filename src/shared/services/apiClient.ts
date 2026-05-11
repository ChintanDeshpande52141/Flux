import { Platform } from "react-native";
import { supabase } from "./supabaseClient";

// Platform-aware API URL: web uses localhost, mobile uses EXPO_PUBLIC_API_URL or emulator default
const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  (Platform.OS === "web"
    ? "http://localhost:3000/api/v1"
    : "http://10.0.2.2:3000/api/v1"); // Android emulator default

// Old single URL (for reference):
// const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";

async function getAuthHeaders(): Promise<HeadersInit> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token ?? "";
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function buildUrl(
  path: string,
  params?: Record<string, string | undefined>,
): string {
  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, value);
      }
    });
  }
  return url.toString();
}

async function handleResponse<T>(res: Response): Promise<T> {
  const json = await res.json();
  if (json.error) {
    const msg =
      typeof json.error === "string" ? json.error : JSON.stringify(json.error);
    throw new Error(msg);
  }
  return json.data as T;
}

export async function apiGet<T>(
  path: string,
  params?: Record<string, string | undefined>,
): Promise<T> {
  const headers = await getAuthHeaders();
  const res = await fetch(buildUrl(path, params), { method: "GET", headers });
  return handleResponse<T>(res);
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const headers = await getAuthHeaders();
  const res = await fetch(buildUrl(path), {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  return handleResponse<T>(res);
}

export async function apiPatch<T>(path: string, body: unknown): Promise<T> {
  const headers = await getAuthHeaders();
  const res = await fetch(buildUrl(path), {
    method: "PATCH",
    headers,
    body: JSON.stringify(body),
  });
  return handleResponse<T>(res);
}

export async function apiDelete(path: string): Promise<void> {
  const headers = await getAuthHeaders();
  const res = await fetch(buildUrl(path), { method: "DELETE", headers });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.error ?? `Delete failed with status ${res.status}`);
  }
}
