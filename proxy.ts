import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "./lib/session-cookies";

/**
 * Cheap first gate for /admin: does a session cookie exist?
 * Every admin page and every admin API re-verifies the signature with
 * lib/auth.ts, so this only exists to redirect visitors without paying for
 * a full render. It must not import Node-only modules.
 */
export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const atLogin = pathname.startsWith("/admin/login");
  const hasSession = Boolean(req.cookies.get(SESSION_COOKIE)?.value);

  if (!hasSession && !atLogin) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = `next=${encodeURIComponent(pathname + req.nextUrl.search)}`;
    return NextResponse.redirect(url);
  }

  if (hasSession && atLogin) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
