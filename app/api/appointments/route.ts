import { NextResponse } from "next/server";
import { collections } from "@/data/demo-content.mjs";
import { mongoEnabled, writeDoc } from "@/lib/mongo";
import {
  digits,
  isSpam,
  normalize,
  validFutureDate,
  validPhone,
  validTime,
} from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bucket = new Map<string, number[]>();

async function rateLimited(ip: string) {
  // Without a KV store we keep a short in-process window per IP; good enough
  // to blunt scripts while a real appointment always has the WhatsApp fallback.
  const now = Date.now();
  const hits = bucket.get(ip) ?? [];
  const recent = hits.filter((t) => now - t < 60_000);
  if (recent.length >= 6) return true;
  recent.push(now);
  bucket.set(ip, recent);
  return false;
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  if (isSpam(body)) {
    return NextResponse.json({ ok: true, message: "Received — we will confirm shortly." });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (await rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "too_many", message: "Too many requests — please WhatsApp us instead." },
      { status: 429 }
    );
  }

  const f = normalize(body);
  if (!f.fullName || !validPhone(f.phone) || !f.service || !validFutureDate(f.preferredDate) || !validTime(f.preferredTime)) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 422 });
  }

  const doc = {
    fullName: f.fullName,
    phone: f.phone,
    phoneKey: digits(f.phone),
    email: f.email,
    service: f.service,
    preferredDate: f.preferredDate,
    preferredTime: f.preferredTime,
    notes: f.notes,
    status: "new",
    source: "website",
    createdAt: new Date(),
  };

  if (mongoEnabled()) {
    try {
      await writeDoc(collections.appointments, doc);
    } catch {
      return NextResponse.json(
        { ok: false, error: "database", message: "Could not save your request. Please WhatsApp or call." },
        { status: 502 }
      );
    }
  } else {
    console.warn("MONGODB_URI missing — appointment not stored:", doc);
  }

  return NextResponse.json({
    ok: true,
    message: `Thanks ${doc.fullName.split(" ")[0]}! Your ${doc.service} request for ${doc.preferredDate} at ${doc.preferredTime} is noted — we will confirm on WhatsApp shortly.`,
  });
}
