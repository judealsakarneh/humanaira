"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createSupabaseBrowser } from "@/app/api/lib/supabaseBrowser";
import HumanairaLoader from "@/components/HumanairaLoader";
import Link from "next/link";

export default function ServicePage() {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();
  const supabase = createSupabaseBrowser();

  const [gig, setGig] = useState<any>(null);
  const [packages, setPackages] = useState<any[]>([]);
  const [seller, setSeller] = useState<any>(null);
  const [categoryLabel, setCategoryLabel] = useState<string | null>(null);
  const [activePackage, setActivePackage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [startingChat, setStartingChat] = useState(false);

  /* ---------------- Fetch gig by slug ---------------- */
  useEffect(() => {
    if (!slug) return;

    (async () => {
      setLoading(true);

      const { data: gigRow } = await supabase
        .from("gigs")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (!gigRow) {
        setGig(null);
        setLoading(false);
        return;
      }

      setGig(gigRow);

      // fetch category label if exists
      if (gigRow.category) {
        const { data: cat } = await supabase
          .from("gig_categories")
          .select("label")
          .eq("key", gigRow.category)
          .maybeSingle();

        setCategoryLabel(cat?.label ?? null);
      }

      // Fetch packages
      const { data: pkgRows } = await supabase
        .from("gig_packages")
        .select("*")
        .eq("gig_id", gigRow.id);

      const sorted = (pkgRows || []).sort((a, b) => a.price_cents - b.price_cents);
      setPackages(sorted);
      setActivePackage(sorted[0] ?? null);

      setLoading(false);
    })();
  }, [slug]);

  /* ---------------- Fetch seller (old logic copied) ---------------- */
  useEffect(() => {
    if (!gig?.seller_id) return;

    (async () => {
      const sellerKey = String(gig.seller_id).trim();

      const { data: profile } = await supabase
        .from("profiles")
        .select(
          "id, username, display_name, full_name, avatar_url, bio, email, user_id, auth_user_id"
        )
        .or(
          [
            `id.eq.${sellerKey}`,
            `username.eq.${sellerKey}`,
            `user_id.eq.${sellerKey}`,
            `auth_user_id.eq.${sellerKey}`,
          ].join(",")
        )
        .maybeSingle();

      if (profile) {
        setSeller({
          id:
            profile.id ??
            profile.user_id ??
            profile.auth_user_id ??
            sellerKey,
          display_name: profile.display_name,
          username: profile.username,
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
          bio: profile.bio,
          email: profile.email,
        });
      }
    })();
  }, [gig?.seller_id]);

  /* ---------------- Derived values ---------------- */
  const displayName = useMemo(() => {
    if (!seller) return "Freelancer";
    return (
      seller.display_name ??
      seller.username ??
      seller.full_name ??
      (seller.email ? seller.email.split("@")[0] : "Freelancer")
    );
  }, [seller]);

  const profileHref = seller?.id ? `/profile/${seller.id}` : "#";

  const imageUrls = gig?.media_urls?.filter((u: string) => !/\.(mp4|mov|webm)$/i.test(u)) ?? [];
  const videoUrls = gig?.media_urls?.filter((u: string) => /\.(mp4|mov|webm)$/i.test(u)) ?? [];

  const startingPrice = activePackage
    ? `$${(activePackage.price_cents / 100).toFixed(2)}`
    : "$0.00";

  /* ---------------- Start Chat ---------------- */
  const startChat = useCallback(async () => {
    if (!seller || !gig) return;

    setStartingChat(true);

    const { data: auth } = await supabase.auth.getUser();
    const buyerId = auth?.user?.id;

    if (!buyerId) {
      router.push(`/login?redirect=/services/${slug}`);
      return;
    }

    const res = await fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        buyer_id: buyerId,
        seller_id: seller.id,
        gig_id: gig.id,
      }),
    });

    const body = await res.json();
    const cid = body?.id;

    if (cid) router.push(`/messages?cid=${cid}`);
    setStartingChat(false);
  }, [seller, gig, slug]);

  /* ---------------- UI States ---------------- */
  if (loading)
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#070D1C] pt-24">
        <HumanairaLoader subtitle="Loading service…" />
      </main>
    );

  if (!gig)
    return (
      <main className="min-h-screen flex items-center justify-center text-red-400 bg-[#070D1C] pt-24">
        Service not found.
      </main>
    );

  /* ---------------- Render ---------------- */
  return (
    <main className="min-h-screen bg-[#070D1C] text-white pt-24 px-4">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10">

        {/* LEFT */}
        <section className="flex-1">
          <h1 className="text-4xl font-bold mb-3">{gig.title}</h1>

          <div className="flex items-center gap-3 mb-6">
            <img
              src={seller?.avatar_url || "/default-avatar.png"}
              className="w-12 h-12 rounded-full border border-gray-700"
            />
            <div>
              <div className="font-semibold">{displayName}</div>
              <Link href={profileHref} className="text-[#35BFFF] text-sm hover:underline">
                View profile →
              </Link>
            </div>
          </div>

          {imageUrls[0] && (
            <img src={imageUrls[0]} className="rounded-xl w-full mb-6" />
          )}

          {videoUrls[0] && (
            <video controls className="rounded-xl w-full mb-6">
              <source src={videoUrls[0]} />
            </video>
          )}

          <div className="bg-[#0F1629] p-6 rounded-2xl border border-[#1f293d] mt-6">
            <h2 className="text-xl font-semibold mb-3">About This Service</h2>
            <p className="text-gray-300">{gig.description}</p>
          </div>
        </section>

        {/* RIGHT SIDE */}
        <aside className="w-full lg:w-[350px] space-y-6">
          <div className="bg-[#0F1629] p-6 rounded-2xl border border-[#1f293d]">
            <div className="text-gray-300 text-sm">Starting at</div>
            <div className="text-4xl text-[#35BFFF] font-bold mb-6">{startingPrice}</div>

            <button
              onClick={startChat}
              className="w-full py-3 text-center border border-[#35BFFF] text-[#35BFFF] font-semibold rounded-xl hover:bg-[#112233]"
            >
              {startingChat ? "Connecting…" : "Contact Seller"}
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}
