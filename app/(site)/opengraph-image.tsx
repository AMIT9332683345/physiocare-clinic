import { ImageResponse } from "next/og";
import { getSettings } from "@/lib/settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateAlt() {
  const s = await getSettings();
  return `${s.clinicName} — ${s.tagline}`;
}

/** The card people see when they paste the site link into WhatsApp, X, iMessage… */
export default async function OpengraphImage() {
  const s = await getSettings();
  const teal = s.colors.midnightTeal;
  const pearl = s.colors.pearl;
  const lime = s.colors.lime;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          backgroundColor: teal,
          color: pearl,
          padding: "72px 80px",
          gap: "48px",
        }}
      >
        <div style={{ width: "14px", backgroundColor: lime, display: "flex" }} />

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: "26px",
                letterSpacing: "6px",
                color: lime,
                textTransform: "uppercase",
              }}
            >
              Physiotherapy &amp; Rehab
            </div>

            <div
              style={{
                display: "flex",
                marginTop: "26px",
                fontSize: s.clinicName.length > 24 ? "72px" : "88px",
                color: pearl,
                lineHeight: 1.05,
              }}
            >
              {s.clinicName}
            </div>

            <div style={{ display: "flex", marginTop: "22px", fontSize: "38px", color: "#9DC7DC" }}>
              {s.tagline}
            </div>
          </div>

          <div style={{ display: "flex", gap: "60px", fontSize: "30px", alignItems: "center" }}>
            <div style={{ display: "flex", color: lime }}>{s.phoneNumber}</div>
            <div style={{ display: "flex", color: "#9DC7DC" }}>WhatsApp booking</div>
            <div style={{ display: "flex", color: "#9DC7DC" }}>{s.hoursWeek}</div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
