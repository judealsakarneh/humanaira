'use client'
import { useEffect, useMemo, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseBrowser } from '../../api/lib/supabaseBrowser'

function Avatar({
  email,
  name,
  avatarUrl,
}: {
  email?: string | null
  name?: string | null
  avatarUrl?: string | null
}) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name || 'Seller'}
        className="w-24 h-24 rounded-full object-cover border-4 border-sky-600 ring-4 ring-sky-900/50 bg-[#1e293b]"
        style={{ minWidth: 96, minHeight: 96 }}
        onError={(e) => {
          e.currentTarget.onerror = null
          e.currentTarget.src = 'https://placehold.co/96x96/0ea5e9/ffffff?text=U'
        }}
      />
    )
  }
  const hash = email ? String(email.length % 100) : ''
  const url = email ? `https://www.gravatar.com/avatar/${hash}?d=identicon&s=96` : null
  if (url) {
    return (
      <img
        src={url}
        alt={name || 'Seller'}
        className="w-24 h-24 rounded-full object-cover border-4 border-sky-600 ring-4 ring-sky-900/50 bg-[#1e293b]"
        style={{ minWidth: 96, minHeight: 96 }}
      />
    )
  }
  return (
    <div className="w-24 h-24 rounded-full bg-sky-900 flex items-center justify-center text-4xl text-sky-300 font-bold border-4 border-sky-600 ring-4 ring-sky-900/50">
      {name ? name[0].toUpperCase() : 'U'}
    </div>
  )
}

type UserRow = {
  id: string
  full_name: string | null
  username?: string | null
  avatar_url: string | null
  bio: string | null
  email: string | null
  created_at: string | null
  display_name?: string | null
  user_id?: string | null
  auth_user_id?: string | null
}

type GigRow = {
  id: string
  slug: string
  title: string
  cover_image_url?: string | null
  category?: string | null
  sales?: number | null
  seller_id?: string | null
  price_cents?: number | null // fallback if no packages
}

type PackageRow = {
  gig_id: string
  price_cents: number
}

