import { token } from "./auth";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

// 仅 401/403 视为鉴权失效;5xx/网络错误(status=0)不应销毁有效会话
export const isAuthError = (e: unknown): e is ApiError =>
  e instanceof ApiError && (e.status === 401 || e.status === 403);

export async function api<T = unknown>(
  path: string,
  opts: { method?: string; body?: unknown; auth?: boolean } = {},
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (opts.auth) {
    const t = token.get();
    if (t) headers.Authorization = `Bearer ${t}`;
  }
  let res: Response;
  try {
    res = await fetch("/api" + path, {
      method: opts.method ?? "GET",
      headers,
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    });
  } catch {
    throw new ApiError("网络连接失败，请检查网络后重试", 0);
  }
  let data: unknown = null;
  try {
    data = await res.json();
  } catch {}
  if (!res.ok) {
    const d = data as { error?: { message?: string }; detail?: string } | null;
    throw new ApiError(d?.error?.message || d?.detail || `请求失败 (${res.status})`, res.status);
  }
  return data as T;
}
