import type { Metadata } from "next";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { projectsConfig } from "@/lib/admin-config";

export const metadata: Metadata = { title: "Projects" };

export default function Page() {
  return <ResourceManager config={projectsConfig} />;
}
