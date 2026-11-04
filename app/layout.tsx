import type { Viewport } from "next";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";

export const viewport: Viewport = {
  themeColor: siteConfig.colors.midnightTeal,
  width: "device-width",
  initialScale: 1,
};

/**
 * Only the document shell lives here. The public site (with its header,
 * footer and WhatsApp rail) is wrapped by app/(site)/layout.tsx, and the
 * admin panel brings its own chrome.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
