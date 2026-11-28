"use client";

import { useEffect, useState } from "react";

type InstallPrompt = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

export default function InstallButton({ className = "" }: { className?: string }) {
  const [promptEvent, setPromptEvent] = useState<InstallPrompt | null>(null);
  const [ios, setIos] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    setIos(/iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));
    setInstalled(window.matchMedia("(display-mode: standalone)").matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone));
    const handlePrompt = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as InstallPrompt);
    };
    const handleInstalled = () => setInstalled(true);
    window.addEventListener("beforeinstallprompt", handlePrompt);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handlePrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  if (installed) return null;

  async function install() {
    if (promptEvent) {
      await promptEvent.prompt();
      await promptEvent.userChoice;
      setPromptEvent(null);
      return;
    }
    if (ios) {
      window.alert("Install this app: tap Share, then “Add to Home Screen”.");
    } else {
      window.alert("To install, open your browser menu and choose “Install app” or “Add to Home screen”.");
    }
  }

  return <button type="button" onClick={install} className={className}>Install App</button>;
}
