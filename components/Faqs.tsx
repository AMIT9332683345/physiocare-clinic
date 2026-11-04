import type { Faq } from "@/lib/content";
import { ChevronIcon } from "./icons";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";

export default function Faqs({ faqs }: { faqs: Faq[] }) {
  return (
    <section id="faq" className="bg-pearl-dark/45 py-20 lg:py-28">
      <div className="container-x grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <SectionHead
          eyebrow="Before you book"
          title="Questions patients ask us most"
          intro="Still unsure? Send one WhatsApp message — a physiotherapist replies, not a chatbot."
        />

        <div className="grid gap-3">
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={i * 50}>
              <details className="group card-surface overflow-hidden px-6 py-4 open:shadow-lift">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-[15px] font-bold text-teal-800 marker:content-none">
                  {f.q}
                  <ChevronIcon className="h-5 w-5 shrink-0 text-teal-600 transition group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-teal-800/70">{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