export default function ProfilePage() {
  const params = useParams<{ id: string | string[] }>()
  const idParam = Array.isArray(params?.id) ? params.id[0] : params?.id
  const sellerKey = (typeof idParam === 'string' ? decodeURIComponent(idParam) : '')
    .trim()
    .replace(/^['"{(]+|['")}]$/g, '')

  const [user, setUser] = useState<UserRow | null>(null)
  const [gigs, setGigs] = useState<GigRow[]>([])
  const [prices, setPrices] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const hasName = (u?: Partial<UserRow> | null) =>
    !!(u?.display_name || u?.username || u?.full_name)

  useEffect(() => {
    let isMounted = true
    if (!sellerKey) {
      setError('Missing profile id')
      setLoading(false)
      return
    }

    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        const supabase = createSupabaseBrowser()

        // 1) Try profiles by id/username/(user_id/auth_user_id if present)
        const { data: profile } = await supabase
          .from('profiles')
          .select(
            'id, username, display_name, full_name, avatar_url, bio, email, created_at, user_id, auth_user_id'
          )
          .or(
            [
              `id.eq.${sellerKey}`,
              `username.eq.${sellerKey}`,
              `user_id.eq.${sellerKey}`,
              `auth_user_id.eq.${sellerKey}`,
            ].join(',')
          )
          .limit(1)
          .maybeSingle()

        let resolvedSellerId = sellerKey
        if (profile) {
          const normalized: UserRow = {
            id: String(profile.id ?? profile.user_id ?? profile.auth_user_id ?? sellerKey),
            display_name: profile.display_name ?? null,
            username: profile.username ?? null,
            full_name: profile.full_name ?? null,
            avatar_url: profile.avatar_url ?? null,
            bio: profile.bio ?? null,
            email: profile.email ?? null,
            created_at: profile.created_at ?? null,
            user_id: (profile as any).user_id ?? null,
            auth_user_id: (profile as any).auth_user_id ?? null,
          }
          resolvedSellerId = normalized.id
          if (isMounted) setUser(normalized)
        } else {
          if (isMounted)
            setUser({
              id: sellerKey,
              full_name: null,
              username: null,
              avatar_url: null,
              bio: null,
              email: null,
              created_at: null,
              display_name: null,
            })
        }

        // 2) Load gigs by resolved id (include price_cents as fallback when no packages)
        const { data: gigsData } = await supabase
          .from('gigs')
          .select('id, slug, title, cover_image_url, category, sales, seller_id, price_cents')
          .eq('seller_id', resolvedSellerId)
          .order('created_at', { ascending: false })

        const gigsList = (gigsData as GigRow[]) || []
        if (isMounted) setGigs(gigsList)

        // 3a) If we still don't have a name, and gigs exist, re-fetch the profile by the actual seller_id from the gig
        if (isMounted && !hasName(user) && gigsList.length > 0) {
          const ownerId = gigsList[0]?.seller_id
          if (ownerId && ownerId !== resolvedSellerId) {
            const { data: ownerProfile } = await supabase
              .from('profiles')
              .select(
                'id, username, display_name, full_name, avatar_url, bio, email, created_at, user_id, auth_user_id'
              )
              .eq('id', ownerId)
              .limit(1)
              .maybeSingle()

            if (ownerProfile) {
              const normalized: UserRow = {
                id: String(
                  ownerProfile.id ??
                    (ownerProfile as any).user_id ??
                    (ownerProfile as any).auth_user_id ??
                    ownerId
                ),
                display_name: ownerProfile.display_name ?? null,
                username: ownerProfile.username ?? null,
                full_name: ownerProfile.full_name ?? null,
                avatar_url: ownerProfile.avatar_url ?? null,
                bio: ownerProfile.bio ?? null,
                email: ownerProfile.email ?? null,
                created_at: ownerProfile.created_at ?? null,
                user_id: (ownerProfile as any).user_id ?? null,
                auth_user_id: (ownerProfile as any).auth_user_id ?? null,
              }
              if (isMounted) setUser((prev) => ({ ...(prev || normalized), ...normalized }))
            }
          }
        }

        // 3b) If still no name, try auth metadata via a view (profiles_view)
        if (isMounted && !hasName(user)) {
          const candidateIds = [
            user?.id,
            (user as any)?.user_id,
            (user as any)?.auth_user_id,
            resolvedSellerId,
            gigsList[0]?.seller_id,
          ].filter(Boolean) as string[]

          if (candidateIds.length) {
            const { data: authRows } = await supabase
              .from('profiles_view')
              .select('id, display_name, username, full_name, avatar_url, email, created_at')
              .in('id', candidateIds)
              .limit(1)

            if (authRows && authRows.length) {
              const a = authRows[0] as any
              const merged: UserRow = {
                id: String(a.id),
                display_name: user?.display_name ?? a.display_name ?? null,
                username: user?.username ?? a.username ?? null,
                full_name: user?.full_name ?? a.full_name ?? null,
                avatar_url: user?.avatar_url ?? a.avatar_url ?? null,
                bio: user?.bio ?? null,
                email: user?.email ?? a.email ?? null,
                created_at: user?.created_at ?? a.created_at ?? null,
              }
              if (isMounted) setUser(merged)
            }
          }
        }

        // 4) Prices for gigs: get min package price per gig. If no packages or RLS blocks them,
        // we'll fall back to gig.price_cents during render.
        const gigIds = gigsList.map((g) => g.id)
        if (gigIds.length) {
          const { data: pkgs } = await supabase
            .from('gig_packages')
            .select('gig_id, price_cents')
            .in('gig_id', gigIds)

          if (pkgs && isMounted) {
            const minByGig = (pkgs as PackageRow[]).reduce((acc: Record<string, number>, p) => {
              acc[p.gig_id] =
                acc[p.gig_id] == null ? p.price_cents : Math.min(acc[p.gig_id], p.price_cents)
              return acc
            }, {})
            setPrices(minByGig)
          }
        }

        if (!profile && gigsList.length === 0) {
          setError('User not found')
        }
      } catch (e: any) {
        if (isMounted) setError(e?.message || 'Error loading profile')
      } finally {
        if (isMounted) setLoading(false)
      }
    })()

    return () => {
      isMounted = false
    }
  }, [sellerKey])

  const formatPrice = useMemo(
    () => (cents?: number | null) => {
      if (cents == null) return 'N/A'
      return `$${(cents / 100).toFixed(2)}`
    },
    []
  )

  // Compute display price per gig: prefer min package price, else fallback to gig.price_cents.
  const getStartingPriceCents = useCallback(
    (g: GigRow) => {
      const p = prices[g.id]
      if (typeof p === 'number') return p
      if (typeof g.price_cents === 'number') return g.price_cents
      return null
    },
    [prices]
  )

  const displayName = useMemo(() => {
    if (!user) return 'Freelancer'
    return (
      user.display_name ??
      user.username ??
      user.full_name ??
      (user.email ? user.email.split('@')[0] : undefined) ??
      (user.id ? `User ${user.id.slice(0, 6)}` : 'Freelancer')
    )
  }, [user])

  if (loading) {
    return (
      <main className="bg-[#030712] min-h-screen flex items-center justify-center pt-24">
        <div className="flex items-center text-sky-300">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-t-sky-600 border-slate-700"></div>
          <span className="ml-3">Loading profile…</span>
        </div>
      </main>
    )
  }

  if (error || !user) {
    return (
      <main className="bg-[#030712] min-h-screen flex items-center justify-center pt-24">
        <div className="text-red-500 text-lg font-semibold p-6 bg-[#0f172a] rounded-xl border border-red-800/50">
          {error || 'User not found'}
        </div>
      </main>
    )
  }

  return (
    <main className="bg-[#030712] min-h-screen font-sans">
      <div className="max-w-6xl mx-auto px-4 py-12 pt-28">
        <div className="relative overflow-hidden bg-[#0f172a] rounded-2xl border border-sky-900/50 p-6">
          {user?.username && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-end pr-4">
              <span className="text-[6rem] md:text-[10rem] font-extrabold uppercase tracking-tight text-sky-900/20 leading-none select-none whitespace-nowrap">
                {user.username}
              </span>
            </div>
          )}

          <div className="relative z-10 flex items-center gap-5">
            <Avatar email={user.email ?? undefined} name={displayName} avatarUrl={user.avatar_url ?? undefined} />
            <div className="min-w-0">
              <h1 className="text-3xl font-bold text-white">{displayName}</h1>

              {/* Username bigger and above the email */}
              {user.username && (
                <div className="text-sky-400 text-xl font-semibold mt-1">@{user.username}</div>
              )}

              {/* Email below username */}
              <div className="text-slate-400 text-sm truncate mt-1">
                {user.email || `ID: ${user.id}`}
              </div>

              {/* Bio */}
              {user.bio && <p className="text-slate-300 mt-2">{user.bio}</p>}
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-bold text-sky-300 mb-4">Services</h2>

          {gigs.length === 0 ? (
            <div className="text-slate-400 bg-[#0f172a] border border-[#1e293b] rounded-xl p-6">
              No services yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gigs.map((g) => {
                const cents = getStartingPriceCents(g)
                return (
                  <Link
                    key={g.id}
                    href={`/services/${g.slug}`}
                    className="group block bg-[#0f172a] rounded-xl border border-[#1e293b] hover:border-sky-700 transition overflow-hidden"
                  >
                    <div className="aspect-video bg-black flex items-center justify-center">
                      {g.cover_image_url ? (
                        <img
                          src={g.cover_image_url}
                          alt={g.title}
                          className="w-full h-full object-cover"
                          style={{ backgroundColor: '#000' }}
                          onError={(e) => {
                            e.currentTarget.onerror = null
                            e.currentTarget.src =
                              'https://placehold.co/400x225/3b82f6/ffffff?text=Service'
                          }}
                        />
                      ) : (
                        <div className="text-slate-500">No image</div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="text-white font-semibold line-clamp-2 group-hover:text-sky-300 transition">
                        {g.title}
                      </div>
                      <div className="mt-2 text-sm text-slate-400 flex items-center justify-between">
                        <span>{g.category || 'General'}</span>
                        <span className="text-sky-400 font-semibold">
                          {formatPrice(cents)}
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        Completed: <span className="text-sky-300">{g.sales || 0}</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        body { background-color: #030712; color: #f1f5f9; }
      `}</style>
    </main>
  )
}