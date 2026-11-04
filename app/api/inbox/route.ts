import { NextResponse } from "next/server";
import { collections } from "@/data/demo-content.mjs";
import { readCollection } from "@/lib/mongo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/inbox?token=<ADMIN_TOKEN>&kind=appointments|messages
 * A token is required; without ADMIN_TOKEN set the endpoint stays locked.
 * This keeps patient details off an open URL.
 */
export async function GET(req: Request) {
  const secret = process.env.ADMIN_TOKEN ?? "";
  const token = new URL(req.url).searchParams.get("token") ?? "";

  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "ADMIN_TOKEN is not set — inbox disabled by design." },
      { status: 403 }
    );
  }
  if (token !== secret) {
    return NextResponse.json({ ok: false, error: "invalid_token" }, { status: 401 });
  }

  const kind = new URL(req.url).searchParams.get("kind") === "messages" ? "messages" : "appointments";
  const rows = await readCollection(collections[kind], {}, { createdAt: -1 });

  if (!rows) {
    return NextResponse.json(
      { ok: false, error: "database_unreachable" },
      { status: 503 }
    );
  }

  const lines = rows.map((r) => {
    const d = r as unknown as Record<string, unknown>;
    const when = d.createdAt instanceof Date ? d.createdAt.toISOString() : String(d.createdAt ?? "");
    return [
      `${when.slice(0, 16).replace("T", " ")}  [${d.status ?? "new"}]`,
      `  ${d.fullName} · ${d.phone}${d.email ? ` · ${d.email}` : ""}`,
      kind === "appointments"
        ? `  ${d.service} → ${d.preferredDate} ${d.preferredTime}`
        : `  ${d.subject}`,
      d.notes ? `  note: ${d.notes}` : d.message ? `  msg: ${d.message}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  });

  return new NextResponse(
    `# ${kind} — ${rows.length} record(s)\n\n${lines.join("\n\n") || "(none yet)"}\n`,
    { headers: { "content-type": "text/plain; charset=utf-8" } }
  );
}
