import type { Metadata, Viewport } from "next";
import "./globals.css";
import { siteConfig, whatsappUrl } from "@/lib/site-config";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import Header from "@/components/Header";

export const viewport: Viewport = {
  themeColor: siteConfig.colors.midnightTeal,
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://physiocareclinic.example.com"),
  title: {
    default: `${siteConfig.clinicName} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.clinicName}`,
  },
  description: `Expert physiotherapy for back pain, sports injuries, post-surgical rehab and more. Book a ${siteConfig.clinicName} assessment by WhatsApp or call. ${siteConfig.hoursWeek}.`,
  keywords: [
    "physiotherapy",
    "physiotherapist near me",
    "back pain treatment",
    "sports injury physiotherapy",
    "post surgical rehabilitation",
    siteConfig.clinicName,
  ],
  openGraph: {
    title: `${siteConfig.clinicName} — ${siteConfig.tagline}`,
    description: `One-to-one physiotherapy assessment and rehabilitation. Book on WhatsApp: ${siteConfig.phoneNumber}`,
    type: "website",
    locale: "en_IN",
    siteName: siteConfig.clinicName,
  },
  twitter: { card: "summary_large_image", title: siteConfig.clinicName },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalClinic",
  name: siteConfig.clinicName,
  description: "Physiotherapy and rehabilitation clinic",
  medicalSpecialty: "Physiotherapy",
  telephone: siteConfig.phoneDial,
  email: siteConfig.email,
  url: "https://physiocareclinic.example.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.addressLine1,
    addressLocality: siteConfig.addressLine2,
    addressCountry: "IN",
  },
  openingHours: siteConfig.hoursWeek,
  priceRange: "₹₹",
  sameAs: whatsappUrl(),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        <main>{children}</main>
        <Footer />
        <FloatingActions />
      </body>
    </html>
  );
}
