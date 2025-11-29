import { NextResponse } from "next/server";
import { StreamChat } from "stream-chat";
import { createSupabaseServer } from "@/app/api/lib/supabaseServer";

export async function GET() {
  try {
    const supabase = createSupabaseServer();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const apiKey = process.env.STREAM_API_KEY!;
    const secret = process.env.STREAM_SECRET!;

    if (!apiKey || !secret) {
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
