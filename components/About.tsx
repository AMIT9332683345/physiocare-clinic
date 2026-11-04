import type { TeamMember } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";
import { CheckIcon } from "./icons";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";

const promises = [
  "Senior physiotherapist treats you — not an assistant",
  "Written plan with photos after every assessment",
  "Honest timeline: we say so when physio is not enough",
  "No machine-only sessions; hands-on plus exercise",
];

export default function About({ team }: { team: TeamMember[] }) {
  return (
    <section id="about" className="bg-pearl py-20 lg:py-28">
      <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.05fr]">
        <div>
          <SectionHead
            eyebrow="About the clinic"
            title={<>Physiotherapy that explains itself</>}
            intro={`Founded by ${siteConfig.ownerName} (${siteConfig.credentials}), ${siteConfig.clinicName} was built around one frustration patients kept reporting: being hooked up to machines for 40 minutes and sent home with no idea what changed.`}
          />

          <Reveal delay={100}>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-teal-800/75">
              We run the opposite way. You get a full movement and strength assessment, a clear
              diagnosis in plain language, treatment that is mostly hands-on plus active exercise, and
              numbers you can compare month over month. If your problem needs imaging or a surgeon's
              opinion first, we will say that in the first session instead of selling you twelve visits.
            </p>
          </Reveal>

          <Reveal delay={160}>
            <ul className="mt-8 space-y-3">
              {promises.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-lime text-teal-800">
                    <CheckIcon className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-medium text-teal-800/85">{p}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div>
          <Reveal>
            <p className="eyebrow text-teal-600">The team</p>
          </Reveal>
          <div className="mt-5 grid gap-5">
            {team.map((m, i) => (
              <Reveal key={m.name} delay={i * 80}>
                <article className="card-surface flex items-start gap-5 p-6">
                  <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-teal-800 font-display text-xl font-bold text-lime">
                    {m.name
                      .split(" ")
                      .filter((w) => /[A-Za-z]/.test(w))
                      .slice(-2)
                      .map((w) => w[0])
                      .join("")}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-bold text-teal-800">{m.name}</h3>
                    <p className="text-sm font-semibold text-teal-600">
                      {m.role} · {m.qualification}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-teal-800/70">{m.bio}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {m.focus.map((f) => (
                        <span
                          key={f}
                          className="rounded-full bg-lime-soft px-3 py-1 text-xs font-semibold text-teal-700"
                        >
                          {f}
                        </span>
                      ))}
                      <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-700">
                        {m.years} yrs
                      </span>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
