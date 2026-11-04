import { NextResponse } from "next/server";
import { collections } from "@/data/demo-content.mjs";
import { mongoEnabled, writeDoc } from "@/lib/mongo";
import { digits, isSpam, normalize, validEmail, validPhone } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const recent = new Map<string, number>();

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  if (isSpam(body)) {
    return NextResponse.json({ ok: true, message: "Question received — we will reply soon." });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  if (now - (recent.get(ip) ?? 0) < 10_000) {
    return NextResponse.json({ ok: false, error: "too_many" }, { status: 429 });
  }
  recent.set(ip, now);

  const f = normalize(body);
  if (!f.fullName || !validPhone(f.phone) || !validEmail(f.email) || !f.subject || !f.message) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 422 });
  }

  const doc = {
    fullName: f.fullName,
    phone: f.phone,
    phoneKey: digits(f.phone),
    email: f.email,
    subject: f.subject,
    message: f.message,
    status: "new",
    source: "website",
    createdAt: new Date(),
  };

  if (mongoEnabled()) {
    try {
      await writeDoc(collections.messages, doc);
    } catch {
      return NextResponse.json(
        { ok: false, error: "database", message: "Could not save your message. Please WhatsApp or call." },
        { status: 502 }
      );
    }
  } else {
    console.warn("MONGODB_URI missing — message not stored:", doc);
  }

  return NextResponse.json({
    ok: true,
    message: `Thanks ${doc.fullName.split(" ")[0]}! Your question is in — we usually reply within a couple of hours.`,
  });
}
