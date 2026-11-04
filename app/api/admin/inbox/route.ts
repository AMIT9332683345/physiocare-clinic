import { NextResponse } from "next/server";
import { adminGuard, badRequest, noDatabase, ok } from "@/lib/api-helpers";
import { isInbox, type InboxCollection } from "@/lib/collections";
import { INBOX_STATUSES, deleteRow, listInbox, setInboxStatus } from "@/lib/db-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Patient book-ups and contact messages: read, triage, delete. */
export async function GET(req: Request) {
  const guard = await adminGuard(req);
  if (guard.response) return guard.response;
  try {
    return ok({ statuses: INBOX_STATUSES, ...(await listInbox()) });
  } catch {
    return noDatabase();
  }
}

async function parse(req: Request) {
  try {
    return (await req.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export async function PATCH(req: Request) {
  const guard = await adminGuard(req);
  if (guard.response) return guard.response;

  const input = await parse(req);
  const kind = typeof input.kind === "string" ? input.kind : "";
  const id = typeof input.id === "string" ? input.id : "";
  const status = typeof input.status === "string" ? input.status : "";
  const note = typeof input.note === "string" ? input.note : undefined;

  if (!isInbox(kind)) return badRequest(["Unknown inbox kind."]);
  if (!INBOX_STATUSES.includes(status as (typeof INBOX_STATUSES)[number])) {
    return badRequest(["Status must be one of: " + INBOX_STATUSES.join(", ") + "."]);
  }
  if (!id) return badRequest(["Missing record id."]);

  try {
    if (!(await setInboxStatus(kind as InboxCollection, id, status, note))) {
      return NextResponse.json(
        { ok: false, error: "not_found", message: "That entry no longer exists." },
        { status: 404 }
      );
    }
    return ok({ message: `Marked ${status}.` });
  } catch {
    return noDatabase();
  }
}

export async function DELETE(req: Request) {
  const guard = await adminGuard(req);
  if (guard.response) return guard.response;

  const url = new URL(req.url);
  const kind = url.searchParams.get("kind") ?? "";
  const id = url.searchParams.get("id") ?? "";
  if (!isInbox(kind)) return badRequest(["Unknown inbox kind."]);
  if (!id) return badRequest(["Missing record id."]);

  try {
    if (!(await deleteRow(kind, id))) {
      return NextResponse.json(
        { ok: false, error: "not_found", message: "That entry no longer exists." },
        { status: 404 }
      );
    }
    return ok({ message: "Deleted." });
  } catch {
    return noDatabase();
  }
}
