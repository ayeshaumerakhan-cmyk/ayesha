import type { Metadata } from "next";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { educationConfig } from "@/lib/admin-config";

export const metadata: Metadata = { title: "Education" };

export default function Page() {
  return <ResourceManager config={educationConfig} />;
}
