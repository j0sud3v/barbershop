export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

export function authFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  return fetch(input, { ...init, credentials: "include" });
}
