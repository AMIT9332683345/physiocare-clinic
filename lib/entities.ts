/**
 * Field definitions for everything the admin panel can write.
 * Used by the API to build forms and — importantly — to whitelist keys and
 * coerce every value to a primitive, so a crafted nested object can never
 * reach MongoDB as an operator like { $ne: "" }.
 */
import { COLL } from "./collections";

export type FieldType = "text" | "textarea" | "number" | "checkbox" | "list" | "slug" | "password";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  max?: number;
  min?: number;
  help?: string;
  placeholder?: string;
};

export type Entity = {
  key: string;
  collection: string;
  title: string;
  subtitle: string;
  /** Field used as the row label in admin lists. */
  label: string;
  /** Slug-like unique key, if the entity has one. */
  unique?: string;
  fields: Field[];
};

export const ENTITIES: Entity[] = [
  {
    key: "team",
    collection: COLL.team,
    title: "Doctors & therapists",
    subtitle: "Add, edit or remove the people shown in the About section.",
    label: "name",
    fields: [
      { name: "name", label: "Full name", type: "text", required: true, max: 80 },
      { name: "role", label: "Role", type: "text", required: true, max: 80, placeholder: "Chief Physiotherapist" },
      { name: "qualification", label: "Qualification", type: "text", max: 120, placeholder: "MPT (Orthopaedics)" },
      { name: "years", label: "Years of experience", type: "number", min: 0, max: 70 },
      { name: "focus", label: "Focus areas", type: "list", max: 60, help: "One per line — shown as chips." },
      { name: "bio", label: "Short bio", type: "textarea", required: true, max: 900 },
    ],
  },
  {
    key: "services",
    collection: COLL.services,
    title: "Services",
    subtitle: "The treatment tracks listed on the home page.",
    label: "title",
    unique: "slug",
    fields: [
      { name: "title", label: "Service name", type: "text", required: true, max: 90 },
      { name: "slug", label: "URL slug", type: "slug", max: 90, help: "Leave blank to generate from the name." },
      {
        name: "icon",
        label: "Icon",
        type: "text",
        max: 20,
        placeholder: "spine | bolt | brain | shield | heart | walk",
      },
      { name: "short", label: "One-line summary", type: "textarea", required: true, max: 300 },
      { name: "description", label: "Full description", type: "textarea", max: 900 },
      { name: "duration", label: "Session length (minutes)", type: "number", min: 10, max: 180 },
      { name: "points", label: "Bullet points", type: "list", max: 120, help: "One per line." },
    ],
  },
  {
    key: "packages",
    collection: COLL.packages,
    title: "Pricing packages",
    subtitle: "Prices are in rupees and shown as ₹ on the site.",
    label: "name",
    fields: [
      { name: "name", label: "Package name", type: "text", required: true, max: 60 },
      { name: "price", label: "Total price (₹)", type: "number", required: true, min: 0, max: 10_000_000 },
      { name: "sessions", label: "Number of sessions", type: "number", required: true, min: 1, max: 100 },
      { name: "perSession", label: "Per-session price (₹)", type: "number", min: 0, max: 10_000_000, help: "Blank = price ÷ sessions." },
      { name: "tagline", label: "Tagline", type: "text", max: 120 },
      { name: "features", label: "What is included", type: "list", max: 120 },
      { name: "highlighted", label: "Show as “Most booked”", type: "checkbox" },
    ],
  },
  {
    key: "testimonials",
    collection: COLL.testimonials,
    title: "Patient reviews",
    subtitle: "Only add reviews from patients who agreed to be quoted.",
    label: "name",
    fields: [
      { name: "name", label: "Patient name", type: "text", required: true, max: 60 },
      { name: "city", label: "Area / city", type: "text", max: 60 },
      { name: "condition", label: "What we treated", type: "text", max: 80, placeholder: "Frozen shoulder" },
      { name: "rating", label: "Rating (1–5)", type: "number", min: 1, max: 5 },
      { name: "text", label: "Review", type: "textarea", required: true, max: 600 },
    ],
  },
  {
    key: "faqs",
    collection: COLL.faqs,
    title: "FAQs",
    subtitle: "Questions that come up at the front desk.",
    label: "q",
    fields: [
      { name: "q", label: "Question", type: "text", required: true, max: 160 },
      { name: "a", label: "Answer", type: "textarea", required: true, max: 1200 },
    ],
  },
  {
    key: "articles",
    collection: COLL.articles,
    title: "Health articles",
    subtitle: "Published under /blog/<slug>.",
    label: "title",
    unique: "slug",
    fields: [
      { name: "title", label: "Headline", type: "text", required: true, max: 140 },
      { name: "slug", label: "URL slug", type: "slug", max: 140, help: "Leave blank to generate from the headline." },
      { name: "category", label: "Category", type: "text", max: 40, placeholder: "Spine" },
      { name: "readTime", label: "Read time", type: "text", max: 30, placeholder: "6 min read" },
      { name: "date", label: "Date (YYYY-MM-DD)", type: "text", max: 10 },
      { name: "excerpt", label: "Summary", type: "textarea", required: true, max: 300 },
      { name: "body", label: "Paragraphs", type: "list", max: 1200, help: "Leave a blank line between paragraphs — each becomes one block." },
    ],
  },
];

