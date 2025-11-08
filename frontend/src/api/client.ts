const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5202";

export interface ApiOptions extends RequestInit {
  requiresAuth?: boolean;
}

export async function apiFetch<TResponse>(
  path: string,
  options: ApiOptions = {}
): Promise<TResponse> {
  const url = path.startsWith("http")
    ? path
    : `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (options.requiresAuth) {
    const stored = localStorage.getItem("indigotest_auth");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as { token: string };
        (headers as any).Authorization = `Bearer ${parsed.token}`;
      } catch {
        // ignore parse error
      }
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `API error ${response.status}: ${text || response.statusText}`
    );
  }

  if (response.status === 204) {
    return null as TResponse;
  }

  return (await response.json()) as TResponse;
}
