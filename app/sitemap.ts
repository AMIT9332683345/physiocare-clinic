import type { MetadataRoute } from "next";
import { loadContent } from "@/lib/content";
import { getSettings, publicUrl } from "@/lib/settings";

export const revalidate = 3600;

/** The domain comes from /admin → Clinic info (SITE_URL env is the fallback). */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ articles }, settings] = await Promise.all([loadContent(), getSettings()]);
  const base = publicUrl(settings).replace(/\/$/, "");
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
