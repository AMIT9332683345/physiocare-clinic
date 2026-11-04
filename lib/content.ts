/**
 * Site content loader. MongoDB is the source of truth once seeded; if the
 * database is empty or unreachable (deployed before the secret is set, Atlas
 * IP allowlist not updated yet) the bundled demo data is used instead, so the
 * website never renders an empty page.
 */
import demo, { collections } from "@/data/demo-content.mjs";
import { readCollection } from "./mongo";

type Row = Record<string, unknown>;

const cleanRows = <T extends Row>(rows: T[]): Omit<T, "_id">[] =>
  rows.map(({ _id, ...rest }) => rest as Omit<T, "_id">);

async function pick<T extends Row>(collection: string, fallback: T[], sort?: Record<string, 1 | -1>) {
  const rows = await readCollection<T>(collection, {}, sort);
  return rows && rows.length ? cleanRows(rows) : fallback;
}

export async function loadContent() {
  const [services, packages, team, testimonials, faqs, articles] = await Promise.all([
    pick(collections.services, demo.services, { order: 1 }),
    pick(collections.packages, demo.packages, { order: 1 }),
    pick(collections.team, demo.team, { order: 1 }),
    pick(collections.testimonials, demo.testimonials, { order: 1 }),
    pick(collections.faqs, demo.faqs, { order: 1 }),
    pick(collections.articles, demo.articles, { date: -1 }),
  ]);

  return {
    services: services.map(asService),
    packages: packages.map(asPackage),
    team: team.map(asTeam),
    testimonials: testimonials.map(asTestimonial),
    faqs: faqs.map(asFaq),
    articles: articles.map(asArticle),
    stats: demo.stats,
    process: demo.process,
  };
}

export type Service = ReturnType<typeof asService>;
export type Package = ReturnType<typeof asPackage>;
export type TeamMember = ReturnType<typeof asTeam>;
export type Testimonial = ReturnType<typeof asTestimonial>;
export type Faq = ReturnType<typeof asFaq>;
export type Article = ReturnType<typeof asArticle>;

const s = (v: unknown, d = "") => (typeof v === "string" && v ? v : d);
const n = (v: unknown, d = 0) => (typeof v === "number" && Number.isFinite(v) ? v : d);
const list = (v: unknown) => (Array.isArray(v) ? v.map(String) : []);

function asService(d: Row) {
  return {
    slug: s(d.slug),
    icon: s(d.icon, "spine"),
    title: s(d.title),
    short: s(d.short),
    description: s(d.description),
    duration: n(d.duration, 45),
    points: list(d.points),
  };
}

function asPackage(d: Row) {
  const price = n(d.price);
  const sessions = Math.max(1, n(d.sessions, 1));
  return {
    name: s(d.name),
    price,
    sessions,
    perSession: n(d.perSession, Math.round(price / sessions)),
    tagline: s(d.tagline),
    features: list(d.features),
    highlighted: d.highlighted === true,
  };
}

function asTeam(d: Row) {
  return {
    name: s(d.name),
    role: s(d.role),
    qualification: s(d.qualification),
    years: n(d.years),
    focus: list(d.focus),
    bio: s(d.bio),
  };
}

function asTestimonial(d: Row) {
  return {
    name: s(d.name),
    city: s(d.city),
    condition: s(d.condition),
    rating: n(d.rating, 5),
    text: s(d.text),
  };
}

function asFaq(d: Row) {
  return { q: s(d.q), a: s(d.a) };
}

function asArticle(d: Row) {
  return {
    slug: s(d.slug),
    title: s(d.title),
    category: s(d.category),
    readTime: s(d.readTime),
    date: s(d.date),
    excerpt: s(d.excerpt),
    body: list(d.body),
  };
}
