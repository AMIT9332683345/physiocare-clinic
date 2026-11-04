import { NextRequest, NextResponse } from "next/server";
import { ipOf, noDatabase } from "@/lib/api-helpers";
import {
  clearLoginFailures,
  loginThrottle,
  makeCsrfToken,
  readSession,
  recordLoginFailure,
  setAuthCookies,
  verifyPassword,
} from "@/lib/auth";
import { adminCount, findAdmin } from "@/lib/db-admin";
import { mongoEnabled } from "@/lib/mongo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function GET() {
  const session = await readSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "unauthenticated" }, { status: 401 });
  }
  return NextResponse.json({ ok: true, email: session.email, csrf: makeCsrfToken(session.email) });
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  if (!mongoEnabled()) return noDatabase();

  const ip = ipOf(req);
  const throttle = loginThrottle(ip);
  if (!throttle.allowed) {
    return NextResponse.json(
      { ok: false, error: "too_many", message: `Too many attempts. Try again in ${throttle.retryIn}s.` },
      { status: 429 }
    );
  }

  const email = String(body.email ?? "").trim().toLowerCase().slice(0, 120);
  const password = String(body.password ?? "").slice(0, 200);

  if (!EMAIL.test(email) || password.length < 6) {
    return NextResponse.json(
      { ok: false, error: "invalid", message: "Enter a valid email and a password of at least 6 characters." },
      { status: 422 }
    );
  }

  let admin;
  try {
    admin = await findAdmin(email);
    if (!admin && (await adminCount()) === 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "not_seeded",
          message: "No admin account in the database yet. Run `npm run seed:admin` once to create the demo login.",
        },
        { status: 503 }
      );
    }
  } catch {
    return noDatabase();
  }

  if (!admin || !(await verifyPassword(password, admin.passwordHash))) {
    recordLoginFailure(ip);
    // Deliberately vague: never confirm which of the two was wrong.
    return NextResponse.json(
      { ok: false, error: "invalid", message: "Email or password is incorrect." },
      { status: 401 }
    );
  }

  const csrf = await setAuthCookies(admin.email);
  clearLoginFailures(ip);

  const next = typeof body.next === "string" && body.next.startsWith("/admin") ? body.next : "/admin";
  return NextResponse.json({
    ok: true,
    email: admin.email,
    csrf,
    redirectTo: next === "/admin/login" ? "/admin" : next,
  });
}
