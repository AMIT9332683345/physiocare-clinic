import { NextResponse } from "next/server";
import { collections } from "@/data/demo-content.mjs";
import { getDb, mongoEnabled, readCollection } from "@/lib/mongo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/health → is the database reachable, and how much data is in it?
 * Protects nothing; only reports counts.
 */
export async function GET() {
  if (!mongoEnabled()) {
    return NextResponse.json({
      database: "not configured",
      hint: "Set MONGODB_URI in Vercel and Render environment variables.",
      contentSource: "bundled demo data",
    });
  }

  try {
    const db = await getDb();
    await db.command({ ping: 1 });
    const [services, packages, team, testimonials, faqs, articles, appointments, messages] =
      await Promise.all([
        count(collections.services),
        count(collections.packages),
        count(collections.team),
        count(collections.testimonials),
        count(collections.faqs),
        count(collections.articles),
        count(collections.appointments),
        count(collections.messages),
      ]);
    return NextResponse.json({
      database: "connected",
      name: db.databaseName,
      counts: {
        services,
        packages,
        team,
        testimonials,
        faqs,
        articles,
        appointments,
        messages,
      },
      seeded: services > 0,
    });
  } catch (e) {
    return NextResponse.json(
      { database: "unreachable", error: String(e).slice(0, 300) },
      { status: 503 }
    );
  }
}

async function count(name: string) {
  const rows = await readCollection(name);
  return rows ? rows.length : 0;
}
