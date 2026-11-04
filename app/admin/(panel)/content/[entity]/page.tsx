import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EntityManager, { type AdminRow } from "@/components/admin/EntityManager";
import { listRows } from "@/lib/db-admin";
import { findEntity } from "@/lib/entities";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ entity: string }> };

export async function generateMetadata({ params }: Ctx): Promise<Metadata> {
  const { entity } = await params;
  return { title: findEntity(entity)?.title ?? "Content" };
}

export default async function AdminContentPage({ params }: Ctx) {
  const { entity } = await params;
  const found = findEntity(entity);
  if (!found) notFound();

  let dbDown = false;
  let rows: AdminRow[] = [];
  try {
    rows = (await listRows(found.collection)).map((row) => {
      const clean: AdminRow = { id: String(row.id) };
      for (const field of found.fields) {
        const value = (row as Record<string, unknown>)[field.name];
        clean[field.name] =
          value ??
          (field.type === "list" ? [] : field.type === "number" ? 0 : field.type === "checkbox" ? false : "");
      }
      return clean;
    });
  } catch {
    dbDown = true;
  }

  return (
    <>
      {dbDown && (
        <p className="mx-auto mb-6 max-w-5xl rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          MongoDB is unreachable, so this list is empty. Check{" "}
          <code className="font-mono text-xs">MONGODB_URI</code> and the Atlas network allowlist.
        </p>
      )}
      <EntityManager entity={found} rows={rows} />
    </>
  );
}
