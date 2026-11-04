import { siteConfig, telUrl, whatsappUrl } from "@/lib/site-config";
import { PhoneIcon, WhatsAppIcon } from "./icons";

const columns = [
  {
    title: "Treatments",
    links: [
      ["Orthopaedic rehab", "#services"],
      ["Sports injury", "#services"],
      ["Neuro physiotherapy", "#services"],
      ["Post-surgical recovery", "#services"],
    ],
  },
  {
    title: "Clinic",
    links: [
      ["About us", "#about"],
      ["Pricing", "#pricing"],
      ["Patient reviews", "#reviews"],
      ["Health tips", "#blog"],
    ],
  },
  {
    title: "Help",
    links: [
      ["Book appointment", "#book"],
      ["FAQs", "#faq"],
      ["Contact", "#contact"],
      ["Home visits", "#pricing"],
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-teal-950 text-pearl/75">
      <div className="container-x grid gap-12 py-16 lg:grid-cols-[1.2fr_repeat(3,minmax(0,0.8fr))]">
        <div>
          <div className="flex items-center gap-3 text-pearl">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-lime font-display text-lg font-extrabold text-teal-800">
              PC
            </span>
            <span className="font-display text-lg font-bold">{siteConfig.clinicName}</span>
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed">
            {siteConfig.tagline}. One-to-one physiotherapy assessment, hands-on treatment and
            structured rehabilitation.
          </p>
          <p className="mt-5 text-sm">
            {siteConfig.addressLine1}
            <br />
            {siteConfig.addressLine2}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-lime px-4 py-2 text-sm font-bold text-teal-900 hover:bg-lime-dark"
            >
              <WhatsAppIcon className="h-4 w-4" /> WhatsApp
            </a>
            <a
              href={telUrl()}
              className="inline-flex items-center gap-2 rounded-full border border-pearl/25 px-4 py-2 text-sm font-semibold text-pearl hover:bg-teal-800"
            >
              <PhoneIcon className="h-4 w-4" /> {siteConfig.phoneNumber}
            </a>
          </div>
        </div>

        {columns.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <h2 className="eyebrow text-lime">{c.title}</h2>
            <ul className="mt-5 space-y-3 text-sm">
              {c.links.map(([label, href]) => (
                <li key={label}>
                  <a href={href} className="transition hover:text-lime">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-pearl/10">
        <div className="container-x flex flex-col gap-2 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.clinicName}. All rights reserved.
          </p>
          <p>
            Demo website — pricing, reviews and team details are sample data. Results vary;
            physiotherapy is not a substitute for medical diagnosis.
          </p>
        </div>
      </div>
    </footer>
  );
}
