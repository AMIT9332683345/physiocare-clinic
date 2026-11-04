"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api, json } from "./api";

const input =
  "mt-1 w-full rounded-xl border border-teal-900/15 bg-pearl-light px-4 py-2.5 text-sm text-teal-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-lime/60";
const cap = "block text-xs font-bold uppercase tracking-wider text-teal-700";

export default function SecurityForm({
  email,
  demoLogin,
  hasDatabase,
}: {
  email: string;
  demoLogin: boolean;
  hasDatabase: boolean;
}) {
  const router = useRouter();
  const [currentPassword, setCurrent] = useState("");
  const [nextEmail, setNextEmail] = useState(email);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const res = await api<{ message?: string; email?: string }>("/api/admin/credentials", json({
        currentPassword,
        email: nextEmail,
        password,
        confirmPassword: confirm,
      }));
      setMsg({ ok: true, text: res.message ?? "Login updated." });
      setCurrent("");
      setPassword("");
      setConfirm("");
      router.refresh();
    } catch (err) {
      setMsg({ ok: false, text: (err as Error).message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <h1 className="font-display text-3xl font-extrabold text-teal-800">Login &amp; security</h1>
        <p className="mt-1 text-sm text-teal-700/80">
          Signed in as <strong className="text-teal-800">{email}</strong>. Change the email, the
          password, or both in one go — your current password is always required.
        </p>
      </header>

      {demoLogin && (
        <p className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          This is still the seeded demo login, so treat it as public. Pick your own email and a
          password of at least 10 characters.
        </p>
      )}

      {!hasDatabase && (
        <p className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <code className="font-mono">MONGODB_URI</code> is missing on this environment, so the
          login cannot be saved.
        </p>
      )}

      <form onSubmit={submit} className="space-y-5 rounded-2xl bg-white p-6 shadow-card ring-1 ring-teal-900/5">
        <label className="block">
          <span className={cap}>Current password</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            className={input}
            value={currentPassword}
            onChange={(e) => setCurrent(e.target.value)}
          />
        </label>

        <label className="block">
          <span className={cap}>New email (sign-in username)</span>
          <input
            type="email"
            required
            autoComplete="email"
            className={input}
            value={nextEmail}
            onChange={(e) => setNextEmail(e.target.value)}
          />
        </label>

        <label className="block">
          <span className={cap}>New password</span>
          <input
            type="password"
            required
            minLength={10}
            autoComplete="new-password"
            className={input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="mt-1 block text-xs text-teal-600/70">
            At least 10 characters. Stored as a scrypt hash — never in plain text.
          </span>
        </label>

        <label className="block">
          <span className={cap}>Repeat new password</span>
          <input
            type="password"
            required
            minLength={10}
            autoComplete="new-password"
            className={input}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </label>

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

        <button type="submit" disabled={busy || !hasDatabase} className="btn-lime btn-lime-hover text-sm disabled:opacity-60">
          {busy ? "Updating…" : "Update login"}
        </button>
      </form>

      <p className="text-xs leading-relaxed text-teal-600/70">
        Note: <code className="font-mono">ADMIN_SESSION_SECRET</code> must be set on Vercel and
        Render (the same value on each). Without it, every sign-in is invalidated whenever a new
        server instance starts.
      </p>
    </div>
  );
}
