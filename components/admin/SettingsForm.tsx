"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api, json } from "./api";
import type { Settings } from "@/lib/settings";

type Group = {
  title: string;
  note?: string;
  fields: { key: keyof Settings; label: string; help?: string; wide?: boolean; area?: boolean }[];
};

const GROUPS: Group[] = [
  {
    title: "Brand",
    fields: [
      { key: "clinicName", label: "Website / clinic name", help: "Header, footer, page title, share preview" },
      { key: "shortName", label: "Short name" },
      { key: "tagline", label: "Tagline", help: "Big line under the name on the home page" },
      { key: "shareTagline", label: "Link-preview text", help: "Shown when the link is pasted into WhatsApp, X, iMessage", wide: true },
    ],
  },
  {
    title: "About & bio",
    fields: [
      { key: "ownerName", label: "Founder / lead therapist" },
      { key: "credentials", label: "Qualification line" },
      { key: "bio", label: "Clinic bio (About section)", area: true, wide: true, help: "Blank line between paragraphs" },
      { key: "whatsappGreeting", label: "Prefilled WhatsApp message", area: true, wide: true },
    ],
  },
  {
    title: "Contact & buttons",
    note: "The WhatsApp button uses the digits below, country code included and no + sign.",
    fields: [
      { key: "whatsappNumber", label: "WhatsApp number", help: "e.g. 919876543210" },
      { key: "phoneNumber", label: "Phone shown on screen", help: "e.g. +91 98765 43210" },
      { key: "phoneDial", label: "Number the Call button dials", help: "e.g. +919876543210" },
      { key: "email", label: "Email" },
      { key: "addressLine1", label: "Address line 1", wide: true },
      { key: "addressLine2", label: "Address line 2 / city", wide: true },
      { key: "mapsUrl", label: "Google Maps link", wide: true },
      { key: "hoursWeek", label: "Opening hours (week)" },
      { key: "hoursSunday", label: "Opening hours (Sunday)" },
      { key: "instagram", label: "Instagram URL (blank hides it)" },
      { key: "facebook", label: "Facebook URL (blank hides it)" },
    ],
  },
  {
    title: "Link preview",
    note: "Set the public domain so shared links point somewhere real, or paste your own preview image URL.",
    fields: [
      { key: "siteUrl", label: "Live domain", help: "https://your-site.vercel.app", wide: true },
      { key: "ogImage", label: "Custom preview image", help: "Blank = auto-generated card", wide: true },
    ],
  },
];

const input =
  "mt-1 w-full rounded-xl border border-teal-900/15 bg-pearl-light px-4 py-2.5 text-sm text-teal-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-lime/60";
const cap = "block text-xs font-bold uppercase tracking-wider text-teal-700";

export default function SettingsForm({ initial }: { initial: Settings }) {
  const router = useRouter();
  const [form, setForm] = useState<Record<string, string>>(
    Object.fromEntries(
      GROUPS.flatMap((g) => g.fields).map((f) => [f.key as string, String(initial[f.key] ?? "")])
    )
  );
  const [colors, setColors] = useState({ ...initial.colors });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setMsg(null);
  }

  async function save() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await api<{ message?: string }>("/api/admin/settings", json({ ...form, colors }));
      setMsg({ ok: true, text: res.message ?? "Saved." });
      router.refresh();
    } catch (e) {
      setMsg({ ok: false, text: (e as Error).message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-teal-800">Clinic info &amp; bio</h1>
          <p className="mt-1 text-sm text-teal-700/80">
            Saved straight to the database — the public site picks it up on the next visit.
          </p>
        </div>
        <button type="button" onClick={save} disabled={busy} className="btn-lime btn-lime-hover text-sm disabled:opacity-60">
          {busy ? "Saving…" : "Save changes"}
        </button>
      </header>

      {msg && (
        <p
          role="status"
          className={
            "rounded-xl px-4 py-3 text-sm font-medium " +
            (msg.ok ? "bg-lime-soft text-teal-800" : "bg-red-50 text-red-700")
          }
        >
          {msg.text}
        </p>
      )}

      {GROUPS.map((g) => (
        <section key={g.title} className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-teal-900/5">
          <h2 className="font-display text-lg font-bold text-teal-800">{g.title}</h2>
          {g.note && <p className="mt-1 text-sm text-teal-700/70">{g.note}</p>}

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {g.fields.map((f) => (
              <label key={f.key} className={f.wide ? "sm:col-span-2" : ""}>
                <span className={cap}>{f.label}</span>
                {f.area ? (
                  <textarea
                    rows={f.key === "bio" ? 7 : 3}
                    className={input}
                    value={form[f.key as string] ?? ""}
                    onChange={(e) => set(f.key as string, e.target.value)}
                  />
                ) : (
                  <input
                    className={input}
                    value={form[f.key as string] ?? ""}
                    onChange={(e) => set(f.key as string, e.target.value)}
                  />
                )}
                {f.help && <span className="mt-1 block text-xs text-teal-600/70">{f.help}</span>}
              </label>
            ))}
          </div>
        </section>
      ))}

      <section className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-teal-900/5">
        <h2 className="font-display text-lg font-bold text-teal-800">Brand colours</h2>
        <p className="mt-1 text-sm text-teal-700/70">
          These three drive the whole palette. The defaults are deep midnight teal, soft pearl and
          vibrant neon lime.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {(
            [
              ["midnightTeal", "Midnight teal"],
              ["pearl", "Pearl"],
              ["lime", "Neon lime"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="block">
              <span className={cap}>{label}</span>
              <div className="mt-1 flex items-center gap-2">
                <input
                  type="color"
                  className="h-11 w-14 cursor-pointer rounded-lg border border-teal-900/15 bg-white p-1"
                  value={colors[key]}
                  onChange={(e) => setColors((c) => ({ ...c, [key]: e.target.value }))}
                />
                <input
                  className={input}
                  value={colors[key]}
                  onChange={(e) => setColors((c) => ({ ...c, [key]: e.target.value.toUpperCase() }))}
                />
              </div>
            </label>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button type="button" onClick={save} disabled={busy} className="btn-lime btn-lime-hover text-sm disabled:opacity-60">
            {busy ? "Saving…" : "Save changes"}
          </button>
          <a
            className="text-sm font-semibold text-teal-600 hover:text-teal-800"
            href={initial.ogImage || "/opengraph-image"}
            target="_blank"
            rel="noreferrer"
          >
            Preview the share card ↗
          </a>
        </div>
      </section>
    </div>
  );
}
