import type { Metadata } from "next";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { journalConfig } from "@/lib/admin-config";

export const metadata: Metadata = { title: "Journal" };

export default function Page() {
  return <ResourceManager config={journalConfig} />;
}
