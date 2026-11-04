# PhysioCare Clinic — physiotherapy website

Next.js 16 + Tailwind v4 + MongoDB Atlas. One-page clinic site (services, about, pricing,
reviews, FAQs, health articles) with a booking form, a contact form, always-visible WhatsApp
and Call buttons, link previews when the URL is shared, and a password-protected admin panel
where the clinic name, contacts, bio, colours, doctors, services, prices, reviews, FAQs and
articles are all editable without redeploying.

**Palette:** deep midnight teal `#0B3048` · soft pearl `#F2F0E9` · vibrant neon lime `#B9F12F`

---

## 1. Admin panel — edit everything from the browser

Sign in at **`/admin/login`**.

> **Demo login (change it before you go live):**
> email `admin@physiocareclinic.in` · password `physio12345`

| Screen | What it edits |
| --- | --- |
| `/admin` | counts, new bookings/messages, what is currently live |
| `/admin/clinic` | clinic name, short name, tagline, owner bio, **WhatsApp number**, phone, email, address, Google Maps link, opening hours, Instagram/Facebook, the text pre-filled into the WhatsApp message, share text, live domain, bio paragraphs, and the three palette colours |
| `/admin/content/team` | add / edit / delete doctors & therapists |
| `/admin/content/services` · `/packages` · `/testimonials` · `/faqs` · `/articles` | the rest of the site content |
| `/admin/inbox` | bookings and contact messages — set status (new → confirmed → completed / cancelled), reply on WhatsApp, call, or email |
| `/admin/security` | **change the email and password** |

Everything is saved into one `settings` document plus the content collections in MongoDB and
is live on the site within ~15 seconds (there is a short cache, no rebuild involved).

Create the login on a fresh database:

```bash
npm run seed:admin
# custom credentials: ADMIN_EMAIL=you@clinic.in ADMIN_PASSWORD=longpassword npm run seed:admin
```

It writes the scrypt password hash into the `admins` collection and adds
`ADMIN_SESSION_SECRET` + `MONGODB_URI` to `.env.local` if they are missing.

How the auth works: `scrypt` password hashes, an HMAC-signed 12-hour session cookie, a
double-submit CSRF header on every write, and 15-minute IP lockout after 8 failed logins.
`/admin` pages and `/api/admin/*` all re-verify the signature server-side.

## 2. Link preview when the URL is shared

WhatsApp, iMessage, Facebook, X and LinkedIn all read Open Graph tags:

- [`app/(site)/layout.tsx`](app\(site)\layout.tsx) sets `metadataBase`, title, description,
  `og:` and `twitter:` from the live settings — so the preview shows the name and tagline you
  typed in `/admin/clinic`.
- [`app/(site)/opengraph-image.tsx`](app\(site)\opengraph-image.tsx) generates a 1200×630 PNG
  card (clinic name, tagline, phone) in your current colours. Each blog post gets its own card
  from `app/(site)/blog/[slug]/opengraph-image.tsx`.
- To use your own photo instead, put its URL (or a `/path` under `public/`) in
  **Share image** on `/admin/clinic`.

Test a preview at https://opengraph.xyz or by sending the link to yourself on WhatsApp.
Apps cache aggressively — re-share from a different chat or wait a few minutes.

## 3. Changing name / numbers without the panel

The code defaults still live in **one file**: [`lib/site-config.ts`](lib/site-config.ts).
It is the fallback when MongoDB is unreachable and the seed source for the settings doc.
Values saved in `/admin/clinic` take precedence over it.

## 4. Demo data

[`data/demo-content.mjs`](data/demo-content.mjs) holds 6 services, 4 packages, 3 team members,
5 reviews, 6 FAQs, 4 health articles and sample inbox records. It is both the seed source and
the offline fallback — if Atlas is unreachable the site still renders instead of showing blanks.

```bash
MONGODB_URI="mongodb+srv://user:pass@host/" npm run seed
# or put the string in gitignored uri.txt and just run: npm run seed
```

The script replaces the content collections but **never overwrites real bookings or messages**.

## 5. Run locally

```bash
npm install          # or: npm run fetch-deps  (see note below)
npm run seed:admin   # first time only — creates the demo login
npm run dev
```

Open http://localhost:3000 (site) and http://localhost:3000/admin (panel).
`/api/health` reports DB connectivity and document counts.

