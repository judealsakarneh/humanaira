import { NextResponse } from "next/server";
import { StreamChat } from "stream-chat";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    
    // Debug: Check if auth cookies exist
    const allCookies = cookieStore.getAll();
    const authCookies = allCookies.filter(c => c.name.includes('auth'));
    console.log('Auth cookies found:', authCookies.map(c => c.name));
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          async get(name: string) {
            return cookieStore.get(name)?.value;
          },
          async set(name: string, value: string, options: any) {
            try {
              cookieStore.set({ name, value, ...options });
            } catch (error) {
              // Ignore errors in route handlers
            }
          },
          async remove(name: string, options: any) {
            try {
              cookieStore.set({ name, value: "", ...options });
            } catch (error) {
              // Ignore errors in route handlers
            }
          },
        },
      }
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    console.log('getUser result:', { user: user?.id, error: authError?.message });

    if (!user) {
      console.error('No user found in token endpoint');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const apiKey = process.env.NEXT_PUBLIC_STREAM_KEY!;
    const secret = process.env.STREAM_SECRET!;

    if (!apiKey || !secret) {
      console.error("Missing Stream vars:", { apiKey: !!apiKey, secret: !!secret });
      return NextResponse.json(
        { error: "Missing Stream environment variables" },
        { status: 500 }
      );
    }

    const client = StreamChat.getInstance(apiKey, secret);

    // We keep role but NOT inside the token (your current Stream SDK doesn't support this)
    const role = user.user_metadata?.role || "buyer";

    const token = client.createToken(user.id);

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        role,
        name: user.user_metadata?.full_name || user.email,
        image: user.user_metadata?.avatar_url || null,
      },
    });
  } catch (err) {
    console.error("STREAM TOKEN ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
