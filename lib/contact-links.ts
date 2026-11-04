/**
 * Pure link builders — safe to import from client components.
 * (lib/settings.ts pulls in the MongoDB driver, so it must not be.)
 */
import type { Settings } from "./settings";

/** WhatsApp deep link with the clinic's greeting or a bespoke message. */
export function waFor(s: Settings, message?: string): string {
  const digits = s.whatsappNumber.replace(/\D/g, "");
  const text = encodeURIComponent(message ?? s.whatsappGreeting);
  return `https://wa.me/${digits}?text=${text}`;
}

export function telFor(s: Settings): string {
  return `tel:${s.phoneDial.replace(/[^\d+]/g, "")}`;
}

/** Absolute URL for share previews; falls back to the incoming request host. */
export function publicUrl(s: Settings, req?: Request, path = "/"): string {
  const base = s.siteUrl || (req ? new URL(req.url).origin : "") || "http://localhost:3000";
  return new URL(path, base.replace(/\/$/, "") + "/").toString();
}
