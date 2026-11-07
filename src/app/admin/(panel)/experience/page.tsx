import type { Metadata } from "next";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { experienceConfig } from "@/lib/admin-config";

export const metadata: Metadata = { title: "Experience" };

export default function Page() {
  return <ResourceManager config={experienceConfig} />;
}
