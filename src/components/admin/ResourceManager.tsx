"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { revalidateSite } from "@/app/admin/actions";
import { FieldInput } from "@/components/admin/FieldInput";
import type { FieldDef, ResourceConfig } from "@/lib/admin-config";
import { sampleRows } from "@/lib/admin-seed";
import { USE_MOCK_DATA } from "@/lib/env";
import { createClient } from "@/lib/supabase/client";
import { slugify, truncate } from "@/lib/utils";

type Row = Record<string, unknown>;
type Values = Record<string, unknown>;

function initialValues(fields: FieldDef[], row: Row | null): Values {
  const v: Values = {};
  for (const f of fields) {
    const raw = row ? row[f.name] : undefined;
    if (raw !== undefined && raw !== null) {
      v[f.name] = raw;
    } else if (f.defaultValue !== undefined) {
      v[f.name] = f.defaultValue;
    } else if (f.type === "boolean") {
      v[f.name] = false;
    } else if (f.type === "images" || f.type === "tags") {
      v[f.name] = [];
    } else if (f.type === "number") {
      v[f.name] = 0;
    } else {
      v[f.name] = "";
    }
  }
  return v;
}

function buildPayload(fields: FieldDef[], values: Values): { payload: Row; error: string } {
  const payload: Row = {};
  for (const f of fields) {
    const raw = values[f.name];
    if (f.type === "number") {
      payload[f.name] = Number(raw) || 0;
    } else if (f.type === "boolean") {
      payload[f.name] = Boolean(raw);
    } else if (f.type === "images" || f.type === "tags") {
      payload[f.name] = Array.isArray(raw) ? raw.map((x) => String(x)).filter(Boolean) : [];
    } else {
      let text = String(raw ?? "").trim();
      if (!text && f.slugFrom) text = slugify(String(values[f.slugFrom] ?? ""));
      if (f.slugFrom && text) text = slugify(text);
      if (!text) {
        if (f.required) return { payload, error: `${f.label} is required.` };
        payload[f.name] = null;
      } else {
        payload[f.name] = text;
      }
    }
  }
  return { payload, error: "" };
}

function Cell({ name, value }: { name: string; value: unknown }) {
  if (value === null || value === undefined || value === "") return <span className="muted">-</span>;
  if (typeof value === "boolean") return <>{value ? "Yes" : "No"}</>;
  if (Array.isArray(value)) return <>{value.join(", ")}</>;
  const text = String(value);
  if ((name.endsWith("_url") || name === "url") && /\.(png|jpe?g|webp|avif|gif|svg)(\?|$)/i.test(text)) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={text} alt="" className="thumb" />;
  }
  return <>{truncate(text, 60)}</>;
}

const label = (name: string) => name.replace(/_url$/, "").replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());

