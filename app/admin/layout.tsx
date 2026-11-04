import type { Metadata } from "next";

/** The panel must never appear in search results. */
export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin" },
  robots: { index: false, follow: false, noarchive: true },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
