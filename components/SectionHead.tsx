import Reveal from "./Reveal";

export default function SectionHead({
  eyebrow,
  title,
  intro,
  dark = false,
  center = false,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: string;
  dark?: boolean;
  center?: boolean;
}) {
  return (
    <Reveal className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className={`eyebrow ${dark ? "text-lime" : "text-teal-600"}`}>{eyebrow}</p>
      <h2
        className={`mt-3 text-3xl font-bold leading-tight sm:text-4xl ${
          dark ? "text-pearl" : "text-teal-800"
        }`}
      >
        {title}
      </h2>
      {intro && (
        <p className={`mt-4 text-base leading-relaxed ${dark ? "text-pearl/70" : "text-teal-800/70"}`}>
          {intro}
        </p>
      )}
    </Reveal>
  );
}
