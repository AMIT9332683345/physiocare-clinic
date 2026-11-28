import type { Metadata } from "next";
import FloatingActions from "@/components/FloatingActions";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getSettings, publicUrl } from "@/lib/settings";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Link previews (WhatsApp, iMessage, X, LinkedIn, Slack) are built from the
 * live admin settings, so a name or number change updates the card too.
 */
export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const url = publicUrl(s);
  const title = `${s.clinicName} — ${s.tagline}`;
  const description =
    s.shareTagline ||
    `One-to-one physiotherapy for back pain, sports injuries and post-surgical recovery. Book by WhatsApp or call: ${s.phoneNumber}.`;
  const image = s.ogImage || undefined;

  return {
    metadataBase: new URL(url),
    title: { default: title, template: `%s | ${s.clinicName}` },
    description,
    keywords: [
      "physiotherapy",
      "physiotherapist near me",
      "back pain treatment",
      "sports injury physiotherapy",
      "post surgical rehabilitation",
      s.clinicName,
    ],
    alternates: { canonical: "/" },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      locale: "en_IN",
      siteName: s.clinicName,
      images: image ? [{ url: image, width: 1200, height: 630, alt: title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: settings.clinicName,
    description: settings.shareTagline || settings.tagline,
    medicalSpecialty: "Physiotherapy",
    telephone: settings.phoneDial,
    email: settings.email,
    url: publicUrl(settings),
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.addressLine1,
      addressLocality: settings.addressLine2,
      addressCountry: "IN",
    },
    openingHours: settings.hoursWeek,
    priceRange: "₹₹",
    sameAs: publicUrl(settings),
  };

  const hex = /^#[0-9a-fA-F]{6}$/;
  const safe = (v: string, fallback: string) => (hex.test(v) ? v : fallback);
  const palette = [
    `--color-teal-800:${safe(settings.colors.midnightTeal, "#0B3048")}`,
    `--color-pearl:${safe(settings.colors.pearl, "#F2F0E9")}`,
    `--color-lime:${safe(settings.colors.lime, "#B9F12F")}`,
  ].join(";");

  return (
    <>
      {/* admin palette overrides Tailwind's compiled brand tokens at runtime */}
      <style dangerouslySetInnerHTML={{ __html: `:root{${palette}}` }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header settings={settings} />
      <ServiceWorkerRegistration />
      <main>{children}</main>
      <Footer />
      <FloatingActions settings={settings} />
    </>
  );
}
