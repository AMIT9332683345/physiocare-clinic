/**
 * Cookie-session auth for /admin. No extra dependencies: scrypt for password
 * hashes, HMAC-SHA256 for signed session + CSRF tokens.
 *
 * ADMIN_SESSION_SECRET must be set in Vercel and Render, otherwise every
 * serverless instance invents its own secret and sessions die at random.
 */
import {
  createHmac,
  randomBytes,
  scrypt as scryptCb,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";

const scrypt = promisify(scryptCb) as (
  password: string,
  salt: Buffer,
  keylen: number
) => Promise<Buffer>;

export { SESSION_COOKIE, CSRF_COOKIE, CSRF_HEADER } from "./session-cookies";
import { CSRF_COOKIE, CSRF_HEADER, SESSION_COOKIE } from "./session-cookies";
const SESSION_TTL_HOURS = 12;

function secret(): string {
  const s = process.env.ADMIN_SESSION_SECRET ?? "";
  if (s.length >= 16) return s;
  if (process.env.NODE_ENV !== "production") return "dev-only-insecure-secret-please-change";
  throw new Error("ADMIN_SESSION_SECRET is not set (min 16 chars) — refusing to sign sessions.");
}

// ---------- passwords ----------

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await scrypt(password, salt, 64);
  return `scrypt$${salt.toString("base64")}$${key.toString("base64")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, saltB64, keyB64] = stored.split("$");
  if (scheme !== "scrypt" || !saltB64 || !keyB64) return false;
  try {
    const expected = Buffer.from(keyB64, "base64");
    const actual = await scrypt(password, Buffer.from(saltB64, "base64"), expected.length);
    return timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

// ---------- signed tokens ----------

type SessionPayload = { email: string; exp: number };

const b64u = (buf: Buffer) => buf.toString("base64url");

function sign(value: string): string {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

export function makeSessionToken(email: string): string {
  const payload: SessionPayload = {
    email,
    exp: Date.now() + SESSION_TTL_HOURS * 3600_000,
  };
  const body = b64u(Buffer.from(JSON.stringify(payload), "utf8"));
  return `${body}.${sign(body)}`;
}

export function makeCsrfToken(email: string): string {
  return sign(`csrf:${email}`);
}

/** Constant-time compare of the signature; never trusts the payload first. */
function verify(token: string | undefined): SessionPayload | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = sign(body);
  const a = Buffer.from(expected);
  const b = Buffer.from(sig);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as SessionPayload;
    if (!payload.email || !payload.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

// ---------- cookie helpers (server side) ----------

export async function readSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  return verify(jar.get(SESSION_COOKIE)?.value);
}

export async function requireAdmin(): Promise<SessionPayload> {
  const session = await readSession();
  if (!session) throw new Error("unauthenticated");
  return session;
}

export async function setAuthCookies(email: string) {
  const jar = await cookies();
  const maxAge = SESSION_TTL_HOURS * 3600;
  const csrf = makeCsrfToken(email);
  jar.set(SESSION_COOKIE, makeSessionToken(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });
  // Readable by the page's own scripts only (not httpOnly) so the admin UI can
  // echo it back in the header on every mutation.
  jar.set(CSRF_COOKIE, csrf, {
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });
  return csrf;
}

export async function clearAuthCookies() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  jar.delete(CSRF_COOKIE);
}

/** CSRF only matters for cookie-authenticated mutations. */
export async function checkCsrf(req: Request): Promise<boolean> {
  const session = await readSession();
  if (!session) return false;
  const jar = await cookies();
  const cookie = jar.get(CSRF_COOKIE)?.value;
  const sent = req.headers.get(CSRF_HEADER) ?? "";
  if (!cookie || cookie !== sent) return false;
  return cookie === makeCsrfToken(session.email);
}

// ---------- login throttling ----------

const attempts = new Map<string, { count: number; until: number }>();

export function loginThrottle(ip: string): { allowed: boolean; retryIn?: number } {
  const now = Date.now();
  const rec = attempts.get(ip);
  if (!rec || rec.until < now) return { allowed: true };
  if (rec.count >= 8) return { allowed: false, retryIn: Math.ceil((rec.until - now) / 1000) };
  return { allowed: true };
}

export function recordLoginFailure(ip: string) {
  const now = Date.now();
  const rec = attempts.get(ip);
  if (!rec || rec.until < now) {
    attempts.set(ip, { count: 1, until: now + 15 * 60_000 });
  } else {
    rec.count += 1;
  }
}

export function clearLoginFailures(ip: string) {
  attempts.delete(ip);
}
