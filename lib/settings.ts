/**
 * Live site settings: MongoDB `settings` document merged over the code
 * defaults in lib/site-config.ts. Short in-memory cache because a clinic
 * site has one writer and many readers.
 */
import { COLL } from "./collections";
import { readCollection } from "./mongo";
import { siteConfig } from "./site-config";

const TTL = 15_000;

let cache: { value: Settings; at: number } | null = null;

export type Settings = {
  clinicName: string;
  shortName: string;
  tagline: string;
  ownerName: string;
  credentials: string;
  bio: string;
  whatsappNumber: string;
  phoneNumber: string;
  phoneDial: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  mapsUrl: string;
  hoursWeek: string;
  hoursSunday: string;
  instagram: string;
  facebook: string;
  whatsappGreeting: string;
  siteUrl: string;
  ogImage: string;
  shareTagline: string;
  colors: { midnightTeal: string; pearl: string; lime: string };
};

const text = (v: unknown, fallback: string) =>
  typeof v === "string" && v.trim() ? v.trim() : fallback;

const obj = (v: unknown): Record<string, unknown> =>
  v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {};

export async function getSettings(): Promise<Settings> {
  if (cache && Date.now() - cache.at < TTL) return cache.value;

  const rows = await readCollection<Record<string, unknown>>(COLL.settings, {}, { order: 1 });
  const saved: Record<string, unknown> = rows && rows.length ? rows[0] : {};

  const value: Settings = {
    clinicName: text(saved.clinicName, siteConfig.clinicName),
    shortName: text(saved.shortName, siteConfig.shortName),
    tagline: text(saved.tagline, siteConfig.tagline),
    ownerName: text(saved.ownerName, siteConfig.ownerName),
    credentials: text(saved.credentials, siteConfig.credentials),
    bio: text(saved.bio, siteConfig.bio),
    whatsappNumber: text(saved.whatsappNumber, siteConfig.whatsappNumber),
    phoneNumber: text(saved.phoneNumber, siteConfig.phoneNumber),
    phoneDial: text(saved.phoneDial, siteConfig.phoneDial),
    email: text(saved.email, siteConfig.email),
    addressLine1: text(saved.addressLine1, siteConfig.addressLine1),
    addressLine2: text(saved.addressLine2, siteConfig.addressLine2),
    mapsUrl: text(saved.mapsUrl, siteConfig.mapsUrl),
    hoursWeek: text(saved.hoursWeek, siteConfig.hoursWeek),
    hoursSunday: text(saved.hoursSunday, siteConfig.hoursSunday),
    instagram: text(saved.instagram, siteConfig.instagram),
    facebook: text(saved.facebook, siteConfig.facebook),
    whatsappGreeting: text(saved.whatsappGreeting, siteConfig.whatsappGreeting),
    siteUrl: text(saved.siteUrl, process.env.SITE_URL ?? siteConfig.siteUrl),
    ogImage: text(saved.ogImage, siteConfig.ogImage),
    shareTagline: text(saved.shareTagline, siteConfig.shareTagline),
    colors: {
      midnightTeal: text(obj(saved.colors).midnightTeal, siteConfig.colors.midnightTeal),
      pearl: text(obj(saved.colors).pearl, siteConfig.colors.pearl),
      lime: text(obj(saved.colors).lime, siteConfig.colors.lime),
    },
  };

  cache = { value, at: Date.now() };
  return value;
}

export function invalidateSettings() {
  cache = null;
}

export { publicUrl, telFor, waFor } from "./contact-links";
