import { NextResponse } from "next/server";
import { checkCsrf, readSession } from "./auth";
import { mongoEnabled } from "./mongo";

/**
 * Shared plumbing for admin endpoints: proves the session cookie, checks the
 * CSRF header, and turns "not configured" into a readable response instead of
 * a 500 that the operator cannot diagnose.
 */
export async function adminGuard(
  req: Request
): Promise<{ session: { email: string; exp: number }; response: null } | { session: null; response: NextResponse }> {
  const session = await readSession();
  if (!session) return { session: null, response: unauthorized() };
  if (!(await checkCsrf(req))) return { session: null, response: csrfFailed() };
  return { session, response: null };
}

export function ipOf(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}

export function unauthorized() {
  return NextResponse.json(
    { ok: false, error: "unauthenticated", message: "Your session ended — sign in again." },
    { status: 401 }
  );
}

export function csrfFailed() {
  return NextResponse.json(
    { ok: false, error: "csrf", message: "Blocked: security token mismatch. Reload the page and try again." },
    { status: 403 }
  );
}

export function noDatabase() {
  return NextResponse.json(
    {
      ok: false,
      error: "database_unavailable",
      message: mongoEnabled()
        ? "MongoDB is configured but unreachable — check the Atlas network allowlist for this host."
        : "MONGODB_URI is not set on this deployment. Add it in Vercel and Render environment variables.",
    },
    { status: 503 }
  );
}

export function badRequest(errors: string[]) {
  return NextResponse.json({ ok: false, error: "validation", errors }, { status: 422 });
}

export function ok(payload: Record<string, unknown> = {}) {
  return NextResponse.json({ ok: true, ...payload });
}
