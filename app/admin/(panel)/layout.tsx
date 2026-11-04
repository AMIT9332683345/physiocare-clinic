import { redirect } from "next/navigation";
import Shell from "@/components/admin/Shell";
import { readSession } from "@/lib/auth";
import { findAdmin } from "@/lib/db-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await readSession();
  if (!session) redirect("/admin/login");

  let demoLogin = false;
  try {
    demoLogin = Boolean((await findAdmin(session.email))?.seeded);
  } catch {
    // Atlas unreachable — the pages themselves report the outage.
  }

  return (
    <Shell email={session.email} demoLogin={demoLogin}>
      {children}
    </Shell>
  );
}
