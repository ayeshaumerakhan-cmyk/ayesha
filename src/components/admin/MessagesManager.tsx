"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Message = { id: string; name: string; email: string; message: string; is_read: boolean; created_at: string };

export function MessagesManager() {
  const [items, setItems] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data, error: err } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    if (err) setError(err.message);
    else setItems((data as Message[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleRead = async (m: Message, read: boolean) => {
    const supabase = createClient();
    const { error: err } = await supabase.from("contact_messages").update({ is_read: read }).eq("id", m.id);
    if (err) setError(err.message);
    else setItems((prev) => prev.map((x) => (x.id === m.id ? { ...x, is_read: read } : x)));
  };

  const open = (m: Message) => {
    setOpenId(openId === m.id ? null : m.id);
    if (!m.is_read) toggleRead(m, true);
  };

  const remove = async (m: Message) => {
    if (!window.confirm("Delete this message?")) return;
    const supabase = createClient();
    const { error: err } = await supabase.from("contact_messages").delete().eq("id", m.id);
    if (err) setError(err.message);
    else setItems((prev) => prev.filter((x) => x.id !== m.id));
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Messages</h1>
          <p className="muted">Everything sent through the contact form on the website.</p>
        </div>
      </div>
      {error && <p className="alert">{error}</p>}
      <div className="card">
        {loading ? (
          <p className="muted pad">Loading</p>
        ) : items.length === 0 ? (
          <div className="empty">
            <p>No messages yet.</p>
            <p className="muted">New messages from the Contact page will show up here.</p>
          </div>
        ) : (
          <ul className="messages">
            {items.map((m) => (
              <li key={m.id} className={m.is_read ? "" : "unread"}>
                <button type="button" className="messages__head" onClick={() => open(m)}>
                  <span className="messages__name">{m.name}</span>
                  <span className="muted">{m.email}</span>
                  <span className="muted messages__date">{new Date(m.created_at).toLocaleString()}</span>
                </button>
                {openId === m.id && (
                  <div className="messages__body">
                    <p>{m.message}</p>
                    <div className="row">
                      <a className="btn" href={`mailto:${m.email}?subject=${encodeURIComponent("Re: your message")}`}>
                        Reply by email
                      </a>
                      <button type="button" className="btn btn--ghost" onClick={() => toggleRead(m, !m.is_read)}>
                        Mark as {m.is_read ? "unread" : "read"}
                      </button>
                      <button type="button" className="btn btn--danger" onClick={() => remove(m)}>
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
