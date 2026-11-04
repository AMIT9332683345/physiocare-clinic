import type { Metadata } from "next";
import Inbox, { type InboxRow } from "@/components/admin/Inbox";
import { listInbox } from "@/lib/db-admin";
import { getSettings } from "@/lib/settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Bookings & messages" };

const str = (v: unknown) => (typeof v === "string" ? v : v == null ? "" : String(v));

function when(v: unknown): string {
  const d = v instanceof Date ? v : new Date(String(v ?? ""));
  return Number.isNaN(d.getTime())
    ? "—"
    : new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(d);
}

export default async function AdminInboxPage() {
  const settings = await getSettings();

  let rows: InboxRow[] = [];
  let dbDown = false;
  try {
    const inbox = await listInbox();
    rows = [
      ...inbox.appointments.map((r) => {
        const d = r as Record<string, unknown>;
        return {
          id: str(d.id),
          kind: "appointments" as const,
          name: str(d.fullName) || str(d.name) || "Patient",
          phone: str(d.phone),
          email: str(d.email),
          detail: [str(d.service), [d.preferredDate, d.preferredTime].filter(Boolean).join(" ")]
            .filter(Boolean)
            .join(" · "),
          note: str(d.notes),
          status: str(d.status) || "new",
          when: when(d.createdAt),
        };
      }),
      ...inbox.messages.map((r) => {
        const d = r as Record<string, unknown>;
        return {
          id: str(d.id),
          kind: "messages" as const,
          name: str(d.name) || "Visitor",
          phone: str(d.phone),
          email: str(d.email),
          detail: str(d.topic),
          note: str(d.message),
          status: str(d.status) || "new",
          when: when(d.createdAt),
        };
      }),
    ];
  } catch {
    dbDown = true;
  }

  return (
    <>
      {dbDown && (
        <p className="mx-auto mb-6 max-w-5xl rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          MongoDB is unreachable, so the inbox looks empty. Check <code className="font-mono">MONGODB_URI</code> and
          the Atlas network allowlist.
        </p>
      )}
      <Inbox rows={rows} settings={settings} />
    </>
  );
}
