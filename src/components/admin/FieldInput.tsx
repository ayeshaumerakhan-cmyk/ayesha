"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import type { FieldDef } from "@/lib/admin-config";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";

async function uploadFile(file: File, folder: string): Promise<string> {
  const supabase = createClient();
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "file";
  const path = `${folder}/${Date.now()}-${base}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw new Error(error.message);
  return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
}

function ImageField({ value, onChange, folder }: { value: string; onChange: (v: string) => void; folder: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const pick = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      onChange(await uploadFile(file, folder));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  };

  return (
    <div className="img-field">
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="img-field__preview" />
      ) : (
        <div className="img-field__empty">No image</div>
      )}
      <div className="img-field__side">
        <input
          type="text"
          value={value}
          placeholder="Paste an image link or upload a file"
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="row">
          <button type="button" className="btn btn--ghost" disabled={busy} onClick={() => input.current?.click()}>
            {busy ? "Uploading" : "Upload file"}
          </button>
          {value && (
            <button type="button" className="btn btn--ghost" onClick={() => onChange("")}>
              Remove
            </button>
          )}
        </div>
        {error && <p className="field-error">{error}</p>}
        <input ref={input} type="file" accept="image/*,application/pdf" hidden onChange={(e) => pick(e.target.files)} />
      </div>
    </div>
  );
}

function ImagesField({ value, onChange, folder }: { value: string[]; onChange: (v: string[]) => void; folder: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const add = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError("");
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) urls.push(await uploadFile(file, folder));
      onChange([...value, ...urls]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  };

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="imgs-field">
      <div className="imgs-field__grid">
        {value.map((src, i) => (
          <div className="imgs-field__item" key={`${src}-${i}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" />
            <div className="imgs-field__actions">
              <button type="button" onClick={() => move(i, -1)} aria-label="Move earlier">
                &lt;
              </button>
              <button type="button" onClick={() => move(i, 1)} aria-label="Move later">
                &gt;
              </button>
              <button type="button" onClick={() => onChange(value.filter((_, k) => k !== i))} aria-label="Remove">
                x
              </button>
            </div>
          </div>
        ))}
      </div>
      <button type="button" className="btn btn--ghost" disabled={busy} onClick={() => input.current?.click()}>
        {busy ? "Uploading" : "Add images"}
      </button>
      {error && <p className="field-error">{error}</p>}
      <input ref={input} type="file" accept="image/*" multiple hidden onChange={(e) => add(e.target.files)} />
    </div>
  );
}

function TagsField({ value, onChange, placeholder }: { value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [draft, setDraft] = useState("");

  const commit = () => {
    const t = draft.trim();
    if (t && !value.includes(t)) onChange([...value, t]);
    setDraft("");
  };
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit();
    } else if (e.key === "Backspace" && !draft && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div className="tags-field">
      {value.map((t) => (
        <span className="tags-field__tag" key={t}>
          {t}
          <button type="button" onClick={() => onChange(value.filter((x) => x !== t))} aria-label={`Remove ${t}`}>
            x
          </button>
        </span>
      ))}
      <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={onKey} onBlur={commit} placeholder={placeholder || "Add a tag"} />
    </div>
  );
}

type Props = {
  field: FieldDef;
  value: unknown;
  onChange: (value: unknown) => void;
  folder: string;
};

export function FieldInput({ field, value, onChange, folder }: Props) {
  const id = `f-${field.name}`;
  const str = typeof value === "string" ? value : value == null ? "" : String(value);

  let control;
  switch (field.type) {
    case "textarea":
      control = <textarea id={id} rows={4} value={str} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} />;
      break;
    case "markdown":
      control = <textarea id={id} rows={14} className="mono" value={str} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} />;
      break;
    case "number":
      control = <input id={id} type="number" value={str} onChange={(e) => onChange(e.target.value)} />;
      break;
    case "date":
      control = <input id={id} type="date" value={str.slice(0, 10)} onChange={(e) => onChange(e.target.value)} />;
      break;
    case "boolean":
      control = (
        <label className="switch">
          <input id={id} type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
          <span>{Boolean(value) ? "Yes" : "No"}</span>
        </label>
      );
      break;
    case "select":
      control = (
        <select id={id} value={str} onChange={(e) => onChange(e.target.value)}>
          {(field.options || []).map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      );
      break;
    case "image":
      control = <ImageField value={str} onChange={onChange} folder={folder} />;
      break;
    case "images":
      control = <ImagesField value={Array.isArray(value) ? (value as string[]) : []} onChange={onChange} folder={folder} />;
      break;
    case "tags":
      control = <TagsField value={Array.isArray(value) ? (value as string[]) : []} onChange={onChange} placeholder={field.placeholder} />;
      break;
    case "url":
      control = <input id={id} type="url" value={str} placeholder={field.placeholder || "https://"} onChange={(e) => onChange(e.target.value)} />;
      break;
    default:
      control = <input id={id} type="text" value={str} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} />;
  }

  return (
    <div className="field">
      <label htmlFor={id} className="field__label">
        {field.label}
        {field.required && <span aria-hidden="true"> *</span>}
      </label>
      {control}
      {field.help && <p className="field__help">{field.help}</p>}
    </div>
  );
}
