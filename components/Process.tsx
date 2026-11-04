import Reveal from "./Reveal";
import SectionHead from "./SectionHead";

export default function Process({
  steps,
}: {
  steps: { title: string; text: string }[];
}) {
  return (
    <section id="process" className="bg-teal-800 py-20 text-pearl lg:py-28">
      <div className="container-x">
        <SectionHead
          dark
          center
          eyebrow="How treatment works"
          title="Four steps, no mystery"
          intro="Every patient gets the same clear route — so you always know what this week is for."
        />

        <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 90}>
              <li className="relative h-full rounded-2xl bg-teal-900/60 p-7 ring-1 ring-pearl/10">
                <span className="font-display text-4xl font-extrabold text-lime/35">
                  0{i + 1}
                </span>
                <h3 className="mt-3 font-display text-lg font-bold">{s.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-pearl/70">{s.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
