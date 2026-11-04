"use client";

import { telFor, waFor } from "@/lib/contact-links";
import type { Settings } from "@/lib/settings";
import { PhoneIcon, WhatsAppIcon } from "./icons";

/** Sticky WhatsApp + Call buttons — always reachable while scrolling. */
export default function FloatingActions({ settings }: { settings: Settings }) {
  return (
    <div className="fixed bottom-5 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-7 sm:right-6">
      <a
        href={waFor(settings)}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-3 rounded-full bg-lime py-3.5 pl-4 pr-5 font-semibold text-teal-900 shadow-[0_16px_40px_-12px_rgba(185,241,47,0.75)] transition hover:scale-[1.03]"
        aria-label={`Chat with ${settings.clinicName} on WhatsApp`}
      >
        <WhatsAppIcon className="h-6 w-6" />
        <span className="hidden sm:inline">WhatsApp</span>
      </a>

      <a
        href={telFor(settings)}
        className="group flex items-center gap-3 rounded-full bg-teal-800 py-3.5 pl-4 pr-5 font-semibold text-pearl shadow-[0_16px_40px_-14px_rgba(4,25,42,0.8)] ring-1 ring-lime/40 transition hover:scale-[1.03] hover:bg-teal-700"
        aria-label={`Call ${settings.clinicName}`}
      >
        <PhoneIcon className="h-6 w-6 text-lime" />
        <span className="hidden text-sm sm:inline">{settings.phoneNumber}</span>
      </a>
    </div>
  );
}
