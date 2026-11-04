import Link from "next/link";
import { adminCount, inboxCounts, listRows } from "@/lib/db-admin";
import { mongoEnabled } from "@/lib/mongo";
import { ENTITIES } from "@/lib/entities";
import { getSettings } from "@/lib/settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const settings = await getSettings();

  const broken = !mongoEnabled();
  let counts: Record<string, number> = {};
  let inbox = { appointments: 0, messages: 0, newBookings: 0, unread: 0 };
  let admins = 0;

  if (!broken) {
    try {
      const rows = await Promise.all(ENTITIES.map((e) => listRows(e.collection)));
      counts = Object.fromEntries(ENTITIES.map((e, i) => [e.key, rows[i].length]));
      [inbox, admins] = await Promise.all([inboxCounts(), adminCount()]);
    } catch {
      counts = {};
    }
  }

  const dbDown = broken || Object.keys(counts).length === 0;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header>
        <h1 className="font-display text-3xl font-extrabold text-teal-800">
          {settings.clinicName}
        </h1>
        <p className="mt-1 text-sm text-teal-700/80">
          Everything here is saved to the database and appears on the live site straight away — no
          redeploy.
        </p>
      </header>

      {dbDown && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-6 text-amber-900">
          <p className="font-bold">MongoDB is not reachable from here.</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            <li>
              Set <code className="font-mono">MONGODB_URI</code> in Vercel and Render environment
              variables (and <code className="font-mono">ADMIN_SESSION_SECRET</code> for sign-in).
            </li>
            <li>
              Locally: <code className="font-mono">npm run seed</code> then{" "}
              <code className="font-mono">npm run seed:admin</code>.
            </li>
            <li>
              Atlas → Security → Network Access: add the deployment IPs, or{" "}
              <code className="font-mono">0.0.0.0/0</code> to allow anywhere. A changed home IP
              breaks an IP-allowlisted connection with a TLS error, not a login error.
            </li>
          </ul>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Stat label="New booking requests" value={inbox.newBookings} href="/admin/inbox" accent />
        <Stat label="Unread messages" value={inbox.unread} href="/admin/inbox" accent />
        <Stat label="Total enquiries" value={inbox.appointments + inbox.messages} href="/admin/inbox" />
        {ENTITIES.map((e) => (
          <Stat key={e.key} label={e.title} value={counts[e.key] ?? 0} href={`/admin/content/${e.key}`} />
        ))}
      </div>

      <section className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-teal-900/5">
        <h2 className="font-display text-lg font-bold text-teal-800">Currently live on the site</h2>
        <dl className="mt-4 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
          <Row k="Clinic name" v={settings.clinicName} />
          <Row k="Owner" v={`${settings.ownerName} · ${settings.credentials}`} />
          <Row k="Phone" v={settings.phoneNumber} />
          <Row k="WhatsApp" v={settings.whatsappNumber} />
          <Row k="Email" v={settings.email} />
          <Row k="Hours" v={settings.hoursWeek} />
          <Row k="Share domain" v={settings.siteUrl || "not set — set it for link previews"} />
          <Row k="Admin logins" v={String(admins)} />
        </dl>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/admin/clinic" className="btn-lime btn-lime-hover text-sm">
            Edit clinic info &amp; bio
          </Link>
          <Link href="/admin/content/team" className="btn-ghost btn-lime-hover text-teal-800 text-sm">
            Add a doctor
          </Link>
          <a href="/" target="_blank" rel="noreferrer" className="btn-ghost btn-lime-hover text-teal-800 text-sm">
            View website ↗
          </a>
        </div>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  href,
  accent,
}: {
  label: string;
  value: number;
  href: string;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        "block rounded-2xl p-5 shadow-card transition hover:-translate-y-0.5 " +
        (accent ? "bg-teal-800 text-pearl" : "bg-white text-teal-800 ring-1 ring-teal-900/5")
      }
    >
      <p className={"text-3xl font-extrabold " + (accent ? "text-lime" : "text-teal-800")}>{value}</p>
      <p className={"mt-1 text-sm " + (accent ? "text-pearl/80" : "text-teal-700/75")}>{label}</p>
    </Link>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-pearl-dark/60 pb-2">
      <dt className="shrink-0 font-semibold text-teal-600">{k}</dt>
      <dd className="truncate text-right text-teal-800">{v}</dd>
    </div>
  );
}
