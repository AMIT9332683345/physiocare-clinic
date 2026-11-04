import type { MetadataRoute } from "next";
import { loadContent } from "@/lib/content";

export const revalidate = 3600;

/** Set SITE_URL to your live domain (Vercel & Render env vars) for correct URLs. */
const base = (process.env.SITE_URL || "https://your-domain.com").replace(/\/$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { articles } = await loadContent();
  const now = new Date();

  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    ...articles.map((a) => ({
      url: `${base}/blog/${a.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
