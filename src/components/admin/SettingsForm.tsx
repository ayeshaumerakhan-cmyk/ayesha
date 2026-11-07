"use client";

import { useEffect, useState, type FormEvent } from "react";
import { revalidateSite } from "@/app/admin/actions";
import { FieldInput } from "@/components/admin/FieldInput";
import { LoaderShape } from "@/components/LoaderShape";
import { settingsFields } from "@/lib/admin-config";
import { defaultSettings } from "@/lib/defaults";
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
      for (const f of settingsFields) {
        const raw = data ? (data as Record<string, unknown>)[f.name] : "";
        const text = typeof raw === "string" ? raw : "";
        // Selects always show a real option, so prefill the default when the column is empty.
        v[f.name] = text === "" && f.type === "select" ? (defaultSettings as unknown as Record<string, string>)[f.name] ?? "" : text;
      }
      setValues(v);
      setLoading(false);
    };
    run();
  }, []);

  const [replay, setReplay] = useState(0);

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
          {f.name === "loader_custom_path" && (
            <div className="loader-preview">
              <div className="loader-preview__stage">
                <LoaderShape
                  key={`${replay}-${String(values.loader_shape)}-${String(values.loader_style)}-${String(values.loader_custom_path)}`}
                  shape={String(values.loader_shape || "arch")}
                  customPath={String(values.loader_custom_path || "")}
                  style={String(values.loader_style || "draw")}
                  className="loader-preview__shape"
                />
              </div>
              <div>
                <p className="field__label">Live preview</p>
                <p className="field__help">This is exactly what visitors see in the loader. Invalid custom paths fall back to the arch shape.</p>
                <button type="button" className="btn btn--ghost" onClick={() => setReplay((n) => n + 1)}>
                  Replay animation
                </button>
              </div>
            </div>
          )}
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
