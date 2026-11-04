import type { Package } from "@/lib/content";
import { siteConfig, whatsappUrl } from "@/lib/site-config";
import { CheckIcon, WhatsAppIcon } from "./icons";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";

const inr = (v: number) => `₹${v.toLocaleString("en-IN")}`;

export default function Pricing({ packages }: { packages: Package[] }) {
  return (
    <section id="pricing" className="bg-pearl-dark/45 py-20 lg:py-28">
      <div className="container-x">
        <SectionHead
          center
          eyebrow="Transparent pricing"
          title="Packages that cost less per session"
          intro={`Demo pricing for ${siteConfig.clinicName}. Pay by UPI, card or cash at the clinic; unused package sessions can be rescheduled free up to 4 hours before a slot.`}
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {packages.map((p, i) => (
            <Reveal key={p.name} delay={i * 70}>
              <article
                className={`relative flex h-full flex-col rounded-2xl p-7 transition duration-300 hover:-translate-y-1 ${
                  p.highlighted
                    ? "bg-teal-800 text-pearl shadow-lift ring-2 ring-lime"
                    : "card-surface"
                }`}
              >
                {p.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-lime px-4 py-1 text-[11px] font-extrabold uppercase tracking-wider text-teal-900">
                    Most booked
                  </span>
                )}

                <h3
                  className={`font-display text-lg font-bold ${
                    p.highlighted ? "text-lime" : "text-teal-800"
                  }`}
                >
                  {p.name}
                </h3>
                <p className={`mt-1 text-sm ${p.highlighted ? "text-pearl/70" : "text-teal-800/60"}`}>
                  {p.tagline}
                </p>

                <p className="mt-6 font-display text-4xl font-extrabold">
                  {inr(p.price)}
                  <span
                    className={`ml-2 text-sm font-semibold ${
                      p.highlighted ? "text-pearl/60" : "text-teal-800/55"
                    }`}
                  >
                    / {p.sessions} session{p.sessions > 1 ? "s" : ""}
                  </span>
                </p>
                <p
                  className={`mt-1.5 text-xs font-semibold uppercase tracking-wider ${
                    p.highlighted ? "text-lime" : "text-teal-600"
                  }`}
                >
                  {inr(p.perSession)} per session
                </p>

                <ul
                  className={`mt-6 flex-1 space-y-2.5 border-t pt-5 text-sm ${
                    p.highlighted
                      ? "border-pearl/15 text-pearl/80"
                      : "border-pearl-dark text-teal-800/75"
                  }`}
                >
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <CheckIcon
                        className={`mt-0.5 h-4 w-4 shrink-0 ${
                          p.highlighted ? "text-lime" : "text-lime-dark"
                        }`}
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href={whatsappUrl(
                    `Hi, I would like to book the "${p.name}" package (${inr(p.price)}). Please share available slots.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-7 flex items-center justify-center gap-2 rounded-full py-3 text-sm font-bold transition ${
                    p.highlighted
                      ? "bg-lime text-teal-900 hover:bg-lime-dark"
                      : "bg-teal-800 text-pearl hover:bg-teal-700"
                  }`}
                >
                  <WhatsAppIcon className="h-5 w-5" /> Book this
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
