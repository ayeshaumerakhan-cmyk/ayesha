import type { Metadata } from "next";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { galleryConfig } from "@/lib/admin-config";

export const metadata: Metadata = { title: "Gallery" };

export default function Page() {
  return <ResourceManager config={galleryConfig} />;
}
