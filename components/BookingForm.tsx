"use client";

import { useState } from "react";
import { telFor, waFor } from "@/lib/contact-links";
import type { Settings } from "@/lib/settings";
import { ClockIcon, MapPinIcon, MailIcon, PhoneIcon, WhatsAppIcon } from "./icons";

type Mode = "appointment" | "message";

const field =
  "w-full rounded-xl border border-pearl-dark bg-pearl-light px-4 py-3 text-sm text-teal-900 placeholder:text-teal-800/40 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-lime/60";
const label = "mb-1.5 block text-xs font-bold uppercase tracking-wider text-teal-700";

export default function BookingForm({
  settings,
  services,
  times,
}: {
  settings: Settings;
  services: string[];
  times: string[];
}) {
  const [mode, setMode] = useState<Mode>("appointment");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<null | { ok: boolean; text: string }>(null);

  const today = new Date().toISOString().slice(0, 10);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setBusy(true);
    setDone(null);

    const endpoint = mode === "appointment" ? "/api/appointments" : "/api/contact";
    let result: { ok?: boolean; error?: string; message?: string };
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      result = await res.json();
    } catch {
      result = { ok: false, error: "network" };
    }

    setBusy(false);
    if (result.ok) {
      setDone({ ok: true, text: result.message ?? "Received — we will confirm shortly." });
      form.reset();
    } else {
      setDone({
        ok: false,
        text:
          result.error === "validation"
            ? "Please check the highlighted fields."
            : "Could not reach the server. Tap WhatsApp or call and we will take your details there.",
      });
    }
  }

  return (
    <section id="contact" className="bg-teal-800 py-20 text-pearl lg:py-28">
      <div className="container-x grid gap-12 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p className="eyebrow text-lime">Book / contact</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Two minutes now, <span className="text-lime">pain-free sooner</span>
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-pearl/70">
            Send a booking request and we confirm your slot by WhatsApp. In a hurry? The buttons
            below reach the clinic directly.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <a href={waFor(settings)} target="_blank" rel="noopener noreferrer" className="btn-lime btn-lime-hover">
              <WhatsAppIcon className="h-5 w-5" /> WhatsApp us
            </a>
            <a href={telFor(settings)} className="btn-ghost btn-lime-hover text-pearl hover:bg-teal-700">
              <PhoneIcon className="h-5 w-5" /> {settings.phoneNumber}
            </a>
          </div>

          <dl className="mt-10 space-y-5 border-t border-pearl/15 pt-8 text-sm">
            <div className="flex gap-3">
              <MapPinIcon className="mt-0.5 h-5 w-5 shrink-0 text-lime" />
              <dd>
                {settings.addressLine1}
                <br />
                {settings.addressLine2}
                <br />
                <a
                  href={settings.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lime underline decoration-lime/40 hover:decoration-lime"
                >
                  Open in Google Maps
                </a>
              </dd>
            </div>
            <div className="flex gap-3">
              <ClockIcon className="mt-0.5 h-5 w-5 shrink-0 text-lime" />
              <dd>
                {settings.hoursWeek}
                <br />
                {settings.hoursSunday}
              </dd>
            </div>
            <div className="flex gap-3">
              <MailIcon className="mt-0.5 h-5 w-5 shrink-0 text-lime" />
              <dd>
                <a href={`mailto:${settings.email}`} className="hover:text-lime">
                  {settings.email}
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div id="book" className="card-surface scroll-mt-28 border-pearl/15 bg-pearl p-7 text-teal-900 sm:p-9">
          <div className="flex gap-2 rounded-full bg-pearl-dark/70 p-1.5">
            {(
              [
                ["appointment", "Book an appointment"],
                ["message", "Ask a question"],
              ] as [Mode, string][]
            ).map(([m, text]) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMode(m);
                  setDone(null);
                }}
                className={`flex-1 rounded-full py-2.5 text-sm font-bold transition ${
                  mode === m ? "bg-teal-800 text-pearl shadow-card" : "text-teal-800/70 hover:text-teal-800"
                }`}
              >
                {text}
              </button>
            ))}
          </div>

          <form onSubmit={onSubmit} className="mt-7 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={label} htmlFor="fullName">
                Full name *
              </label>
              <input
                id="fullName"
                name="fullName"
                required
                maxLength={80}
                placeholder="Your name"
                className={field}
              />
            </div>

            <div>
              <label className={label} htmlFor="phone">
                Mobile number *
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                maxLength={20}
                placeholder="+91 90000 00000"
                className={field}
              />
            </div>

            <div>
              <label className={label} htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                maxLength={120}
                placeholder="you@example.com"
                className={field}
              />
            </div>

            {mode === "appointment" ? (
              <>
                <div>
                  <label className={label} htmlFor="service">
                    Treatment needed *
                  </label>
                  <select id="service" name="service" required className={field} defaultValue="">
                    <option value="" disabled>
                      Choose a service
                    </option>
                    {services.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                    <option value="Not sure / advice needed">Not sure — need advice</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:col-span-2">
                  <div>
                    <label className={label} htmlFor="preferredDate">
                      Preferred date *
                    </label>
                    <input
                      id="preferredDate"
                      name="preferredDate"
                      type="date"
                      required
                      min={today}
                      className={field}
                    />
                  </div>
                  <div>
                    <label className={label} htmlFor="preferredTime">
                      Preferred time *
                    </label>
                    <select id="preferredTime" name="preferredTime" required className={field} defaultValue="">
                      <option value="" disabled>
                        Pick a slot
                      </option>
                      {times.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className={label} htmlFor="notes">
                    What bothers you? (optional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    maxLength={900}
                    placeholder="Pain for 3 weeks, worse after driving. MRI report available."
                    className={field}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="sm:col-span-2">
                  <label className={label} htmlFor="subject">
                    Subject *
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    required
                    maxLength={120}
                    placeholder="Home visit availability"
                    className={field}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={label} htmlFor="message">
                    Your question *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    maxLength={1500}
                    placeholder="Tell us the problem in a sentence or two."
                    className={field}
                  />
                </div>
              </>
            )}

            {/* spam trap — humans never see or fill this */}
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />

            <div className="sm:col-span-2">
              <button type="submit" disabled={busy} className="btn-lime btn-lime-hover w-full disabled:opacity-60">
                {busy
                  ? "Sending…"
                  : mode === "appointment"
                    ? "Request this slot"
                    : "Send my question"}
              </button>
            </div>

            {done && (
              <p
                role="status"
                className={`sm:col-span-2 rounded-xl px-4 py-3 text-sm font-semibold ${
                  done.ok
                    ? "bg-lime-soft text-teal-800 ring-1 ring-lime-dark/40"
                    : "bg-teal-100 text-teal-800 ring-1 ring-teal-400/50"
                }`}
              >
                {done.text}
              </p>
            )}

            <p className="sm:col-span-2 text-xs leading-relaxed text-teal-800/55">
              Demo build — requests are stored in your MongoDB database under{" "}
              <code className="font-semibold">appointments</code> and <code className="font-semibold">messages</code>.
              Nothing is sent to any third party.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
