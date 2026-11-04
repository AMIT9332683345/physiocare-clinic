import { ArrowRightIcon, WhatsAppIcon } from "./icons";
import { siteConfig, telUrl, whatsappUrl } from "@/lib/site-config";
import Reveal from "./Reveal";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-teal-800 text-pearl">
      {/* decorative palette wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-32 h-[28rem] w-[28rem] rounded-full bg-lime/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-32 h-[26rem] w-[26rem] rounded-full bg-teal-500/25 blur-3xl"
      />

      <div className="container-x relative grid items-center gap-14 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
        <div>
          <Reveal>
            <span className="eyebrow inline-flex items-center gap-2 rounded-full bg-teal-700/70 px-4 py-2 text-lime">
              <span className="h-2 w-2 rounded-full bg-lime" />
              {siteConfig.hoursWeek}
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] sm:text-5xl lg:text-6xl">
              {siteConfig.tagline}
              <span className="block text-lime">with one-to-one physiotherapy</span>
            </h1>
          </Reveal>

          <Reveal delay={140}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-pearl/80">
              {siteConfig.clinicName} is a {siteConfig.ownerName}-led rehabilitation clinic for back
              and neck pain, sports injuries, post-surgical recovery and long-term mobility. Real
              assessment, hands-on treatment, and a home plan you can keep to.
            </p>
          </Reveal>

          <Reveal delay={200}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-lime btn-lime-hover"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Book on WhatsApp
              </a>
              <a href={telUrl()} className="btn-ghost btn-lime-hover text-pearl hover:bg-teal-700">
                Call {siteConfig.phoneNumber}
              </a>
              <a
                href="#book"
                className="inline-flex items-center gap-2 text-sm font-semibold text-lime hover:text-pearl"
              >
                Or send a booking request <ArrowRightIcon className="h-4 w-4" />
              </a>
            </div>
          </Reveal>

          <Reveal delay={260}>
            <dl className="mt-12 grid max-w-lg grid-cols-2 gap-x-8 gap-y-6 border-t border-pearl/15 pt-8 sm:grid-cols-4">
              {[
                ["3,400+", "Patients treated"],
                ["12 yrs", "Clinical experience"],
                ["4.9★", "Average rating"],
                ["6", "Speciality tracks"],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="font-display text-2xl font-bold text-lime">{value}</dt>
                  <dd className="mt-1 text-xs uppercase tracking-wider text-pearl/60">{label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <Reveal delay={120}>
          <div className="relative">
            <div className="card-surface border-pearl/10 bg-teal-900/60 p-7 backdrop-blur">
              <p className="eyebrow text-lime">Today at the clinic</p>
              <ul className="mt-5 space-y-4 text-sm">
                {[
                  ["Initial assessment", "45–60 min · posture, movement & strength screen"],
                  ["Hands-on treatment", "Manual therapy, dry needling, modalities"],
                  ["Progress review", "Measured every 4–6 sessions, not guessed"],
                ].map(([t, d]) => (
                  <li key={t} className="flex gap-3 rounded-xl bg-teal-800/70 p-4 ring-1 ring-pearl/10">
                    <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-lime" />
                    <span>
                      <span className="block font-semibold text-pearl">{t}</span>
                      <span className="block text-pearl/65">{d}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 rounded-xl bg-lime/12 p-4 text-sm text-pearl/85 ring-1 ring-lime/25">
                <strong className="text-lime">Same-week slots.</strong> Message your problem on
                WhatsApp and we reply with the next available time — usually within 2 hours.
              </div>
            </div>
            <div className="absolute -bottom-5 -left-5 hidden rounded-2xl bg-pearl px-5 py-4 shadow-lift sm:block">
              <p className="font-display text-sm font-bold text-teal-800">
                {siteConfig.credentials}
              </p>
              <p className="text-xs text-teal-600">Treatment led by the senior physio, every time</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
