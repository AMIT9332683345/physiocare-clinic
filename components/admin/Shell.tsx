"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/admin", label: "Dashboard", hint: "Overview & warnings" },
  { href: "/admin/clinic", label: "Clinic info & bio", hint: "Name, phone, WhatsApp" },
  { href: "/admin/content/team", label: "Doctors", hint: "Add or edit therapists" },
  { href: "/admin/content/services", label: "Services", hint: "Treatment tracks" },
  { href: "/admin/content/packages", label: "Pricing", hint: "Packages & rates" },
  { href: "/admin/content/testimonials", label: "Reviews", hint: "Patient stories" },
  { href: "/admin/content/faqs", label: "FAQs", hint: "Common questions" },
  { href: "/admin/content/articles", label: "Health articles", hint: "/blog pages" },
  { href: "/admin/inbox", label: "Bookings & messages", hint: "Patient enquiries" },
  { href: "/admin/security", label: "Login & security", hint: "Email & password" },
];

export default function Shell({
  email,
  demoLogin,
  children,
}: {
  email: string;
  demoLogin: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const link = (item: (typeof NAV)[number], mobile = false) => {
    const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => setOpen(false)}
        className={
          "block rounded-xl px-4 py-2.5 text-sm transition " +
          (mobile ? "whitespace-nowrap " : "") +
          (active
            ? "bg-lime font-bold text-teal-900"
            : "text-pearl/80 hover:bg-teal-700/70 hover:text-pearl")
        }
      >
        {item.label}
      </Link>
    );
  };

  return (
    <div className="min-h-dvh bg-pearl lg:grid lg:grid-cols-[17rem_1fr]">
      <aside className="hidden bg-teal-800 p-5 lg:block">
        <div className="rounded-2xl bg-teal-900/50 p-4">
          <p className="eyebrow text-lime">PhysioCare</p>
          <p className="mt-1 font-display text-lg font-extrabold text-pearl">Admin panel</p>
          <p className="mt-2 truncate text-xs text-pearl/60" title={email}>
            {email}
          </p>
        </div>
        <nav className="mt-5 space-y-1">{NAV.map((item) => link(item))}</nav>
        <div className="mt-6 space-y-2 border-t border-teal-700/60 pt-5">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="block rounded-xl px-4 py-2.5 text-sm font-semibold text-pearl/80 hover:bg-teal-700/70"
          >
            View website ↗
          </a>
          <Logout />
        </div>
      </aside>

      <div className="flex min-h-dvh flex-col">
        <header className="flex items-center justify-between gap-3 bg-teal-800 px-5 py-4 lg:hidden">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded-xl bg-lime px-4 py-2 text-sm font-bold text-teal-900"
            aria-expanded={open}
          >
            {open ? "Close menu" : "Menu"}
          </button>
          <span className="truncate text-xs text-pearl/70">{email}</span>
          <Logout />
        </header>

        {open && (
          <nav className="flex gap-2 overflow-x-auto bg-teal-900 px-4 py-3 lg:hidden">
            {NAV.map((item) => link(item, true))}
          </nav>
        )}

        {demoLogin && (
          <div className="border-b border-amber-200 bg-amber-50 px-5 py-3 text-sm text-amber-900">
            You are still using the seeded demo login.{" "}
            <Link href="/admin/security" className="font-bold underline">
              Change your email and password
            </Link>{" "}
            so nobody else can sign in.
          </div>
        )}

        <main className="flex-1 px-5 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  );
}

function Logout() {
  const router = useRouter();
  async function signOut() {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => null);
    router.replace("/admin/login");
    router.refresh();
  }
  return (
    <button
      type="button"
      onClick={signOut}
      className="block w-full rounded-xl px-4 py-2.5 text-left text-sm font-semibold text-pearl/80 hover:bg-teal-700/70"
    >
      Sign out
    </button>
  );
}
