import type { Testimonial } from "@/lib/content";
import { StarIcon } from "./icons";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";

export default function Testimonials({ items }: { items: Testimonial[] }) {
  return (
    <section id="reviews" className="bg-pearl py-20 lg:py-28">
      <div className="container-x">
        <SectionHead
          eyebrow="Patient results"
          title="What people say after their course"
          intro="Demo reviews included so the layout is realistic. Replace them with your own via the `testimonials` collection or data/demo-content.mjs."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.slice(0, 6).map((t, i) => (
            <Reveal key={`${t.name}-${i}`} delay={i * 70}>
              <figure className="card-surface flex h-full flex-col p-7">
                <div className="flex gap-1 text-lime-dark" aria-label={`${t.rating} out of 5`}>
                  {Array.from({ length: t.rating }).map((_, k) => (
                    <StarIcon key={k} className="h-4 w-4" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-teal-800/80">
                  “{t.text}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-pearl-dark pt-5">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-teal-800 font-display text-sm font-bold text-lime">
                    {t.name.slice(0, 1)}
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-teal-800">{t.name}</span>
                    <span className="block text-xs text-teal-600">
                      {t.condition} · {t.city}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
