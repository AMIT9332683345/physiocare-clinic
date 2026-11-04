import type { Service } from "@/lib/content";
import { getSettings, waFor } from "@/lib/settings";
import { ArrowRightIcon, ClockIcon, ServiceIcon } from "./icons";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";

export default async function Services({ services }: { services: Service[] }) {
  const settings = await getSettings();
  return (
    <section id="services" className="bg-pearl py-20 lg:py-28">
      <div className="container-x">
        <SectionHead
          eyebrow="What we treat"
          title="Six therapy tracks, one honest assessment first"
          intro="You are not funnelled into a generic routine. The first session decides the track, and we tell you if another clinic or a doctor is the better next step."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.slug || s.title} delay={i * 60}>
              <article className="card-surface group flex h-full flex-col p-7 transition duration-300 hover:-translate-y-1 hover:shadow-lift">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-teal-800 text-lime transition group-hover:bg-lime group-hover:text-teal-800">
                  <ServiceIcon name={s.icon} className="h-7 w-7" />
                </span>

                <h3 className="mt-6 font-display text-xl font-bold text-teal-800">{s.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-teal-800/70">{s.short}</p>

                <ul className="mt-5 space-y-2 border-t border-pearl-dark pt-5">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-sm text-teal-800/80">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-lime-dark" />
                      {p}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-teal-600">
                    <ClockIcon className="h-4 w-4" /> {s.duration} min
                  </span>
                  <a
                    href={waFor(settings, 
                      `Hi, I think I need ${s.title.toLowerCase()} physiotherapy. Can you share the next available slot?`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-800 hover:text-lime-dark"
                  >
                    Enquire <ArrowRightIcon className="h-4 w-4" />
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
