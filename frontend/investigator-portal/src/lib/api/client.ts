/** Local dev: Vite proxy. Production (Vercel): set VITE_API_URL to your hosted FastAPI origin. */
const API = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api/v1`
  : "/api/v1";

function authHeaders(): HeadersInit {
  const token = localStorage.getItem("socmint_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...options.headers,
    },
  });
  if (res.status === 401) {
    localStorage.removeItem("socmint_token");
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Request failed");
  }
  return res.json();
}

export const api = {
  login: (username: string, password: string) =>
    request<{ access_token: string; username: string; role: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  listCases: () =>
    request<
      Array<{
        id: number;
        case_number: string;
        title: string;
        status: string;
        indicator_count: number;
        created_at: string;
      }>
    >("/cases"),

  createCase: (body: {
    title: string;
    description: string;
    seed_indicators: Array<{
      indicator_type: string;
      value: string;
      platform: string;
      label: string;
    }>;
  }) => request("/cases", { method: "POST", body: JSON.stringify(body) }),

  getCase: (id: number) => request(`/cases/${id}`),

  runAttribution: (body: unknown) =>
    request("/intelligence/attribution", { method: "POST", body: JSON.stringify(body) }),

  auditLogs: () => request<Array<Record<string, unknown>>>("/audit/logs"),
};
