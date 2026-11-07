"use client";

import { useEffect, useState, type FormEvent } from "react";
import { revalidateSite } from "@/app/admin/actions";
import { FieldInput } from "@/components/admin/FieldInput";
import { settingsFields } from "@/lib/admin-config";
import { createClient } from "@/lib/supabase/client";

export function SettingsForm() {
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const run = async () => {
      const supabase = createClient();
      const { data, error: err } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
      if (err) setError(err.message);
      const v: Record<string, unknown> = {};
      for (const f of settingsFields) v[f.name] = data ? ((data as Record<string, unknown>)[f.name] ?? "") : "";
      setValues(v);
      setLoading(false);
    };
    run();
  }, []);

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload: Record<string, unknown> = { id: 1 };
    for (const f of settingsFields) {
      const text = String(values[f.name] ?? "").trim();
      payload[f.name] = text === "" ? null : text;
    }
    const supabase = createClient();
    const { error: err } = await supabase.from("site_settings").upsert(payload, { onConflict: "id" });
    setSaving(false);
    if (err) {
      setError(err.message);
      return;
    }
    await revalidateSite();
    setNotice("Settings saved. The site is updated.");
    window.setTimeout(() => setNotice(""), 3500);
  };

  if (loading) return <p className="muted">Loading</p>;

  return (
    <form className="card form" onSubmit={save}>
      <p className="muted">Leave a field empty to use the built-in default text.</p>
      {settingsFields.map((f) => (
        <div key={f.name}>
          {f.section && <h3 className="form__section">{f.section}</h3>}
          <FieldInput field={f} value={values[f.name]} onChange={(v) => setValues((p) => ({ ...p, [f.name]: v }))} folder="settings" />
        </div>
      ))}
      {error && <p className="alert">{error}</p>}
      {notice && <p className="notice">{notice}</p>}
      <div className="row">
        <button type="submit" className="btn" disabled={saving}>
          {saving ? "Saving" : "Save settings"}
        </button>
      </div>
    </form>
  );
}