export function ResourceManager({ config }: { config: ResourceConfig }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState<Row | "new" | null>(null);
  const [values, setValues] = useState<Values>({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { data, error: err } = await supabase
      .from(config.table)
      .select("*")
      .order(config.orderBy, { ascending: config.ascending ?? true });
    if (err) setError(err.message);
    else setRows((data as Row[]) ?? []);
    setLoading(false);
  }, [config.table, config.orderBy, config.ascending]);

  const [importing, setImporting] = useState(false);
  const autoTried = useRef(false);
  const seedKey = `admin-sample-loaded:${config.table}`;
  const samples = USE_MOCK_DATA ? sampleRows(config.table) : null;

  /** Copies the sample content shown on the website into the database so it can be edited. */
  const importSamples = useCallback(async () => {
    if (!samples) return;
    setImporting(true);
    const payload = samples.map((src) => {
      const row: Row = {};
      for (const f of config.fields) {
        const v = src[f.name];
        if (v !== undefined) row[f.name] = v === "" && !f.required ? null : v;
      }
      if (config.publishable) row.published = true;
      return row;
    });
    const supabase = createClient();
    const { error: err } = await supabase.from(config.table).insert(payload);
    setImporting(false);
    if (err) {
      setError(`Could not load the current website content: ${err.message}`);
      return;
    }
    try {
      window.localStorage.setItem(seedKey, "1");
    } catch {
      /* ignore */
    }
    await revalidateSite();
    load();
  }, [samples, config.fields, config.publishable, config.table, seedKey, load]);

  useEffect(() => {
    load();
  }, [load]);

  // First visit to an empty section: load what the website currently shows, once.
  useEffect(() => {
    if (loading || error || rows.length > 0 || !samples || autoTried.current) return;
    autoTried.current = true;
    let already = false;
    try {
      already = window.localStorage.getItem(seedKey) === "1";
    } catch {
      /* ignore */
    }
    if (!already) importSamples();
  }, [loading, error, rows.length, samples, seedKey, importSamples]);

  const flash = (msg: string) => {
    setNotice(msg);
    window.setTimeout(() => setNotice(""), 3500);
  };

  const open = (row: Row | "new") => {
    setEditing(row);
    setFormError("");
    setValues(initialValues(config.fields, row === "new" ? null : row));
  };

  const close = () => {
    setEditing(null);
    setFormError("");
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    const { payload, error: problem } = buildPayload(config.fields, values);
    if (problem) {
      setFormError(problem);
      return;
    }
    setSaving(true);
    setFormError("");
    const supabase = createClient();
    const result =
      editing === "new" || editing === null
        ? await supabase.from(config.table).insert(payload)
        : await supabase.from(config.table).update(payload).eq("id", String((editing as Row).id));
    setSaving(false);
    if (result.error) {
      setFormError(
        result.error.message.includes("duplicate key")
          ? "That URL slug is already used. Choose a different one."
          : result.error.message,
      );
      return;
    }
    await revalidateSite();
    flash(editing === "new" ? "Created. The site is updated." : "Saved. The site is updated.");
    close();
    load();
  };

  const remove = async (row: Row) => {
    if (!window.confirm(`Delete this ${config.singular}? This cannot be undone.`)) return;
    const supabase = createClient();
    const { error: err } = await supabase.from(config.table).delete().eq("id", String(row.id));
    if (err) {
      setError(err.message);
      return;
    }
    await revalidateSite();
    flash("Deleted.");
    load();
  };

  const togglePublished = async (row: Row) => {
    const supabase = createClient();
    const { error: err } = await supabase
      .from(config.table)
      .update({ published: !row.published })
      .eq("id", String(row.id));
    if (err) {
      setError(err.message);
      return;
    }
    await revalidateSite();
    load();
  };

  const setValue = (name: string, v: unknown) => setValues((prev) => ({ ...prev, [name]: v }));

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>{config.title}</h1>
          <p className="muted">{config.description}</p>
        </div>
        <button type="button" className="btn" onClick={() => open("new")}>
          New {config.singular}
        </button>
      </div>

      {notice && <p className="notice">{notice}</p>}
      {error && <p className="alert">{error}</p>}

      {editing && (
        <form className="card form" onSubmit={save}>
          <div className="form__head">
            <h2>{editing === "new" ? `New ${config.singular}` : `Edit ${config.singular}`}</h2>
            <button type="button" className="btn btn--ghost" onClick={close}>
              Cancel
            </button>
          </div>
          {config.fields.map((f) => (
            <div key={f.name}>
              {f.section && <h3 className="form__section">{f.section}</h3>}
              <FieldInput field={f} value={values[f.name]} onChange={(v) => setValue(f.name, v)} folder={config.table} />
            </div>
          ))}
          {formError && <p className="alert">{formError}</p>}
          <div className="row">
            <button type="submit" className="btn" disabled={saving}>
              {saving ? "Saving" : "Save"}
            </button>
            <button type="button" className="btn btn--ghost" onClick={close}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="card table-wrap">
        {loading ? (
          <p className="muted pad">Loading</p>
        ) : rows.length === 0 ? (
          <div className="empty">
            <p>{importing ? "Loading the current website content" : `No ${config.title.toLowerCase()} yet.`}</p>
            {samples ? (
              <p className="muted">The public site is showing sample content here. Load it to edit, replace or delete every item.</p>
            ) : null}
            <div className="row">
              {samples && (
                <button type="button" className="btn" disabled={importing} onClick={importSamples}>
                  {importing ? "Loading" : "Load the current website content"}
                </button>
              )}
              <button type="button" className={samples ? "btn btn--ghost" : "btn"} onClick={() => open("new")}>
                Add the first {config.singular}
              </button>
            </div>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                {config.columns.map((c) => (
                  <th key={c}>{label(c)}</th>
                ))}
                {config.publishable && <th>Live</th>}
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={String(row.id)}>
                  {config.columns.map((c) => (
                    <td key={c}>
                      <Cell name={c} value={row[c]} />
                    </td>
                  ))}
                  {config.publishable && (
                    <td>
                      <button
                        type="button"
                        className={`pill ${row.published ? "pill--on" : ""}`}
                        onClick={() => togglePublished(row)}
                        title="Click to toggle"
                      >
                        {row.published ? "Published" : "Draft"}
                      </button>
                    </td>
                  )}
                  <td className="actions">
                    <button type="button" className="btn btn--ghost" onClick={() => open(row)}>
                      Edit
                    </button>
                    <button type="button" className="btn btn--danger" onClick={() => remove(row)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
