"use client";

/**
 * Every admin mutation sends the CSRF token that the server put in the
 * `pc_csrf` cookie when the session was created (double-submit pattern).
 */
export function csrfToken(): string {
  const hit = document.cookie.match(/(?:^|;\s*)pc_csrf=([^;]*)/);
  return hit ? decodeURIComponent(hit[1]) : "";
}

export type ApiResult = {
  ok?: boolean;
  message?: string;
  errors?: string[];
  [key: string]: unknown;
};

export async function api<T extends ApiResult = ApiResult>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      "x-csrf-token": csrfToken(),
      ...(init.body ? { "content-type": "application/json" } : {}),
      ...init.headers,
    },
  });

  let data: ApiResult = {};
  try {
    data = (await res.json()) as ApiResult;
  } catch {
    throw new Error(`Server returned no response (${res.status}).`);
  }

  if (!res.ok || data.ok === false) {
    const detail = (data.errors ?? []).join(" ") || data.message || `Request failed (${res.status}).`;
    const err = new Error(detail) as Error & { code?: string };
    err.code = typeof data.error === "string" ? data.error : undefined;
    if (err.code === "unauthenticated" && !location.pathname.endsWith("/admin/login")) {
      location.href = `/admin/login?next=${encodeURIComponent(location.pathname)}`;
    }
    throw err;
  }
  return data as T;
}

export const json = (body: unknown, method = "POST"): RequestInit => ({
  method,
  body: JSON.stringify(body),
});
