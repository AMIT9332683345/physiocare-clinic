import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import { ArrowRightIcon, ClockIcon, WhatsAppIcon } from "@/components/icons";
import { loadContent } from "@/lib/content";
import { siteConfig, whatsappUrl } from "@/lib/site-config";

export const revalidate = 300;

async function find(slug: string) {
  const { articles } = await loadContent();
  return { article: articles.find((a) => a.slug === slug), others: articles.filter((a) => a.slug !== slug) };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { article } = await find(slug);
  if (!article) return { title: "Article not found" };
  return {
    title: article.title,
    description: article.excerpt,
    keywords: [article.category, "physiotherapy", siteConfig.clinicName],
    openGraph: { title: article.title, description: article.excerpt, type: "article" },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { article, others } = await find(slug);
  if (!article) notFound();

  return (
    <article className="bg-pearl">
      <header className="bg-teal-800 py-14 text-pearl lg:py-20">
        <div className="container-x max-w-3xl">
          <Link href="/blog" className="text-sm font-semibold text-lime hover:text-pearl">
            ← All health tips
          </Link>
          <span className="mt-6 block w-fit rounded-full bg-lime/15 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-lime ring-1 ring-lime/30">
            {article.category}
          </span>
          <h1 className="mt-5 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
            {article.title}
          </h1>
          <p className="mt-5 flex flex-wrap items-center gap-4 text-sm text-pearl/65">
            <span className="inline-flex items-center gap-1.5">
              <ClockIcon className="h-4 w-4" /> {article.readTime}
            </span>
            <span>Published {article.date}</span>
            <span>{siteConfig.clinicName}</span>
          </p>
        </div>
      </header>

      <div className="container-x grid max-w-5xl gap-12 py-16 lg:grid-cols-[1.4fr_0.6fr]">
        <div>
          <Reveal>
            <p className="text-lg font-medium leading-relaxed text-teal-800">{article.excerpt}</p>
          </Reveal>
          <div className="mt-8 space-y-6">
            {article.body.map((para, i) => (
              <Reveal key={i} delay={i * 50}>
                <p className="text-[17px] leading-[1.75] text-teal-800/80">{para}</p>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="card-surface mt-12 bg-teal-800 p-8">
              <h2 className="font-display text-xl font-bold text-pearl">
                Want this checked properly?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-pearl/70">
                Articles narrow things down; an assessment settles them. Book a 45–60 minute slot
                with a senior physiotherapist at {siteConfig.clinicName}.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={whatsappUrl(
                    `Hi, I read "${article.title}" on your website and I would like an assessment.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-lime btn-lime-hover"
                >
                  <WhatsAppIcon className="h-5 w-5" /> Book on WhatsApp
                </a>
                <a href="/#book" className="btn-ghost btn-lime-hover text-pearl hover:bg-teal-700">
                  Booking form
                </a>
              </div>
            </div>
          </Reveal>
        </div>

        <aside>
          <h2 className="eyebrow text-teal-600">Keep reading</h2>
          <div className="mt-5 grid gap-4">
            {others.slice(0, 4).map((o) => (
              <Link
                key={o.slug}
                href={`/blog/${o.slug}`}
                className="card-surface group block p-5 transition hover:-translate-y-0.5 hover:shadow-lift"
              >
                <p className="text-[11px] font-bold uppercase tracking-wider text-teal-600">
                  {o.category}
                </p>
                <p className="mt-2 font-display text-[15px] font-bold leading-snug text-teal-800 group-hover:text-teal-600">
                  {o.title}
                </p>
                <span className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-teal-600">
                  Read <ArrowRightIcon className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </article>
  );
}
