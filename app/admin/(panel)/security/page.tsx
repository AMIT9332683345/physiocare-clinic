import type { Metadata } from "next";
import { redirect } from "next/navigation";
import SecurityForm from "@/components/admin/SecurityForm";
import { readSession } from "@/lib/auth";
import { findAdmin } from "@/lib/db-admin";
import { mongoEnabled } from "@/lib/mongo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Login & security" };

export default async function AdminSecurityPage() {
  const session = await readSession();
  if (!session) redirect("/admin/login");

  let demoLogin = false;
  try {
    demoLogin = Boolean((await findAdmin(session.email))?.seeded);
  } catch {
    // reported by the form itself
  }

  return <SecurityForm email={session.email} demoLogin={demoLogin} hasDatabase={mongoEnabled()} />;
}
