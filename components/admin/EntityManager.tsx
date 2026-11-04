"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api, json } from "./api";
import type { Entity, Field } from "@/lib/entities";

export type AdminRow = { id: string } & Record<string, unknown>;

const input =
  "mt-1 w-full rounded-xl border border-teal-900/15 bg-pearl-light px-4 py-2.5 text-sm text-teal-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-lime/60";
const cap = "block text-xs font-bold uppercase tracking-wider text-teal-700";

function toForm(entity: Entity, row?: AdminRow): Record<string, string> {
  const out: Record<string, string> = {};
  for (const f of entity.fields) {
    const raw = row?.[f.name];
    if (f.type === "list") out[f.name] = Array.isArray(raw) ? raw.join("\n") : "";
    else if (f.type === "checkbox") out[f.name] = raw === true ? "true" : "";
    else if (raw == null) out[f.name] = "";
    else out[f.name] = String(raw);
  }
  return out;
}

const labelOf = (entity: Entity, row: AdminRow) => {
  const v = row[entity.label];
  return typeof v === "string" && v.trim() ? v : "Untitled";
};

export default function EntityManager({ entity, rows }: { entity: Entity; rows: AdminRow[] }) {
  const router = useRouter();
  const [list, setList] = useState(rows);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(rows.length === 0);
  const [draft, setDraft] = useState<Record<string, string>>(() => toForm(entity));
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const base = `/api/admin/${entity.key}`;

  function startAdd() {
    setEditingId(null);
    setDraft(toForm(entity));
    setShowForm(true);
    setMsg(null);
  }

  function startEdit(row: AdminRow) {
    setEditingId(row.id);
    setDraft(toForm(entity, row));
    setShowForm(true);
    setMsg(null);
  }

  async function submit() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await api<{ id?: string; row?: AdminRow }>(
        base,
        json(editingId ? { ...draft, id: editingId } : draft, editingId ? "PATCH" : "POST")
      );
      const merged = { ...(res.row ?? {}), id: res.id ?? editingId ?? "" } as AdminRow;
      setList((prev) =>
        editingId ? prev.map((r) => (r.id === merged.id ? merged : r)) : [...prev, merged]
      );
      setEditingId(merged.id);
      setMsg({ ok: true, text: editingId ? "Saved." : "Added." });
      router.refresh();
    } catch (e) {
      setMsg({ ok: false, text: (e as Error).message });
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this entry from the website?")) return;
    setMsg(null);
    try {
      await api(`${base}?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      setList((prev) => prev.filter((r) => r.id !== id));
      if (editingId === id) startAdd();
      router.refresh();
    } catch (e) {
      setMsg({ ok: false, text: (e as Error).message });
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-teal-800">{entity.title}</h1>
          <p className="mt-1 text-sm text-teal-700/80">{entity.subtitle}</p>
        </div>
        <button type="button" onClick={startAdd} className="btn-lime btn-lime-hover text-sm">
          {editingId ? "Add another" : `Add ${entity.label === "q" ? "a question" : "new"}`}
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

      {showForm && (
        <section className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-teal-900/5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-teal-800">
              {editingId ? "Edit entry" : "New entry"}
            </h2>
            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-teal-600 hover:text-teal-800">
              Close
            </button>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {entity.fields.map((f) => (
              <FieldInput
                key={f.name}
                field={f}
                value={draft[f.name] ?? ""}
                onChange={(v) => setDraft((d) => ({ ...d, [f.name]: v }))}
              />
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {editingId ? (
              <button type="button" onClick={submit} disabled={busy} className="btn-lime btn-lime-hover text-sm disabled:opacity-60">
                {busy ? "Saving…" : "Save changes"}
              </button>
            ) : (
              <button type="button" onClick={submit} disabled={busy} className="btn-lime btn-lime-hover text-sm disabled:opacity-60">
                {busy ? "Adding…" : "Add entry"}
              </button>
            )}
            {editingId && (
              <button
                type="button"
                onClick={() => remove(editingId)}
                className="btn-ghost btn-lime-hover text-red-700 text-sm"
              >
                Delete this entry
              </button>
            )}
          </div>
        </section>
      )}

      <section className="overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-teal-900/5">
        <p className="border-b border-pearl-dark px-6 py-4 text-xs font-bold uppercase tracking-wider text-teal-600">
          {list.length} on the site
        </p>
        <ul className="divide-y divide-pearl-dark">
          {list.map((row) => (
            <li key={row.id} className="flex items-center justify-between gap-4 px-6 py-4">
              <div className="min-w-0">
                <p className="truncate font-semibold text-teal-800">{labelOf(entity, row)}</p>
                <p className="truncate text-xs text-teal-600/70">
                  {entity.fields
                    .filter((f) => f.type !== "textarea" && f.type !== "list")
                    .slice(0, 3)
                    .map((f) => `${f.label}: ${String(row[f.name] ?? "—")}`)
                    .join(" · ")}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(row)}
                  className="rounded-full bg-teal-100 px-4 py-1.5 text-xs font-bold text-teal-800 hover:bg-teal-300"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => remove(row.id)}
                  className="rounded-full bg-red-50 px-4 py-1.5 text-xs font-bold text-red-700 hover:bg-red-100"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
          {!list.length && (
            <li className="px-6 py-10 text-center text-sm text-teal-600/70">
              Nothing here yet — add the first entry above.
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: string;
  onChange: (v: string) => void;
}) {
  const wide = field.type === "textarea" || field.type === "list";
  return (
    <label className={wide ? "sm:col-span-2 block" : "block"}>
      <span className={cap}>
        {field.label}
        {field.required && <span className="text-red-600"> *</span>}
      </span>
      {field.type === "textarea" || field.type === "list" ? (
        <textarea
          rows={field.type === "list" ? 4 : 5}
          className={input}
          value={value}
          placeholder={field.type === "list" ? "One item per line" : field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : field.type === "checkbox" ? (
        <span className="mt-2 flex items-center gap-2">
          <input
            type="checkbox"
            checked={value === "true"}
            onChange={(e) => onChange(e.target.checked ? "true" : "")}
            className="h-5 w-5 accent-lime"
          />
          <span className="text-sm text-teal-700">Yes, turn this on</span>
        </span>
      ) : (
        <input
          type={field.type === "number" ? "number" : "text"}
          className={input}
          value={value}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {field.help && <span className="mt-1 block text-xs text-teal-600/70">{field.help}</span>}
    </label>
  );
}
