# PhysioCare Clinic — physiotherapy website

Next.js 16 + Tailwind v4 + MongoDB Atlas. One-page clinic site (services, about, pricing,
reviews, FAQs, health articles) with a booking form and a contact form that store submissions
in MongoDB, plus always-visible WhatsApp and Call buttons.

**Palette:** deep midnight teal `#0B3048` · soft pearl `#F2F0E9` · vibrant neon lime `#B9F12F`

---

## 1. Change the clinic name, phone and WhatsApp number

Everything lives in **one file**: [`lib/site-config.ts`](lib/site-config.ts)

```ts
clinicName: "PhysioCare Clinic",   // website name — header, footer, SEO title, meta
whatsappNumber: "919999900000",    // digits only, international format (India = 91 + mobile)
phoneNumber: "+91 99999 00000",    // what visitors see on screen
phoneDial: "+919999900000",        // what the tel: link dials
email: "care@physiocareclinic.in",
addressLine1: "...", addressLine2: "...", mapsUrl: "https://maps.google.com/?q=...",
colors: { midnightTeal: "#0B3048", pearl: "#F2F0E9", lime: "#B9F12F" },
```

Save → `npm run build` → deploy. The name, both numbers, the WhatsApp links (29 of them across
the page) and the colour scheme all update together. Nothing else needs editing.

## 2. Demo data

[`data/demo-content.mjs`](data/demo-content.mjs) holds 6 services, 4 packages, 3 team members,
5 reviews, 6 FAQs, 4 health articles and sample inbox records. It is both the seed source and the
offline fallback — if Atlas is unreachable the site still renders instead of showing blanks.

Seed it into your database (name it `physiocare` in Atlas, or pass `MONGODB_DBNAME`):

```bash
MONGODB_URI="mongodb+srv://user:pass@host/" npm run seed
# or put the string in gitignored uri.txt and just run: npm run seed
```

The script replaces the content collections but **never overwrites real bookings or messages**.

## 3. Run locally

```bash
npm install          # or: npm run fetch-deps  (see note below)
MONGODB_URI="mongodb+srv://user:pass@host/" npm run dev
```

Open http://localhost:3000 — `/api/health` reports DB connectivity and document counts.

> **Flaky-TLS note (this machine):** npm's parallel downloader fails here with
> `ERR_SSL_CIPHER_OPERATION_FAILED`. `npm run fetch-deps` works around it by downloading the
> 112 packages one at a time with retries and extracting them into `node_modules`. Use it
> whenever a plain `npm install` dies mid-way.

## 4. Environment variables

| Variable | Where | Purpose | Required |
| --- | --- | --- | --- |
| `MONGODB_URI` | Vercel + Render | Atlas connection string (the only secret the app needs) | yes |
| `MONGODB_DBNAME` | optional | override the database name in the URI path | no |
| `ADMIN_TOKEN` | optional | unlocks `GET /api/inbox?token=…` for viewing bookings | no |
| `SITE_URL` | optional | canonical domain for `sitemap.xml` | no |

## 5. Publish on Vercel

1. Push this folder to a **private** GitHub repository.
2. vercel.com → **Add New… → Project** → import that repo → set **Root Directory** to `physio-site`.
3. Framework preset: **Next.js** (auto-detected). Build `npm run build`, start `npm run start`.
4. Environment Variables → add `MONGODB_URI` (Production, Preview, Development) → Deploy.
5. Settings → **Domain** → add your domain, then point the record at Vercel.

Atlas: **Network Access → Add IP Address → 0.0.0.0/0** (Vercel functions have no fixed IPs).
Prefer tightening this later to your own office IP only for seeding, and keep the website on a
separate Atlas user with read/write on this database only.

## 6. Publish on Render

`render.yaml` is already in the repo.

1. render.com → **New + → Blueprint** → import the same repo.
2. It picks up the `physiocare-clinic` web service: build `npm install --legacy-peer-deps && npm run build`,
   start `npm run start -- -p $PORT`, health check `/api/health`.
   (If the site sits in a `physio-site/` subfolder rather than the repo root, add
   `rootDir: physio-site` to that service in `render.yaml`.)
3. Paste the real `MONGODB_URI` (marked `sync: false`) when it asks, then deploy.
4. Add your domain under the service's **Settings → Domain** tab.

## 7. Where submissions go

- `POST /api/appointments` → `appointments` collection (`status: "new"` → confirm → `completed`)
- `POST /api/contact` → `messages` collection
- `GET /api/inbox?token=<ADMIN_TOKEN>` → plain-text list of both, no token = locked (403)
- Both endpoints validate server-side (name, 8–15 digit phone, future date, `HH:MM`, email format),
  rate-limit per IP, and silently accept a hidden honeypot field to swallow bot spam.

## 8. File map

```
app/                    layout, page (one-pager), blog, not-found, robots, sitemap, icon
app/api/                appointments · contact · health · inbox
components/             Header Hero Services Process About Pricing Testimonials Faqs Blog
                        BookingForm Footer FloatingActions Reveal SectionHead icons
data/demo-content.mjs   all demo content (seed source + offline fallback)
lib/site-config.ts      name, numbers, address, colours  ← edit this
lib/content.ts          Mongo-first loader with demo fallback
lib/mongo.ts            Atlas client, pooled + safe reads
lib/validation.ts       shared input guards
scripts/seed.mjs        loads demo data into Atlas
scripts/fetch-deps-offline.mjs  serial installer for this network
```

Secrets stay out of git: `uri.txt`, `.env*` and `node_modules` are gitignored. `.env.example`
contains only a placeholder.
