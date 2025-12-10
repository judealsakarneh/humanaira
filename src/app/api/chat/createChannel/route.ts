import { NextResponse } from "next/server";
import { StreamChat } from "stream-chat";
import { createSupabaseServer } from "@/app/api/lib/supabaseServer";

type ReqBody = {
  freelancerId?: string;
};

export async function POST(req: Request) {
  try {
    const body: ReqBody = await req.json();
    const freelancerId = body?.freelancerId?.toString();

    if (!freelancerId) {
      return NextResponse.json({ error: "Missing freelancerId" }, { status: 400 });
    }

    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const apiKey = process.env.STREAM_API_KEY ?? process.env.NEXT_PUBLIC_STREAM_KEY;
    const secret = process.env.STREAM_SECRET;

    if (!apiKey || !secret) {
      return NextResponse.json({ error: "Missing Stream credentials" }, { status: 500 });
    }

    const serverClient = StreamChat.getInstance(apiKey, secret);

    const channelId = `hmr_${user.id}_${freelancerId}`;

    const channelData: Record<string, unknown> = {
      buyer_id: user.id,
      freelancer_id: freelancerId,
      conversation_stage: "initiated",
      is_project_thread: true,
      created_at: new Date().toISOString(),
      last_activity: new Date().toISOString(),
      members: [user.id, freelancerId],
    };

    const channel = serverClient.channel("humanaira_pm", channelId, channelData as any);

    let isNewChannel = false;

    try {
      await channel.create({ created_by: { id: user.id } });
      isNewChannel = true;
    } catch (err: any) {
      const alreadyExists =
        err?.code === 16 ||
        err?.status === 409 ||
        /exists|already/i.test(err?.message ?? "");

      if (!alreadyExists) {
        console.error("STREAM CREATE ERROR:", err);
        return NextResponse.json({ error: "Failed to create channel" }, { status: 500 });
      }

      // Patch metadata if it already exists
      try {
        await (serverClient as any).partialUpdateChannel("humanaira_pm", channelId, {
          set: channelData,
        });
      } catch {
        await (channel as any).update({ set: channelData });
      }

      try {
        await channel.addMembers([user.id, freelancerId]);
      } catch {}
    }

    // --- Auto Welcome Message Only If New ---
if (isNewChannel) {
  await channel.sendMessage({
    text: "👋 Welcome! The freelancer will reply soon.",
    user_id: "system",
    type: "system", // valid metadata
  });

  await (channel as any).update({
    set: { last_activity: new Date().toISOString() },
  });
}


    return NextResponse.json({
      ok: true,
      channelId,
      metadata: channelData,
    });

  } catch (err: any) {
    console.error("CREATE CHANNEL ERROR:", err);
    return NextResponse.json({ error: err?.message ?? "Server error" }, { status: 500 });
  }
}
