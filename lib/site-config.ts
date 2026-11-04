/**
 * ============================================================
 *  DEFAULT BRAND VALUES.
 *  These are the fallbacks. Once the database is seeded, the live
 *  values come from the `settings` collection and can be changed
 *  without a redeploy at http://yoursite/admin — clinic name,
 *  phone, WhatsApp, address, bio, hours and share image.
 *  Edit here only if you prefer code over the admin panel.
 * ============================================================
 */

export const siteConfig = {
  // ---------- BRAND ----------
  clinicName: "PhysioCare Clinic",
  shortName: "PhysioCare",
  tagline: "Move better. Live pain-free.",
  ownerName: "Dr. Amit Kumar",
  credentials: "PT, MPT (Orthopaedics) — 12+ yrs",

  /** "About the physio" paragraph — shown on the site, editable in /admin. */
  bio: `Twelve years treating spines, shoulders, knees and post-surgical repairs, and the thing
patients remember is not the machine they were hooked to — it is being told plainly what is wrong and
what will fix it. That clinic runs that way on purpose: assess properly, treat with hands and
exercise, then show you the numbers that prove it worked.`,

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

  // ---------- SHARING ----------
  // Public URL of the deployed site (set SITE_URL as a deploy env var too).
  siteUrl: "",
  /** Image shown when the link is shared. Leave "" to auto-generate a branded one. */
  ogImage: "",
  shareTagline: "One-to-one physiotherapy. Book by WhatsApp in 30 seconds.",

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

/** Two-letter logo monogram derived from the clinic name. */
export function monogram(name: string): string {
  const letters = name
    .split(/[\s&-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
  return letters || "PC";
}
