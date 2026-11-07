import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Admins" };

export default async function AdminsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("admins").select("user_id, email, created_at").order("created_at");
  const admins = (data ?? []) as { user_id: string; email: string | null; created_at: string }[];

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Admins</h1>
          <p className="muted">Admins are added by hand in Supabase so nobody can promote themselves from the website.</p>
        </div>
      </div>

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>User ID</th>
              <th>Added</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((a) => (
              <tr key={a.user_id}>
                <td>{a.email}</td>
                <td className="mono small">{a.user_id}</td>
                <td>{new Date(a.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card pad">
        <h2>Add another admin</h2>
        <ol className="steps">
          <li>In Supabase open Authentication, then Users, then Add user, then Create new user. Tick Auto Confirm User.</li>
          <li>Open the SQL Editor and run supabase/04_make_admin.sql with that email.</li>
          <li>They can now sign in at /admin/login.</li>
        </ol>
      </div>
    </div>
  );
}
