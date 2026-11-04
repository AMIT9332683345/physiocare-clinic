/**
 * Seeds MongoDB with the demo catalogue and sample inbox records.
 *
 *   npm run seed -- "mongodb+srv://user:pass@host/?appId=..."
 *   MONGODB_URI="mongodb+srv://..." npm run seed
 *
 * If neither is given, it reads ./uri.txt (that file is gitignored, so the
 * connection string never lands in version control).
 *
 * Content collections are replaced; bookings and messages are only created
 * when empty, so real patient submissions are never overwritten.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { MongoClient } from "mongodb";
import demo, { collections, seedDemo } from "../data/demo-content.mjs";

function resolveUri() {
  const arg = process.argv.slice(2).find((a) => a.startsWith("mongodb"));
  if (arg) return arg;
  if (process.env.MONGODB_URI) return process.env.MONGODB_URI;
  const file = join(process.cwd(), "uri.txt");
  if (existsSync(file)) {
    const line = readFileSync(file, "utf8").split(/\r?\n/).find((l) => l.trim().startsWith("mongodb"));
    if (line) return line.trim();
  }
  throw new Error(
    "No connection string. Pass it as an argument, set MONGODB_URI, or put it in uri.txt (gitignored)."
  );
}

const uri = resolveUri();
const client = new MongoClient(uri, { serverSelectionTimeoutMS: 20_000 });

const dbName =
  process.env.MONGODB_DBNAME ||
  decodeURIComponent(new URL(uri).pathname.replace(/^\//, "")) ||
  "physiocare";

try {
  await client.connect();
  const db = client.db(dbName);
  console.log(`Connected → database "${dbName}"`);

  const content = [
    [collections.services, demo.services],
    [collections.packages, demo.packages],
    [collections.team, demo.team],
    [collections.testimonials, demo.testimonials],
    [collections.faqs, demo.faqs],
    [collections.articles, demo.articles],
  ];

  for (const [name, rows] of content) {
    await db.collection(name).deleteMany({});
    const docs = rows.map((row, i) => ({ ...row, order: i + 1, updatedAt: new Date() }));
    const { insertedCount } = await db.collection(name).insertMany(docs);
    console.log(`  ${name.padEnd(14)} ${insertedCount} docs`);
  }

  for (const [name, rows] of [
    [collections.appointments, seedDemo.appointments],
    [collections.messages, seedDemo.messages],
  ]) {
    const existing = await db.collection(name).countDocuments();
    if (existing > 0) {
      console.log(`  ${name.padEnd(14)} kept ${existing} real record(s), demo skipped`);
    } else {
      const docs = rows.map((r) => ({ ...r, createdAt: new Date(r.createdAt), source: "seed" }));
      const { insertedCount } = await db.collection(name).insertMany(docs);
      console.log(`  ${name.padEnd(14)} ${insertedCount} demo docs`);
    }
  }

  await db.collection(collections.appointments).createIndex({ phoneKey: 1 });
  await db.collection(collections.appointments).createIndex({ createdAt: -1 });
  await db.collection(collections.messages).createIndex({ createdAt: -1 });
  console.log("  indexes ready");

  await db.command({ ping: 1 });
  console.log("\nSeed complete. The website now reads this data from MongoDB.");
} catch (e) {
  console.error("\nSeed failed:", String(e).slice(0, 400));
  console.error(
    "Most common cause: this machine's IP is not on the Atlas Network Access list.\n" +
      "Add 0.0.0.0/0 (or your current IP) in Atlas → Security → Network Access, then re-run."
  );
  process.exitCode = 1;
} finally {
  await client.close();
}
