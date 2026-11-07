import type { Metadata } from "next";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { certificationsConfig } from "@/lib/admin-config";

export const metadata: Metadata = { title: "Certifications" };

export default function Page() {
  return <ResourceManager config={certificationsConfig} />;
}
