import { NextRequest, NextResponse } from "next/server";
import { adminGuard, badRequest, noDatabase, ok } from "@/lib/api-helpers";
import { hashPassword, setAuthCookies, verifyPassword } from "@/lib/auth";
import { findAdmin, saveAdmin } from "@/lib/db-admin";
import { mongoEnabled } from "@/lib/mongo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** What the current login is, so the UI can show it without exposing the hash. */
export async function GET(req: NextRequest) {
  const { session, response } = await adminGuard(req);
  if (!session) return response;
  return NextResponse.json({ ok: true, email: session.email });
}

/** Change the sign-in email, the password, or both. Current password always required. */
export async function POST(req: NextRequest) {
  const { session, response } = await adminGuard(req);
  if (!session) return response;
  if (!mongoEnabled()) return noDatabase();

  const body = await req.json().catch(() => ({}));
  const current = String(body.currentPassword ?? "").slice(0, 200);
  const nextEmail = String(body.email ?? "").trim().toLowerCase().slice(0, 120);
  const nextPassword = String(body.password ?? "").slice(0, 200);
  const confirm = String(body.confirmPassword ?? "").slice(0, 200);

  const errors: string[] = [];
  if (!EMAIL.test(nextEmail)) errors.push("Enter a valid email address.");
  if (nextPassword.length < 10) errors.push("New password must be at least 10 characters.");
  if (nextPassword !== confirm) errors.push("The two new passwords do not match.");
  if (nextPassword && current === nextPassword) errors.push("New password must differ from the current one.");
  if (errors.length) return badRequest(errors);

  try {
    const admin = await findAdmin(session.email);
    if (!admin || !(await verifyPassword(current, admin.passwordHash))) {
      return NextResponse.json(
        { ok: false, error: "invalid", message: "Current password is incorrect." },
        { status: 401 }
      );
    }

    const clash = nextEmail !== admin.email ? await findAdmin(nextEmail) : null;
    if (clash) {
      return badRequest(["That email is already used by another admin account."]);
    }

    const hash = await hashPassword(nextPassword);
    await saveAdmin(admin, nextEmail, hash);

    // Re-issue the cookie under the new identity so the session survives.
    const csrf = await setAuthCookies(nextEmail);
    return ok({ email: nextEmail, csrf, message: "Login updated. Use the new email and password from now on." });
  } catch {
    return noDatabase();
  }
}
