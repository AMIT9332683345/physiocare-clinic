import { ImageResponse } from "next/og";
import { loadContent } from "@/lib/content";
import { getSettings } from "@/lib/settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Ctx = { params: Promise<{ slug: string }> };

export async function generateAlt({ params }: Ctx) {
  const { slug } = await params;
  const { articles } = await loadContent();
  return articles.find((a) => a.slug === slug)?.title ?? "Health article";
}

export default async function ArticleImage({ params }: Ctx) {
  const { slug } = await params;
  const [{ articles }, s] = await Promise.all([loadContent(), getSettings()]);
  const article = articles.find((a) => a.slug === slug);
  const title = article?.title ?? s.clinicName;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: s.colors.midnightTeal,
          color: s.colors.pearl,
          padding: "80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              display: "flex",
              backgroundColor: s.colors.lime,
              color: s.colors.midnightTeal,
              padding: "10px 24px",
              borderRadius: "999px",
              fontSize: "26px",
            }}
          >
            {article?.category ?? "Health"}
          </div>
          <div style={{ display: "flex", fontSize: "28px", color: "#9DC7DC" }}>
            {article?.readTime ?? ""} · {s.clinicName}
          </div>
        </div>

        <div style={{ display: "flex", fontSize: title.length > 60 ? "58px" : "70px", lineHeight: 1.15 }}>
          {title}
        </div>

        <div style={{ display: "flex", fontSize: "30px", color: "#9DC7DC" }}>{article?.excerpt ?? s.tagline}</div>
      </div>
    ),
    { ...size }
  );
}
