import type { Metadata } from "next";
import SettingsForm from "@/components/admin/SettingsForm";
import { getSettings } from "@/lib/settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Clinic info" };

export default async function AdminClinicPage() {
  const settings = await getSettings();
  return <SettingsForm initial={settings} />;
}
