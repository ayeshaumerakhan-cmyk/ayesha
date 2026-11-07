import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { isSupabaseConfigured } from "@/lib/env";

/**
 * Guards everything under /admin.
 *  - Not signed in            -> /admin/login
 *  - Signed in but not admin  -> /admin/login?error=not-admin
 *  - Signed in admin on login -> /admin
 * The same rule is enforced again in the admin layout and, most importantly,
 * by Row Level Security in the database.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLogin = pathname === "/admin/login";

  const redirectTo = (path: string, search = "") => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    url.search = search;
    return NextResponse.redirect(url);
  };

  if (!isSupabaseConfigured) {
    return isLogin ? withNoIndex(NextResponse.next()) : redirectTo("/admin/login", "?error=not-configured");
  }

  const { response, user, isAdmin } = await updateSession(request);

  const guard = (target: NextResponse) => {
    // keep refreshed auth cookies on redirects
    response.cookies.getAll().forEach((c) => target.cookies.set(c));
    return withNoIndex(target);
  };

  if (isLogin) {
    if (user && isAdmin) return guard(redirectTo("/admin"));
    return withNoIndex(response);
  }

  if (!user) return guard(redirectTo("/admin/login", `?next=${encodeURIComponent(pathname)}`));
  if (!isAdmin) return guard(redirectTo("/admin/login", "?error=not-admin"));

  return withNoIndex(response);
}

function withNoIndex(res: NextResponse) {
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  res.headers.set("Cache-Control", "no-store");
  return res;
}

export const config = {
  matcher: ["/admin/:path*"],
};
