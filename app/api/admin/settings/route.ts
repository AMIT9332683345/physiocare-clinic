import { NextRequest, NextResponse } from "next/server";
import { adminGuard, badRequest, noDatabase, ok } from "@/lib/api-helpers";
import { readSettingsDoc, writeSettings } from "@/lib/db-admin";
import { mongoEnabled } from "@/lib/mongo";
import { getSettings, publicUrl, type Settings } from "@/lib/settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TEXT_FIELDS: (keyof Settings)[] = [
  "clinicName", "shortName", "tagline", "ownerName", "credentials", "bio",
  "whatsappNumber", "phoneNumber", "phoneDial", "email",
  "addressLine1", "addressLine2", "mapsUrl", "hoursWeek", "hoursSunday",
  "instagram", "facebook", "whatsappGreeting", "siteUrl", "ogImage", "shareTagline",
];

const COLOR_FIELDS = ["midnightTeal", "pearl", "lime"] as const;

const HEX = /^#[0-9a-fA-F]{6}$/;

/** Digits, spaces and + only — the number has to stay dialable. */
const PHONE_LIKE = /^[+\d][\d\s-]{5,19}$/;

export async function GET(req: NextRequest) {
  const { session, response } = await adminGuard(req);
  if (!session) return response;
  if (!mongoEnabled()) return noDatabase();

  try {
    const saved = await readSettingsDoc();
    const live = await getSettings();
    const url = publicUrl(live, req);
    return NextResponse.json({ ok: true, settings: saved ?? {}, live, origin: new URL(url).origin });
  } catch {
    return noDatabase();
  }
}

export async function POST(req: NextRequest) {
  const { session, response } = await adminGuard(req);
  if (!session) return response;
  if (!mongoEnabled()) return noDatabase();

  const body = await req.json().catch(() => ({} as Record<string, unknown>));
  const patch: Partial<Settings> = {};
  const errors: string[] = [];

  for (const key of TEXT_FIELDS) {
    const raw = (body as Record<string, unknown>)[key];
    if (raw === undefined) continue;
    if (typeof raw !== "string") {
      errors.push(`${key}: must be text`);
      continue;
    }
    const value = key === "bio" || key === "whatsappGreeting" || key === "shareTagline"
      ? raw.replace(/\r\n/g, "\n").trim().slice(0, key === "bio" ? 2000 : 400)
      : raw.replace(/\s+/g, " ").trim().slice(0, 200);

    if (key === "whatsappNumber" && !/^\d{8,15}$/.test(value.replace(/[^\d]/g, ""))) {
      errors.push("WhatsApp number must be 8–15 digits in international format, e.g. 919876543210.");
      continue;
    }
    if ((key === "phoneDial" || key === "phoneNumber") && value && !PHONE_LIKE.test(value)) {
      errors.push(`${key === "phoneDial" ? "Dial number" : "Displayed phone"} looks invalid — digits, + and spaces only.`);
      continue;
    }
    if (key === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      errors.push("Email address is not valid.");
      continue;
    }
    if (key === "siteUrl" && value && !/^https:\/\/[^\s]+$/.test(value)) {
      errors.push("Site URL must start with https://");
      continue;
    }
    if (key === "ogImage" && value && !/^(https:\/\/|\/)/.test(value)) {
      errors.push("Share image must be an https:// URL or a path starting with /.");
      continue;
    }
    (patch as Record<string, unknown>)[key] = value;
  }

  const colors = body.colors;
  if (colors && typeof colors === "object" && !Array.isArray(colors)) {
    const next: Record<string, string> = {};
    for (const key of COLOR_FIELDS) {
      const raw = (colors as Record<string, unknown>)[key];
      if (typeof raw !== "string" || !raw) continue;
      if (!HEX.test(raw.trim())) {
        errors.push(`Colour ${key} must be a hex code like #0B3048.`);
        continue;
      }
      next[key] = raw.trim().toUpperCase();
    }
    if (Object.keys(next).length) patch.colors = { ...(await getSettings()).colors, ...next };
  }

  if (errors.length) return badRequest(errors);
  if (!Object.keys(patch).length) return badRequest(["Nothing to save — the form came back empty."]);

  try {
    await writeSettings(patch);
    const live = await getSettings();
    return ok({ settings: patch, live, message: "Saved. The live site now shows these details." });
  } catch {
    return noDatabase();
  }
}
