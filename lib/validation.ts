/** Input guards shared by the booking and contact endpoints. */

export type Normalized = Record<string, string>;

const trim = (v: unknown, max: number) =>
  typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "";

export function digits(v: string) {
  return v.replace(/[^\d]/g, "");
}

export function validPhone(v: string) {
  const d = digits(v);
  return d.length >= 8 && d.length <= 15;
}

export function validEmail(v: string) {
  return !v || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
}

/** Date must be today or later (ISO yyyy-mm-dd). */
export function validFutureDate(v: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const d = new Date(`${v}T00:00:00`);
  if (Number.isNaN(d.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d >= today;
}

export function validTime(v: string) {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
}

/** A honeypot field: bots fill it, humans never see it. */
export function isSpam(fields: Record<string, unknown>) {
  return Boolean(trim(fields.company, 200));
}

export function normalize(input: Record<string, unknown>): Normalized {
  return {
    fullName: trim(input.fullName, 80),
    phone: trim(input.phone, 20),
    email: trim(input.email, 120).toLowerCase(),
    service: trim(input.service, 120),
    preferredDate: trim(input.preferredDate, 10),
    preferredTime: trim(input.preferredTime, 5),
    notes: trim(input.notes, 900),
    subject: trim(input.subject, 120),
    message: trim(input.message, 1500),
  };
}
