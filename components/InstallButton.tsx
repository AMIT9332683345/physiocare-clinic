"use client";

import { useEffect, useState } from "react";

type InstallPrompt = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

export default function InstallButton({ className = "" }: { className?: string }) {
  const [promptEvent, setPromptEvent] = useState<InstallPrompt | null>(null);
  const [ios, setIos] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    setIos(/iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));
    const standalone = window.matchMedia("(display-mode: standalone)");
    const updateInstalled = () => setInstalled(standalone.matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone));
    updateInstalled();
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as InstallPrompt);
    };
    const onInstalled = () => setInstalled(true);
    standalone.addEventListener("change", updateInstalled);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      standalone.removeEventListener("change", updateInstalled);
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed) return null;

  async function install() {
    if (promptEvent) {
      await promptEvent.prompt();
      const result = await promptEvent.userChoice;
      setPromptEvent(null);
      if (result.outcome === "accepted") setInstalled(true);
      return;
    }
    if (ios && navigator.share && navigator.canShare?.({ title: document.title, url: location.href })) {
      try {
        await navigator.share({ title: document.title, url: location.href });
        return;
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
      }
    }
    setShowHelp(true);
  }

  return (
    <>
      <button type="button" onClick={install} className={className} aria-label="Install PhysioCare app">Install App</button>
      {showHelp && (
        <div role="dialog" aria-modal="true" aria-labelledby="install-help-title" className="fixed inset-0 z-[100] grid place-items-end bg-teal-950/60 p-4 sm:place-items-center" onClick={() => setShowHelp(false)}>
          <section className="w-full max-w-sm rounded-3xl bg-pearl-light p-6 text-teal-900 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-teal-800/20 sm:hidden" />
            <h2 id="install-help-title" className="font-display text-xl font-bold">Add PhysioCare to your home screen</h2>
            <p className="mt-2 text-sm leading-6 text-teal-800/80">
              {ios
                ? "In the Share sheet, tap “Add to Home Screen”, then tap “Add”. iPhone requires this final confirmation."
                : "This browser has not offered its install prompt yet. Try Chrome or Edge over HTTPS, then tap Install App again."}
            </p>
            <button type="button" onClick={() => setShowHelp(false)} className="btn-lime mt-5 w-full">Got it</button>
          </section>
        </div>
      )}
    </>
  );
}
