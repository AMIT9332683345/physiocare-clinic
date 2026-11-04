import Link from "next/link";
import { siteConfig, whatsappUrl } from "@/lib/site-config";
import { WhatsAppIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <section className="bg-teal-800 py-28 text-center text-pearl">
      <div className="container-x max-w-xl">
        <p className="font-display text-6xl font-extrabold text-lime">404</p>
        <h1 className="mt-4 text-2xl font-bold">That page has gone missing</h1>
        <p className="mt-3 text-pearl/70">
          The link may be old. Everything at {siteConfig.clinicName} is reachable from the home page.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-lime btn-lime-hover">
            Back to home
          </Link>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost btn-lime-hover text-pearl hover:bg-teal-700"
          >
            <WhatsAppIcon className="h-5 w-5" /> Chat with us
          </a>
        </div>
      </div>
    </section>
  );
}
