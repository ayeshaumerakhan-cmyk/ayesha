import type { Metadata } from "next";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const metadata: Metadata = { title: "Site settings" };

export default function Page() {
  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Site settings</h1>
          <p className="muted">Text, links and search details used across the whole website.</p>
        </div>
      </div>
      <SettingsForm />
    </div>
  );
}
