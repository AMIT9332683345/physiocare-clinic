/**
 * Server-side data access for the admin panel. Every write here is guarded
 * by the caller (requireAdmin + checkCsrf); this module only shapes documents.
 */
import { ObjectId } from "mongodb";
import { COLL, type InboxCollection } from "./collections";
import { collection } from "./mongo";
import { invalidateSettings, type Settings } from "./settings";

export const oid = (id: string) => (ObjectId.isValid(id) ? new ObjectId(id) : null);

export type AdminUser = {
  _id?: ObjectId;
  email: string;
  passwordHash: string;
  name?: string;
  seeded?: boolean;
  updatedAt?: Date;
};

export async function findAdmin(email?: string): Promise<AdminUser | null> {
  const col = await collection(COLL.admins);
  const filter = email ? { email: email.toLowerCase().trim() } : {};
  return (await col.findOne<AdminUser>(filter, { sort: { updatedAt: -1 } })) ?? null;
}

export async function adminCount(): Promise<number> {
  const col = await collection(COLL.admins);
  return col.countDocuments();
}

export async function saveAdmin(
  existing: AdminUser | null,
  email: string,
  passwordHash: string,
  seeded = false
) {
  const col = await collection(COLL.admins);
  const doc = { email: email.toLowerCase().trim(), passwordHash, seeded, updatedAt: new Date() };
  if (existing?._id) await col.updateOne({ _id: existing._id }, { $set: doc });
  else await col.insertOne(doc as AdminUser);
}

/** True while the login is still the one printed by `npm run seed:admin`. */
export async function usingDemoLogin(email: string): Promise<boolean> {
  const admin = await findAdmin(email);
  return Boolean(admin?.seeded);
}

// ---------- settings ----------

export async function readSettingsDoc(): Promise<Partial<Settings> | null> {
  const col = await collection(COLL.settings);
  const doc = await col.findOne<Record<string, unknown>>({}, { sort: { order: 1 } });
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return rest as Partial<Settings>;
}

export async function writeSettings(patch: Partial<Settings>) {
  const col = await collection(COLL.settings);
  const existing = await col.findOne<Record<string, unknown>>({}, { sort: { order: 1 } });
  const doc: Record<string, unknown> = {
    ...(existing ?? {}),
    ...patch,
    order: 1,
    updatedAt: new Date(),
  };
  delete doc._id;
  if (existing?._id) await col.updateOne({ _id: existing._id }, { $set: doc });
  else await col.insertOne(doc);
  invalidateSettings();
}

// ---------- editable rows ----------

export async function listRows(name: string, limit = 200) {
  const col = await collection(name);
  const sort: Record<string, 1 | -1> = name === COLL.articles ? { date: -1 } : { order: 1 };
  const rows = await col.find({}, { limit, sort }).toArray();
  return rows.map(({ _id, ...rest }) => ({ id: String(_id), ...rest }));
}

export async function insertRow(name: string, doc: Record<string, unknown>) {
  const col = await collection(name);
  const count = await col.countDocuments();
  const res = await col.insertOne({ ...doc, order: count + 1, createdAt: new Date() });
  return String(res.insertedId);
}

export async function updateRow(name: string, id: string, doc: Record<string, unknown>) {
  const _id = oid(id);
  if (!_id) return false;
  const col = await collection(name);
  const res = await col.updateOne({ _id }, { $set: { ...doc, updatedAt: new Date() } });
  return res.matchedCount > 0;
}

export async function deleteRow(name: string, id: string) {
  const _id = oid(id);
  if (!_id) return false;
  const col = await collection(name);
  const res = await col.deleteOne({ _id });
  return res.deletedCount > 0;
}

export async function slugTaken(name: string, slug: string, exceptId = "") {
  const col = await collection(name);
  const filter: Record<string, unknown> = { slug };
  if (exceptId) {
    const _id = oid(exceptId);
    if (_id) filter._id = { $ne: _id };
  }
  return (await col.countDocuments(filter)) > 0;
}

// ---------- inbox ----------

export const INBOX_STATUSES = ["new", "confirmed", "completed", "cancelled", "read"] as const;

export async function listInbox(limit = 100) {
  const rows = async (name: InboxCollection) => {
    const col = await collection(name);
    const found = await col.find({}, { limit, sort: { createdAt: -1 } }).toArray();
    return found.map(({ _id, ...rest }) => ({ id: String(_id), ...rest }));
  };
  const [appointments, messages] = await Promise.all([
    rows(COLL.appointments),
    rows(COLL.messages),
  ]);
  return { appointments, messages };
}

export async function setInboxStatus(
  kind: InboxCollection,
  id: string,
  status: string,
  adminNote?: string
) {
  const _id = oid(id);
  if (!_id) return false;
  const col = await collection(kind);
  const patch: Record<string, unknown> = { status, updatedAt: new Date() };
  if (adminNote != null) patch.adminNote = adminNote.slice(0, 500);
  const res = await col.updateOne({ _id }, { $set: patch });
  return res.matchedCount > 0;
}

export async function inboxCounts() {
  const [appointments, messages, newBookings, unread] = await Promise.all([
    collection(COLL.appointments).then((c) => c.countDocuments()),
    collection(COLL.messages).then((c) => c.countDocuments()),
    collection(COLL.appointments).then((c) => c.countDocuments({ status: "new" })),
    collection(COLL.messages).then((c) => c.countDocuments({ status: "new" })),
  ]);
  return { appointments, messages, newBookings, unread };
}
