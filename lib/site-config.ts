/**
 * ============================================================
 *  ONE FILE TO EDIT — clinic name, phone, WhatsApp, colours.
 *  Change the values below, rebuild/deploy, and the whole
 *  website updates. Nothing else needs touching.
 * ============================================================
 */

export const siteConfig = {
  // ---------- BRAND ----------
  clinicName: "PhysioCare Clinic",
  shortName: "PhysioCare",
  tagline: "Move better. Live pain-free.",
  ownerName: "Dr. Amit Kumar",
  credentials: "PT, MPT (Orthopaedics) — 12+ yrs",

  // ---------- CONTACT (demo numbers — replace with yours) ----------
  // Use full international format, digits only, no "+" and no spaces.
  // India example: 91 + 10 digit mobile
  whatsappNumber: "919999900000",
  phoneNumber: "+91 99999 00000", // shown on screen as-is
  phoneDial: "+919999900000", // used by the tel: link
  email: "care@physiocareclinic.in",
  addressLine1: "2nd Floor, Wellness Plaza, MG Road",
  addressLine2: "Bengaluru, Karnataka 560001",
  mapsUrl: "https://maps.google.com/?q=MG+Road+Bengaluru",

  // ---------- HOURS ----------
  hoursWeek: "Mon – Sat · 8:00 AM – 8:00 PM",
  hoursSunday: "Sunday · By appointment",

  // ---------- SOCIAL (optional, leave "" to hide) ----------
  instagram: "",
  facebook: "",

  // ---------- COLOURS ----------
  colors: {
    midnightTeal: "#0B3048", // deep midnight teal
    pearl: "#F2F0E9", // soft pearl
    lime: "#B9F12F", // vibrant neon lime
  },

  // ---------- WHATSAPP PREFILLED MESSAGE ----------
  whatsappGreeting:
    "Hi! I found your website and I'd like to book a physiotherapy consultation.",
};

export type SiteConfig = typeof siteConfig;

/** Digits-only number for wa.me links. */
export function waDigits(): string {
  return siteConfig.whatsappNumber.replace(/\D/g, "");
}

/** https://wa.me/<number>?text=<prefilled message> */
export function whatsappUrl(message?: string): string {
  const text = encodeURIComponent(message ?? siteConfig.whatsappGreeting);
  return `https://wa.me/${waDigits()}?text=${text}`;
}

/** tel: link built from phoneDial. */
export function telUrl(): string {
  return `tel:${siteConfig.phoneDial.replace(/[^\d+]/g, "")}`;
}
