import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookies } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  await clearAuthCookies();
  return NextResponse.json({ ok: true, redirectTo: "/admin/login" });
}

/** Direct link from the admin UI also works without JavaScript. */
export async function GET(req: NextRequest) {
  await clearAuthCookies();
  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.search = "?signed_out=1";
  return NextResponse.redirect(url);
}
