// Pequeno wrapper de fetch com baseURL e Bearer token
const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ?? "";

export function getAuthToken(): string | null {
  // Ajuste para onde você salva o token (cookie, localStorage, etc.)
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

type HttpOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  auth?: boolean; // se true, envia Authorization
};

export async function http<T>(
  path: string,
  { method = "GET", body, headers = {}, signal, auth = true }: HttpOptions = {}
): Promise<T> {
  const token = getAuthToken();

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    signal,
    credentials: "include", // remova se não precisar de cookies
  });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {}
    throw new Error(message);
  }

  // Tenta json, cai para void
  try {
    return (await res.json()) as T;
  } catch {
    return undefined as T;
  }
}
