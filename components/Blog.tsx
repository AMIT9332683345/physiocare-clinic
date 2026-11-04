import Link from "next/link";
import type { Article } from "@/lib/content";
import { ArrowRightIcon } from "./icons";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";

export default function Blog({ articles }: { articles: Article[] }) {
  return (
    <section id="blog" className="bg-pearl py-20 lg:py-28">
      <div className="container-x">
        <SectionHead
          eyebrow="Health tips"
          title="Written by the physios, not the marketing team"
          intro="Short, practical reads on the complaints we see every week."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {articles.slice(0, 4).map((a, i) => (
            <Reveal key={a.slug} delay={i * 70}>
              <Link
                href={`/blog/${a.slug}`}
                className="card-surface group flex h-full flex-col p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <span className="w-fit rounded-full bg-lime-soft px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-teal-700">
                  {a.category}
                </span>
                <h3 className="mt-4 font-display text-lg font-bold leading-snug text-teal-800 group-hover:text-teal-600">
                  {a.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-teal-800/65">{a.excerpt}</p>
                <span className="mt-5 flex items-center justify-between border-t border-pearl-dark pt-4 text-xs font-semibold text-teal-600">
                  {a.readTime}
                  <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
