import { NextResponse } from "next/server";
import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareSupabaseClient({ req, res });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect messaging & orders pages
  const protectedRoutes = ["/messages", "/orders", "/inbox"];

  if (protectedRoutes.some(path => req.nextUrl.pathname.startsWith(path))) {
    if (!user) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ["/messages/:path*", "/orders/:path*", "/inbox/:path*"],
};
