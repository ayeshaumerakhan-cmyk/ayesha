import type { Metadata } from "next";
import { MessagesManager } from "@/components/admin/MessagesManager";

export const metadata: Metadata = { title: "Messages" };

export default function Page() {
  return <MessagesManager />;
}
