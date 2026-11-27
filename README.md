# PhysioCare Clinic — physiotherapy website

Next.js 16 + Tailwind v4 + MongoDB Atlas. One-page clinic site (services, about, pricing,
reviews, FAQs, health articles) with a booking form, a contact form, always-visible WhatsApp
and Call buttons, link previews when the URL is shared, and a password-protected admin panel
where the clinic name, contacts, bio, colours, doctors, services, prices, reviews, FAQs and
articles are all editable without redeploying.

**Palette:** deep midnight teal `#0B3048` · soft pearl `#F2F0E9` · vibrant neon lime `#B9F12F`

---


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


