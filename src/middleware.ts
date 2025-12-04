import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Create Supabase client with service role for middleware
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
    return res;
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });

  // Get session from cookies
  const token = req.cookies.get('sb-access-token')?.value;
  
  let user = null;
  if (token) {
    const { data: { user: authUser } } = await supabase.auth.getUser(token);
    user = authUser;
  }

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
