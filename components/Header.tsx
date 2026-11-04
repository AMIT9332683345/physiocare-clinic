"use client";

import { useEffect, useState } from "react";
import { siteConfig, telUrl, whatsappUrl } from "@/lib/site-config";
import { CloseIcon, MenuIcon, PhoneIcon, WhatsAppIcon } from "./icons";

const links = [
  { href: "#services", label: "Services" },
  { href: "#about", label: "About" },
  { href: "#pricing", label: "Pricing" },
  { href: "#reviews", label: "Reviews" },
  { href: "#blog", label: "Health tips" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-teal-800/95 shadow-lg shadow-teal-950/20 backdrop-blur"
          : "bg-teal-800"
      }`}
    >
      <div className="container-x flex h-20 items-center justify-between gap-4">
        <a href="#top" className="flex items-center gap-3 text-pearl">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-lime font-display text-lg font-extrabold text-teal-800">
            PC
          </span>
          <span className="leading-tight">
            <span className="block font-display text-lg font-bold">{siteConfig.clinicName}</span>
            <span className="block text-[11px] uppercase tracking-[0.18em] text-teal-300">
              Physiotherapy &amp; Rehab
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-pearl/85 transition hover:text-lime"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={telUrl()}
            className="btn-ghost text-pearl hover:bg-teal-700"
            aria-label={`Call ${siteConfig.clinicName}`}
          >
            <PhoneIcon className="h-5 w-5" />
            <span className="text-sm">{siteConfig.phoneNumber}</span>
          </a>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-lime text-sm"
          >
            <WhatsAppIcon className="h-5 w-5" />
            WhatsApp
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="grid h-11 w-11 place-items-center rounded-xl border border-pearl/25 text-pearl lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {open && (
        <div className="border-t border-pearl/10 bg-teal-800 lg:hidden">
          <div className="container-x grid gap-1 py-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2.5 text-pearl/90 hover:bg-teal-700"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-3">
              <a href={telUrl()} className="btn-ghost text-pearl">
                <PhoneIcon className="h-5 w-5" /> Call
              </a>
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-lime"
              >
                <WhatsAppIcon className="h-5 w-5" /> Chat
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
