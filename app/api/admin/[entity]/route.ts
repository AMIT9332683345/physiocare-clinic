import { NextResponse } from "next/server";
import { adminGuard, badRequest, noDatabase, ok } from "@/lib/api-helpers";
import { deleteRow, insertRow, listRows, oid, slugTaken, updateRow } from "@/lib/db-admin";
import { buildDocument, findEntity, type Entity } from "@/lib/entities";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ entity: string }> };

/**
 * Generic CRUD for the collections listed in lib/entities.ts. The entity key
 * decides the MongoDB collection and the field whitelist, so this route can
 * never be pointed at `admins` or `settings`.
 */
async function resolve(ctx: Ctx): Promise<Entity | NextResponse> {
  const { entity } = await ctx.params;
  const found = findEntity(entity);
  if (!found) {
    return NextResponse.json(
      { ok: false, error: "unknown_entity", message: `"${entity}" is not editable.` },
      { status: 404 }
    );
  }
  return found;
}

async function body(req: Request): Promise<Record<string, unknown>> {
  const clone = req.clone();
  try {
    const json = await req.json();
    if (json && typeof json === "object" && !Array.isArray(json)) return json as Record<string, unknown>;
  } catch {
    // fall through to form parsing
  }
  try {
    return Object.fromEntries(await clone.formData());
  } catch {
    return {};
  }
}

function notFound() {
  return NextResponse.json(
    { ok: false, error: "not_found", message: "That entry no longer exists." },
    { status: 404 }
  );
}

export async function GET(req: Request, ctx: Ctx) {
  const guard = await adminGuard(req);
  if (guard.response) return guard.response;
  const found = await resolve(ctx);
  if (found instanceof NextResponse) return found;
  try {
    return ok({ entity: found.key, rows: await listRows(found.collection) });
  } catch {
    return noDatabase();
  }
}

export async function POST(req: Request, ctx: Ctx) {
  const guard = await adminGuard(req);
  if (guard.response) return guard.response;
  const found = await resolve(ctx);
  if (found instanceof NextResponse) return found;

  const input = await body(req);
  const { doc, errors } = buildDocument(found, input);
  if (errors.length) return badRequest(errors);

  try {
    if (found.unique === "slug" && (await slugTaken(found.collection, String(doc.slug)))) {
      return badRequest([`"${doc.slug}" is already used by another entry.`]);
    }
    const id = await insertRow(found.collection, doc);
    return ok({ id, row: { id, ...doc }, message: "Added." });
  } catch {
    return noDatabase();
  }
}

export async function PATCH(req: Request, ctx: Ctx) {
  const guard = await adminGuard(req);
  if (guard.response) return guard.response;
  const found = await resolve(ctx);
  if (found instanceof NextResponse) return found;

  const input = await body(req);
  const id =
    typeof input.id === "string" ? input.id : new URL(req.url).searchParams.get("id") ?? "";
  if (!oid(id)) return badRequest(["Missing or malformed record id."]);

  const { doc, errors } = buildDocument(found, input);
  if (errors.length) return badRequest(errors);

  try {
    if (found.unique === "slug" && (await slugTaken(found.collection, String(doc.slug), id))) {
      return badRequest([`"${doc.slug}" is already used by another entry.`]);
    }
    if (!(await updateRow(found.collection, id, doc))) return notFound();
    return ok({ id, row: { id, ...doc }, message: "Saved." });
  } catch {
    return noDatabase();
  }
}

export async function DELETE(req: Request, ctx: Ctx) {
  const guard = await adminGuard(req);
  if (guard.response) return guard.response;
  const found = await resolve(ctx);
  if (found instanceof NextResponse) return found;

  const id = new URL(req.url).searchParams.get("id") ?? "";
  if (!oid(id)) return badRequest(["Missing or malformed record id."]);

  try {
    if (!(await deleteRow(found.collection, id))) return notFound();
    return ok({ id, message: "Deleted." });
  } catch {
    return noDatabase();
  }
}