> **Flaky-TLS note (this machine):** npm's parallel downloader fails here with
> `ERR_SSL_CIPHER_OPERATION_FAILED`. `npm run fetch-deps` works around it by downloading the
> packages one at a time with retries and extracting them into `node_modules`. Use it whenever
> a plain `npm install` dies mid-way.

## 6. Environment variables

| Variable | Where | Purpose | Required |
| --- | --- | --- | --- |
| `MONGODB_URI` | Vercel + Render | Atlas connection string | yes |
| `ADMIN_SESSION_SECRET` | Vercel + Render | signs the admin session cookie; ≥16 chars, login refuses to work in production without it | **yes** |
| `SITE_URL` | optional | canonical domain for share previews and `sitemap.xml`; also editable in `/admin/clinic` | no |
| `MONGODB_DBNAME` | optional | override the database name in the URI path | no |
| `ADMIN_TOKEN` | optional | unlocks `GET /api/inbox?token=…` for a quick text list of bookings | no |

Generate the secret once:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 7. Publish on Vercel

1. Push this folder to GitHub.
2. vercel.com → **Add New… → Project** → import the repo → **Root Directory** `physio-site`.
3. Framework preset **Next.js**. Build `npm run build`, start `npm run start`.
4. Environment Variables → `MONGODB_URI` and `ADMIN_SESSION_SECRET` (Production, Preview,
   Development) → Deploy.
5. Settings → **Domain** → add your domain, then set that URL as **Site URL** on
   `/admin/clinic` so previews and the sitemap use it.

Atlas: **Network Access → Add IP Address → 0.0.0.0/0** (Vercel has no fixed IPs).
Seeding from your laptop needs your own IP, and a changed home IP shows up as a TLS error, not
a login error.

## 8. Publish on Render

`render.yaml` is already in the repo.

1. render.com → **New + → Blueprint** → import the same repo.
2. It picks up the `physiocare-clinic` web service: build `npm install --legacy-peer-deps && npm run build`,
   start `npm run start -- -p $PORT`, health check `/api/health`.
   (If the site sits in a `physio-site/` subfolder rather than the repo root, add
   `rootDir: physio-site` to that service in `render.yaml`.)
3. Paste `MONGODB_URI` and `ADMIN_SESSION_SECRET` when it asks (both are `sync: false`), then deploy.
4. Add your domain under **Settings → Domain**, then set it as **Site URL** in the panel.

## 9. Where submissions go

- `POST /api/appointments` → `appointments` collection (`status: "new"` → confirm → `completed`)
- `POST /api/contact` → `messages` collection
- `/admin/inbox` (signed in) is the normal way to read them;
  `GET /api/inbox?token=<ADMIN_TOKEN>` returns a plain-text list for scripts
- Both public endpoints validate server-side (name, 8–15 digit phone, future date, `HH:MM`,
  email format), rate-limit per IP, and silently accept a hidden honeypot field to swallow bots.

## 10. File map

```
app/(site)/               one-pager, blog, layout (live metadata), opengraph-image, robots, sitemap, icon
app/admin/                login + panel pages (clinic, content/[entity], inbox, security)
app/api/admin/            auth · settings · credentials · [entity] CRUD · inbox
app/api/                  appointments · contact · health · inbox
components/               Header Hero Services Process About Pricing Testimonials Faqs Blog
                          BookingForm Footer FloatingActions Reveal SectionHead icons
components/admin/         Shell LoginForm SettingsForm EntityManager Inbox SecurityForm api
data/demo-content.mjs     all demo content (seed source + offline fallback)
lib/site-config.ts        default name, numbers, address, colours  ← edit for fresh installs
lib/settings.ts           merges the saved settings doc over those defaults (15 s cache)
lib/entities.ts           field definitions the admin forms + CRUD API are built from
lib/auth.ts               scrypt hashes, signed session cookie, CSRF, login throttling
proxy.ts                  cookie gate for /admin/* (Next 16 replacement for middleware.ts)
scripts/seed.mjs          loads demo content into Atlas
scripts/seed-admin.mjs    creates the admin login + .env.local
scripts/fetch-deps-offline.mjs  serial installer for this network
```

Secrets stay out of git: `uri.txt`, `.env*` and `node_modules` are gitignored. `.env.example`
contains only placeholders.
