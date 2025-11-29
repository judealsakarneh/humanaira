"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createSupabaseBrowser } from "@/app/api/lib/supabaseBrowser";

export type ServiceData = {
  gig: any;
  packages: any[];
  seller: any;
  activePackage: any;
  setActivePackage: (pkg: any) => void;
  cheapestPackage: any;
  selectedPkg: any;
  startingPrice: string;
  profileHref: string;
  displayName: string;
  handle: string | null;
  checkoutHref: string;
  loading: boolean;
  error: string | null;
  imageUrls: string[];
  videoUrls: string[];
  categoryLabel: string | null;
  startChat: () => Promise<void>;
};

export function useServiceData(slug?: string): ServiceData {
  const supabase = createSupabaseBrowser();

  const [gig, setGig] = useState<any>(null);
  const [packages, setPackages] = useState<any[]>([]);
  const [seller, setSeller] = useState<any>(null);
  const [activePackage, setActivePackage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const videoRegex = /\.(mp4|webm|ogg|mov|m4v|avi|mkv)$/i;

  /** 🔍 Fetch gig using slug (SEO mode enabled) */
  useEffect(() => {
  if (!slug) return;

  async function loadGig() {
    console.log("📡 Fetching gig for slug:", slug);
    setLoading(true);

    // Try slug column first
    let { data, error } = await supabase
      .from("gigs")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    // If no result, try ID fallback
    if (!data) {
      console.log("⚠️ No slug match, trying ID fallback...");
      const fallback = await supabase
        .from("gigs")
        .select("*")
        .eq("id", slug)
        .maybeSingle();

      data = fallback.data;
      error = fallback.error;
    }

    console.log("🎯 Result:", { data, error });

    if (error || !data) {
      setError("Service not found.");
      setLoading(false);
      return;
    }

    setGig(data);

    // Load packages
    const { data: pkgRows } = await supabase
      .from("gig_packages")
      .select("*")
      .eq("gig_id", data.id);

    const sorted = (pkgRows || []).sort((a: any, b: any) => a.price_cents - b.price_cents);

    setPackages(sorted);
    setActivePackage(sorted[0] ?? null);

    setLoading(false);
  }

  loadGig();
}, [slug]);


  /** 👤 Fetch seller profile */
  useEffect(() => {
    if (!gig?.seller_id) return;

    async function loadSeller() {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", gig.seller_id)
        .maybeSingle();

      setSeller(data ?? null);
    }

    loadSeller();
  }, [gig?.seller_id]);

  /** 💡 Derived UI state */
  const selectedPkg = useMemo(
    () => activePackage ?? packages[0] ?? null,
    [activePackage, packages]
  );

  const cheapestPackage = useMemo(() => packages[0] ?? null, [packages]);

  const startingPrice = selectedPkg?.price_cents
    ? `$${(selectedPkg.price_cents / 100).toFixed(2)}`
    : "$0.00";

  const profileHref = seller?.id ? `/profile/${seller.id}` : "#";

  const checkoutHref = `/checkout?gig=${gig?.id}&tier=${selectedPkg?.tier}&price=${selectedPkg?.price_cents}`;

  const imageUrls = gig?.media_urls?.filter((u: string) => !videoRegex.test(u)) ?? [];
  const videoUrls = gig?.media_urls?.filter((u: string) => videoRegex.test(u)) ?? [];

  /** 💬 Start chat */
  const startChat = useCallback(async () => {
    if (!seller || !gig) return;

    const { data: auth } = await supabase.auth.getUser();
    const buyerId = auth?.user?.id;

    if (!buyerId) {
      window.location.href = `/auth/login?redirect=/services/${slug}`;
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

    const conv = await res.json();
    if (conv?.id) {
      window.location.href = `/messages?channel=${conv.id}`;
    }
  }, [seller, gig, slug]);

  return {
    gig,
    packages,
    seller,
    activePackage,
    setActivePackage,
    cheapestPackage,
    selectedPkg,
    startingPrice,
    profileHref,
    displayName: seller?.display_name || seller?.username || "Freelancer",
    handle: seller?.username ? `@${seller.username}` : null,
    checkoutHref,
    loading,
    error,
    imageUrls,
    videoUrls,
    categoryLabel: gig?.category ?? null,
    startChat,
  };
}
