"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { api, json } from "./api";

export default function LoginForm({ demoHint }: { demoHint: string | null }) {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const data = await api<{ redirectTo?: string }>("/api/admin/login", json({
        email,
        password,
        next: params.get("next") ?? "/admin",
      }));
      router.replace(data.redirectTo ?? "/admin");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block">
        <span className="eyebrow text-teal-600">Email</span>
        <input
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-xl border border-teal-300/60 bg-white px-4 py-3 text-teal-900 outline-none focus:border-lime-dark focus:ring-2 focus:ring-lime/70"
          placeholder="you@clinic.in"
        />
      </label>

      <label className="block">
        <span className="eyebrow text-teal-600">Password</span>
        <input
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-xl border border-teal-300/60 bg-white px-4 py-3 text-teal-900 outline-none focus:border-lime-dark focus:ring-2 focus:ring-lime/70"
          placeholder="••••••••"
        />
      </label>

      {error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="btn-lime w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? "Signing in…" : "Sign in"}
      </button>

      {demoHint && !error && (
        <p className="rounded-xl bg-pearl-dark/60 px-4 py-3 text-sm text-teal-700">
          First time? The seeded login is <strong>{demoHint}</strong>. Change it under Security once you are in.
        </p>
      )}
    </form>
  );
}
