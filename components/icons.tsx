import type { ReactElement } from "react";

type P = { className?: string };

const base = "h-6 w-6";

export function WhatsAppIcon({ className = base }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M17.47 14.38c-.2-.1-1.16-.57-1.34-.64-.18-.07-.31-.1-.45.1-.13.2-.5.63-.62.76-.11.13-.23.14-.43.05a9.8 9.8 0 0 1-2.9-1.8c-1.1-1-1.85-1.9-2.06-2.22-.2-.32-.02-.5.15-.66.16-.15.35-.4.52-.6.17-.2.23-.34.35-.57.12-.23.06-.43-.03-.6-.09-.17-.45-1.08-.62-1.48-.16-.39-.33-.34-.45-.35h-.38c-.13 0-.34.05-.52.27-.18.22-.68.66-.68 1.62s.7 1.88.8 2.01c.1.13 1.37 2.1 3.33 2.94.46.2.83.32 1.11.41.47.15.9.13 1.24.08.38-.06 1.16-.48 1.33-.94.16-.46.16-.86.11-.94-.05-.08-.18-.13-.38-.23Z" />
      <path d="M12.04 2.6c-5.2 0-9.42 4.2-9.42 9.38 0 1.78.5 3.44 1.37 4.86L2.6 21.4l4.7-1.5a9.5 9.5 0 0 0 4.74 1.22c5.2 0 9.42-4.2 9.42-9.37 0-5.18-4.22-9.37-9.42-9.37Zm0 17.06a8 8 0 0 1-4.11-1.13l-.3-.17-2.8.9.75-2.66-.17-.32a7.85 7.85 0 0 1 12.2-9.75 7.8 7.8 0 0 1 2.44 5.6c0 4.33-3.55 7.85-7.91 7.85Z" />
    </svg>
  );
}

export function PhoneIcon({ className = base }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M6.6 10.8a15.6 15.6 0 0 0 6.6 6.6l2.2-2.2c.28.28.62.48 1 .6.5.17 1.03.26 1.6.26.6 0 .9.3.9.9V18c0 .6-.3.9-.9.9A11.1 11.1 0 0 1 5.1 12c0-.6.3-.9.9-.9h1.5c.6 0 .9-.3.9-.9 0-.57.1-1.1.26-1.6.12-.38.32-.72.6-1L9.2 5.4C8.8 5 8.3 4.8 7.7 4.8c-.55 0-1.05.25-1.35.75A3 3 0 0 0 5.7 7.2c0 1.4.55 2.75 1.5 3.95" />
    </svg>
  );
}

export function MapPinIcon({ className = base }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true" className={className}>
      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  );
}

export function MailIcon({ className = base }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true" className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

export function ClockIcon({ className = base }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5V12l3.2 2.2" />
    </svg>
  );
}

export function CheckIcon({ className = base }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true" className={className}>
      <path d="m5 13 4.2 4.2L19 7" />
    </svg>
  );
}

export function StarIcon({ className = base }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="m12 3.6 2.5 5.3 5.6.8-4.1 4 1 5.7-5-2.7-5 2.7 1-5.7-4.1-4 5.6-.8L12 3.6Z" />
    </svg>
  );
}

export function ArrowRightIcon({ className = base }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className={className}>
      <path d="M4 12h15m0 0-5.5-5.5M19 12l-5.5 5.5" />
    </svg>
  );
}

export function ChevronIcon({ className = base }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className={className}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function MenuIcon({ className = base }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className={className}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon({ className = base }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className={className}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function Spine({ className = base }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" className={className}>
      <path d="M12 3v18" />
      <path d="M8 6h8M7 10h10M7 14h10M8 18h8" />
    </svg>
  );
}
function Bolt({ className = base }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" className={className}>
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
    </svg>
  );
}
function Brain({ className = base }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" className={className}>
      <path d="M9.5 4A2.5 2.5 0 0 0 7 6.5 3 3 0 0 0 5 9.5c0 1 .5 1.8 1.2 2.3A3 3 0 0 0 6 14c0 1.7 1.3 3 3 3h.5V4Z" />
      <path d="M14.5 4A2.5 2.5 0 0 1 17 6.5a3 3 0 0 1 2 3c0 1-.5 1.8-1.2 2.3.5.5.7 1.2.7 1.9 0 1.7-1.3 3-3 3H14V4Z" />
    </svg>
  );
}
function Shield({ className = base }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" className={className}>
      <path d="M12 3 5 5.5V11c0 4.5 3 8 7 10 4-2 7-5.5 7-10V5.5L12 3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
function Heart({ className = base }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" className={className}>
      <path d="M12 20s-7-4.4-7-9.4A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7 2.6c0 5-7 9.4-7 9.4Z" />
    </svg>
  );
}
function Walk({ className = base }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" className={className}>
      <circle cx="13" cy="4.5" r="2" />
      <path d="M11 21l1.5-6-2.5-2 1-5 3.5 2 2.5 1M9.5 9 7 11l-1 4m8.5 6-1.5-5" />
    </svg>
  );
}

const MAP: Record<string, (p: P) => ReactElement> = {
  spine: Spine,
  bolt: Bolt,
  brain: Brain,
  shield: Shield,
  heart: Heart,
  walk: Walk,
};

export function ServiceIcon({ name, className }: { name: string } & P) {
  const Cmp = MAP[name] ?? Spine;
  return <Cmp className={className} />;
}
