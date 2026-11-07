import type { Metadata } from "next";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { statsConfig } from "@/lib/admin-config";

export const metadata: Metadata = { title: "Stats" };

export default function Page() {
  return <ResourceManager config={statsConfig} />;
}