export function findEntity(key: string): Entity | undefined {
  return ENTITIES.find((e) => e.key === key);
}

const slugify = (v: string) =>
  v
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 140);

/** Coerce one submitted value to a safe primitive for the given field. */
export function coerce(field: Field, raw: unknown): { value: unknown; error?: string } {
  const isPlain = typeof raw === "string" || typeof raw === "number" || typeof raw === "boolean";
  if (raw == undefined || raw === "" || !isPlain) {
    if (field.required) return { value: null, error: `${field.label} is required` };
    return { value: defaultFor(field), error: field.required ? `${field.label} is required` : undefined };
  }

  const asText = String(raw);

  switch (field.type) {
    case "number": {
      const num = Number(asText.replace(/[^\d.-]/g, ""));
      if (!Number.isFinite(num)) return { value: null, error: `${field.label} must be a number` };
      const max = field.max ?? Number.MAX_SAFE_INTEGER;
      const min = field.min ?? -Number.MAX_SAFE_INTEGER;
      if (num < min || num > max) {
        return { value: null, error: `${field.label} must be between ${min} and ${max}` };
      }
      return { value: Math.round(num) };
    }
    case "checkbox":
      return { value: ["true", "on", "1", "yes"].includes(asText.toLowerCase()) };
    case "list": {
      const items = asText
        .split(/\r?\n|,(?![^A-Za-z0-9]*\d)/)
        .map((s) => s.trim().slice(0, field.max ?? 200))
        .filter(Boolean)
        .slice(0, 40);
      if (field.required && !items.length) return { value: null, error: `${field.label} is required` };
      return { value: items };
    }
    case "slug":
      return { value: slugify(asText) };
    case "textarea": {
      const clean = asText.replace(/\r\n/g, "\n").trim();
      if (field.required && !clean) return { value: null, error: `${field.label} is required` };
      if (clean.length > (field.max ?? 2000)) {
        return { value: null, error: `${field.label} is too long (max ${field.max} characters)` };
      }
      return { value: clean };
    }
    default: {
      const clean = asText.replace(/\s+/g, " ").trim();
      if (field.required && !clean) return { value: null, error: `${field.label} is required` };
      if (clean.length > (field.max ?? 200)) {
        return { value: null, error: `${field.label} is too long (max ${field.max} characters)` };
      }
      return { value: clean };
    }
  }
}

function defaultFor(field: Field): unknown {
  switch (field.type) {
    case "number":
      return field.name === "rating" ? 5 : field.name === "duration" ? 45 : 0;
    case "checkbox":
      return false;
    case "list":
      return [];
    default:
      return "";
  }
}

/** Turn a submitted form/JSON body into a validated document for an entity. */
export function buildDocument(
  entity: Entity,
  input: Record<string, unknown>
): { doc: Record<string, unknown>; errors: string[] } {
  const doc: Record<string, unknown> = {};
  const errors: string[] = [];

  for (const field of entity.fields) {
    const out = coerce(field, input[field.name]);
    if (out.error) errors.push(out.error);
    else doc[field.name] = out.value;
  }

  if (entity.unique === "slug" && !doc.slug) {
    doc.slug = slugify(String(doc.title ?? doc.name ?? ""));
  }
  if (entity.unique === "slug" && !doc.slug) {
    errors.push("Could not build a URL slug — add a title.");
  }

  return { doc, errors };
}
