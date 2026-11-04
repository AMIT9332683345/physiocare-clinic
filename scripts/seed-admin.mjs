/**
 * Creates the first admin login and the session secret.
 *
 *   npm run seed:admin
 *   npm run seed:admin -- --email=you@clinic.in --password=SomethingLong
 *
 * Without flags it writes the demo login documented in README.md
 * (admin@physiocareclinic.in / physio12345). Change it from
 * /admin → Security as soon as the site is live; the panel reminds you until
 * you do.
 *
 * Also appends ADMIN_SESSION_SECRET (and MONGODB_URI, if missing) to the
 * gitignored .env.local so `npm run dev` signs sessions with a stable secret.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";
import { MongoClient } from "mongodb";

const hash = promisify(scrypt);

function arg(name, fallback) {
  const hit = process.argv.slice(2).find((a) => a.startsWith(`--${name}=`));
  if (hit) return hit.slice(name.length + 3);
  return process.env[`ADMIN_${name.toUpperCase()}`] || fallback;
}

function resolveUri() {
  const cli = process.argv.slice(2).find((a) => a.startsWith("mongodb"));
  if (cli) return cli;
  if (process.env.MONGODB_URI) return process.env.MONGODB_URI;
  const file = join(process.cwd(), "uri.txt");
  if (existsSync(file)) {
    const line = readFileSync(file, "utf8").split(/\r?\n/).find((l) => l.trim().startsWith("mongodb"));
    if (line) return line.trim();
  }
  throw new Error("No connection string. Pass one, set MONGODB_URI, or put it in uri.txt.");
}

const email = arg("email", "admin@physiocareclinic.in").toLowerCase().trim();
const password = arg("password", "physio12345");
const isDemo = email === "admin@physiocareclinic.in" && password === "physio12345";

if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
  console.error("Email looks invalid — use a full address like owner@clinic.in");
  process.exit(1);
}
if (password.length < 10 && !isDemo) {
  console.error("Password must be at least 10 characters.");
  process.exit(1);
}

const salt = randomBytes(16);
const key = await hash(password, salt, 64);
const passwordHash = `scrypt$${salt.toString("base64")}$${key.toString("base64")}`;

const uri = resolveUri();
const client = new MongoClient(uri, { serverSelectionTimeoutMS: 20_000 });

try {
  await client.connect();
  const dbName =
    process.env.MONGODB_DBNAME || decodeURIComponent(new URL(uri).pathname.replace(/^\//, "")) || "physiocare";
  const admins = client.db(dbName).collection("admins");

  await admins.createIndex({ email: 1 }, { unique: true });

  const existing = await admins.findOne({ email });
  if (existing) {
    await admins.updateOne(
      { _id: existing._id },
      { $set: { passwordHash, seeded: isDemo, updatedAt: new Date() } }
    );
    console.log(`Updated existing login ${email}`);
  } else {
    await admins.insertOne({ email, passwordHash, seeded: isDemo, createdAt: new Date(), updatedAt: new Date() });
    console.log(`Created login ${email}`);
  }

  // --- .env.local -------------------------------------------------------
  const envFile = join(process.cwd(), ".env.local");
  const current = existsSync(envFile) ? readFileSync(envFile, "utf8") : "";
  const additions = [];

  if (!/^ADMIN_SESSION_SECRET=.*$/m.test(current)) {
    additions.push(`ADMIN_SESSION_SECRET=${randomBytes(32).toString("hex")}`);
  }
  if (!/^MONGODB_URI=.*$/m.test(current)) {
    additions.push(`MONGODB_URI=${uri}`);
  }

  if (additions.length) {
    const body = current.trimEnd();
    writeFileSync(envFile, (body ? body + "\n" : "") + additions.join("\n") + "\n");
    console.log(`Wrote to .env.local: ${additions.map((l) => l.split("=")[0]).join(", ")}`);
  } else {
    console.log(".env.local already has ADMIN_SESSION_SECRET + MONGODB_URI — left untouched");
  }

  console.log("\nAdmin ready.");
  console.log(`  sign in at  http://localhost:3000/admin/login`);
  console.log(`  email       ${email}`);
  console.log(`  password    ${password}${isDemo ? "   ← demo value, change it in /admin → Security" : ""}`);
  console.log(
    "\nOn Vercel / Render add these environment variables (Settings → Environment Variables):"
  );
  console.log("  MONGODB_URI            the Atlas string above");
  console.log("  ADMIN_SESSION_SECRET   the random value now in .env.local");
} catch (e) {
  console.error("\nFailed:", String(e).slice(0, 400));
  console.error("Common cause: this machine's IP is not on the Atlas Network Access list.");
  process.exitCode = 1;
} finally {
  await client.close();
}
