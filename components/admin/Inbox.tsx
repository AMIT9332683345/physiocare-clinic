"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api, json } from "./api";
import { waFor } from "@/lib/contact-links";
import type { Settings } from "@/lib/settings";

export type InboxRow = {
  id: string;
  kind: "appointments" | "messages";
  name: string;
  phone: string;
  email: string;
  detail: string;
  note: string;
  status: string;
  when: string;
};

const input =
  "mt-1 w-full rounded-xl border border-teal-900/15 bg-pearl-light px-4 py-2.5 text-sm text-teal-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-lime/60";

const tone: Record<string, string> = {
  new: "bg-lime text-teal-900",
  confirmed: "bg-teal-100 text-teal-800",
  read: "bg-teal-100 text-teal-800",
  completed: "bg-pearl-dark text-teal-700",
  cancelled: "bg-red-50 text-red-700",
};

export default function Inbox({ rows, settings }: { rows: InboxRow[]; settings: Settings }) {
  const router = useRouter();
  const [list, setList] = useState(rows);
  const [tab, setTab] = useState<"appointments" | "messages">("appointments");
  const [error, setError] = useState("");

  const shown = list.filter((r) => r.kind === tab);

  async function setStatus(row: InboxRow, status: string) {
    setError("");
    try {
      await api("/api/admin/inbox", json({ kind: row.kind, id: row.id, status }, "PATCH"));
      setList((prev) => prev.map((r) => (r.id === row.id ? { ...r, status } : r)));
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function remove(row: InboxRow) {
    if (!confirm("Delete this enquiry permanently?")) return;
    setError("");
    try {
      await api(`/api/admin/inbox?kind=${row.kind}&id=${row.id}`, { method: "DELETE" });
      setList((prev) => prev.filter((r) => r.id !== row.id));
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <h1 className="font-display text-3xl font-extrabold text-teal-800">Bookings &amp; messages</h1>
        <p className="mt-1 text-sm text-teal-700/80">
          Everything patients send through the website. Reply straight from WhatsApp or the phone.
        </p>
      </header>

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="flex gap-2">
        {(
          [
            ["appointments", "Appointment requests"],
            ["messages", "Questions"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={
              "rounded-full px-5 py-2 text-sm font-bold transition " +
              (tab === key ? "bg-teal-800 text-lime" : "bg-white text-teal-700 ring-1 ring-teal-900/10")
            }
          >
            {label} ({list.filter((r) => r.kind === key).length})
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {!shown.length && (
          <p className="rounded-2xl bg-white p-10 text-center text-sm text-teal-600/70 shadow-card">
            Nothing here yet.
          </p>
        )}

        {shown.map((row) => (
          <article key={row.id} className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-teal-900/5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-display text-lg font-bold text-teal-800">{row.name}</p>
                <p className="mt-0.5 text-sm text-teal-600">
                  {row.detail} · received {row.when}
                </p>
              </div>
              <span
                className={
                  "rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider " +
                  (tone[row.status] ?? "bg-pearl-dark text-teal-700")
                }
              >
                {row.status}
              </span>
            </div>

            {row.note && (
              <p className="mt-3 rounded-xl bg-pearl px-4 py-3 text-sm leading-relaxed text-teal-800">
                {row.note}
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <a
                href={waFor(
                  settings,
                  `Hi ${row.name.split(" ")[0]}, this is ${settings.clinicName} about your enquiry${
                    row.detail ? ` (${row.detail})` : ""
                  }.`
                )}
                target="_blank"
                rel="noreferrer"
                className="btn-lime btn-lime-hover px-4 py-2 text-xs"
              >
                WhatsApp reply
              </a>
              {row.phone && (
                <a href={`tel:${row.phone.replace(/[^\d+]/g, "")}`} className="btn-ghost btn-lime-hover text-teal-800 px-4 py-2 text-xs">
                  Call {row.phone}
                </a>
              )}
              {row.email && (
                <a href={`mailto:${row.email}`} className="btn-ghost btn-lime-hover text-teal-800 px-4 py-2 text-xs">
                  Email
                </a>
              )}

              <select
                value={row.status}
                onChange={(e) => setStatus(row, e.target.value)}
                className={input + " mt-0 w-auto"}
                aria-label="Status"
              >
                {["new", "confirmed", "completed", "cancelled", "read"].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => remove(row)}
                className="ml-auto text-xs font-bold text-red-700 hover:underline"
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
