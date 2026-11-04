import Link from "next/link";
import { loadContent } from "@/lib/content";
import { waFor } from "@/lib/contact-links";
import { getSettings } from "@/lib/settings";
import Reveal from "@/components/Reveal";
import SectionHead from "@/components/SectionHead";
import { ArrowRightIcon, WhatsAppIcon } from "@/components/icons";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function BlogIndex() {
  const [{ articles }, settings] = await Promise.all([loadContent(), getSettings()]);

  return (
    <section className="bg-pearl py-16 lg:py-24">
      <div className="container-x">
        <SectionHead
          eyebrow="Health tips"
          title="Physiotherapy answers, in plain language"
          intro="Written by the treating team. Nothing here replaces an assessment — if your symptoms match, book one."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a, i) => (
            <Reveal key={a.slug} delay={i * 60}>
              <Link
                href={`/blog/${a.slug}`}
                className="card-surface group flex h-full flex-col p-7 transition duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <span className="w-fit rounded-full bg-lime-soft px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-teal-700">
                  {a.category}
                </span>
                <h3 className="mt-4 font-display text-xl font-bold leading-snug text-teal-800 group-hover:text-teal-600">
                  {a.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-teal-800/70">{a.excerpt}</p>
                <span className="mt-6 flex items-center justify-between border-t border-pearl-dark pt-4 text-xs font-semibold text-teal-600">
                  {a.readTime} · {a.date}
                  <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="card-surface mt-14 flex flex-col items-start justify-between gap-5 bg-teal-800 p-8 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-display text-2xl font-bold text-pearl">
                Reading about it will not fix it
              </h2>
              <p className="mt-2 text-sm text-pearl/70">
                One assessment tells you more than ten articles. Send your problem on WhatsApp and
                get a straight answer.
              </p>
            </div>
            <a
              href={waFor(settings)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-lime btn-lime-hover shrink-0"
            >
              <WhatsAppIcon className="h-5 w-5" /> Ask a physio
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
