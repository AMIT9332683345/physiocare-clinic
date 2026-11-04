import { redirect } from "next/navigation";
import { Suspense } from "react";
import LoginForm from "@/components/admin/LoginForm";
import { readSession } from "@/lib/auth";
import { findAdmin } from "@/lib/db-admin";
import { mongoEnabled } from "@/lib/mongo";
import { getSettings } from "@/lib/settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEMO_EMAIL = "admin@physiocareclinic.in";
const DEMO_PASSWORD = "physio12345";

export default async function AdminLoginPage() {
  if (await readSession()) redirect("/admin");

  const settings = await getSettings();

  let demoHint: string | null = null;
  if (mongoEnabled()) {
    const seeded = await findAdmin(DEMO_EMAIL).catch(() => null);
    if (seeded?.seeded) demoHint = `${DEMO_EMAIL} / ${DEMO_PASSWORD}`;
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-teal-800 px-5 py-16">
      <div className="w-full max-w-md rounded-3xl bg-pearl-light p-7 shadow-card ring-1 ring-teal-900/10">
        <p className="eyebrow text-lime-dark">Admin panel</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold text-teal-800">{settings.clinicName}</h1>
        <p className="mt-1 text-sm text-teal-700/80">
          Sign in to change the clinic name, phone, WhatsApp, bio, doctors, pricing and more — no redeploy needed.
        </p>

        <div className="mt-6">
          <Suspense fallback={<div className="h-64" />}>
            <LoginForm demoHint={demoHint} />
          </Suspense>
        </div>

        {!mongoEnabled() && (
          <p className="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <code className="font-mono text-xs">MONGODB_URI</code> is not set on this environment, so there is nothing
            to sign in to yet. Add it in Vercel and Render, then run <code className="font-mono text-xs">npm run seed:admin</code>.
          </p>
        )}

        <a href="/" className="mt-6 block text-center text-sm font-semibold text-teal-600 hover:text-teal-800">
          ← Back to the website
        </a>
      </div>
    </main>
  );
}
