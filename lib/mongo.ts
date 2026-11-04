import { MongoClient, ServerApiVersion } from "mongodb";

/**
 * One shared Mongo connection per serverless warm instance.
 * MONGODB_URI is the only secret the app needs — set it in Vercel and Render.
 */
const uri = process.env.MONGODB_URI ?? "";

let cached: { client: MongoClient; promise: Promise<MongoClient> } | undefined;

export async function getMongoClient(): Promise<MongoClient> {
  if (!uri) throw new Error("MONGODB_URI is not set");

  if (cached) return cached.client;

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
    connectTimeoutMS: 8000,
    serverSelectionTimeoutMS: 8000,
    maxPoolSize: 5,
  });

  const promise = client.connect();
  cached = { client, promise };
  await promise;
  return client;
}

export async function getDb(dbName?: string) {
  const client = await getMongoClient();
  const name =
    dbName ??
    process.env.MONGODB_DBNAME ??
    new URL(uri).pathname.replace(/^\//, "").split("?")[0] ??
    "";
  return client.db(name || "physiocare");
}

export function mongoEnabled(): boolean {
  return Boolean(uri);
}

/**
 * Best-effort read: returns null instead of throwing when Atlas is
 * unreachable, so the site can fall back to bundled demo data.
 */
export async function readCollection<T>(
  collection: string,
  filter = {},
  sort?: Record<string, 1 | -1>
): Promise<T[] | null> {
  if (!mongoEnabled()) return null;
  try {
    const db = await getDb();
    const cursor = db.collection(collection).find(filter);
    if (sort) cursor.sort(sort);
    return (await cursor.toArray()) as T[];
  } catch {
    return null;
  }
}

/** Best-effort single insert. Throws only for caller handling in API routes. */
export async function writeDoc(collection: string, doc: Record<string, unknown>) {
  const db = await getDb();
  return db.collection(collection).insertOne(doc);
}
