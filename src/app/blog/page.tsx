'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'

type Stat = { value: string; label: string; icon: string }
type Article = {
  id: number
  title: string
  category: 'Freelancer Guide' | 'Client Strategy' | 'Analytics' | 'Industry News' | 'Case Study'
  color: string
  time: string
  excerpt: string
  content: string
  image?: string
  tags?: string[]
}

const AI_STATS: Stat[] = [
  { value: '45%', label: 'Projected annual growth (CAGR) of AI services market by 2030.', icon: '📈' },
  { value: '$15.7T', label: 'Estimated boost to the global economy by AI by 2030.', icon: '💰' },
  { value: '2.1M', label: 'New AI/ML roles created worldwide in the last 12 months.', icon: '🧑‍💻' },
  { value: '78%', label: 'Companies reporting ROI uplifts after hiring AI freelancers.', icon: '🎯' },
]

const FEATURED: Article = {
  id: 0,
  title: 'The Great Skill Shift: AI Freelancers Are Redefining Work',
  category: 'Industry News',
  color: 'text-indigo-400',
  time: '10 min',
  excerpt:
    'From prompt engineers to MLOps specialists, AI-focused freelancers are shipping value faster than traditional teams.',
  content:
    'Across teams of all sizes, AI freelancers are accelerating delivery by bringing “just-in-time” expertise. Productized packages, reproducible repos, and measurable outcomes let buyers move from idea to pilot in days, not months. The winning patterns: clear scoping, sandboxed demo data, and expectations set via simple benchmarks (quality, latency, cost). For freelancers, credibility comes from transparent model cards, sensible defaults, and a bias toward maintainability.',
  image: 'https://placehold.co/960x540/0f172a/93c5fd?text=AI+Workforce+Redefined',
  tags: ['FutureOfWork', 'FreelanceTrends', 'AI-ML'],
}

const ALL_POSTS: Article[] = [
  {
    id: 1,
    title: 'MLOps vs. DevOps: What AI Freelancers Need to Master Now',
    category: 'Freelancer Guide',
    color: 'text-amber-400',
    time: '5 min',
    excerpt:
      'Shipping models ≠ shipping software. Here’s how top freelancers structure CI/CD for data, features, and evaluations.',
    content:
      'In AI projects, the artifact is a living system—data drifts, prompts evolve, costs change. Winning freelancers treat pipelines as products. Start with an eval harness (quality, latency, cost). Gate changes on eval deltas. Log prompts and inputs. Use environment-specific secrets and quotas. Your goal: faster iteration with fewer regressions.',
    image: 'https://placehold.co/800x450/0f172a/93c5fd?text=MLOps+vs+DevOps',
    tags: ['MLOps', 'BestPractices'],
  },
  {
    id: 2,
    title: '5 Essentials for Ethical AI Development in 2026',
    category: 'Client Strategy',
    color: 'text-emerald-400',
    time: '7 min',
    excerpt:
      'Compliance is a feature. These practical steps reduce risk and build trust from day one.',
    content:
      '1) Minimize data exposure with masked samples. 2) Document model and data provenance. 3) Add appeal paths for automated decisions. 4) Track cost and accuracy regressions. 5) Structure IP ownership in plain language. Ethics done right accelerates approvals and reduces rework.',
    image: 'https://placehold.co/800x450/052e2b/8ff7e8?text=Ethical+AI+Essentials',
    tags: ['Compliance', 'Governance'],
  },
  {
    id: 3,
    title: 'Case Study: 300% ROI from a Custom GPT Implementation',
    category: 'Analytics',
    color: 'text-pink-400',
    time: '8 min',
    excerpt:
      'A midsize support team automated triage with a custom GPT. The economics were unambiguous.',
    content:
      'Scope: classify tickets, summarize threads, draft replies. Guardrails: PII scrubbing and human-in-the-loop. Results: 37% faster response, 19% higher CSAT, monthly infra at 18% of labor savings. Success hinged on crisp acceptance criteria and early measurement.',
    image: 'https://placehold.co/800x450/2d0a2d/fcc2ff?text=300%25+ROI+Case+Study',
    tags: ['CaseStudy', 'SupportAutomation'],
  },
  {
    id: 4,
    title: 'Specialized AI Niches: From GenAI to Retrieval and Agents',
    category: 'Industry News',
    color: 'text-indigo-400',
    time: '6 min',
    excerpt:
      'Services are fragmenting into repeatable niches. Buyers want specialists who ship outcomes.',
    content:
      'High-conversion niches: document Q&A with RAG, lead-gen enrichment, internal copilots, analytics agents. Productize each niche as a fixed-scope package with timelines, demos, and clear handoffs. Specialists win with clarity.',
    image: 'https://placehold.co/800x450/141c3a/b1e0ff?text=AI+Niches',
    tags: ['Niches', 'GoToMarket'],
  },
  {
    id: 5,
    title: 'Scaling Your AI Career: Negotiating Premium Rates',
    category: 'Freelancer Guide',
    color: 'text-sky-400',
    time: '4 min',
    excerpt:
      'Premium rates follow premium positioning. Show outcomes, not hours.',
    content:
      'Anchor on business value, not tech. Use before/after metrics and short demos. Offer add-ons (monitoring, fine-tunes) and a light retainer. Publish a model card and a cost/latency profile. Make due diligence easy for buyers.',
    image: 'https://placehold.co/800x450/0b2d3a/cbf2ff?text=Premium+Rates',
    tags: ['Pricing', 'Positioning'],
  },
  {
    id: 6,
    title: 'Data Security in Cloud AI: A Non‑Technical Buyer’s Guide',
    category: 'Client Strategy',
    color: 'text-cyan-400',
    time: '9 min',
    excerpt:
      'Security is a shared responsibility. Here’s what to ask your vendor and your freelancer.',
    content:
      'Ask for: data minimization, masked samples, scoped secrets, and explicit retention policy. Require a test plan that proves no data leakage (negative tests). Keep logs for audits; review models quarterly.',
    image: 'https://placehold.co/800x450/082f49/7dd3fc?text=Data+Security',
    tags: ['Security', 'Cloud'],
  },
]

const FILTERS = ['All', 'Freelancer Guide', 'Client Strategy', 'Analytics', 'Industry News', 'Case Study'] as const
type Filter = typeof FILTERS[number]

function classNames(...args: Array<string | false | null | undefined>) {
  return args.filter(Boolean).join(' ')
}

const SectionTitle = ({ eyebrow, title, desc }: { eyebrow?: string; title: string; desc?: string }) => (
  <div className="mx-auto max-w-3xl text-center mb-10">
    {eyebrow && <p className="text-xs tracking-[0.25em] uppercase text-sky-400/80">{eyebrow}</p>}
    <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-slate-100">{title}</h2>
    {desc && <p className="mt-4 text-slate-400">{desc}</p>}
  </div>
)

const StatCard = ({ value, label, icon }: Stat) => (
  <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 shadow-[0_0_0_1px_rgba(8,145,178,0.05)] hover:shadow-cyan-500/10 transition">
    <div className="text-3xl mb-3">{icon}</div>
    <p className="text-3xl font-black tracking-tight text-cyan-400">{value}</p>
    <p className="mt-2 text-sm text-slate-400">{label}</p>
  </div>
)

const FeaturedArticle = ({
  article,
  expanded,
  onToggle,
}: {
  article: Article
  expanded: boolean
  onToggle: () => void
}) => {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/50 overflow-hidden shadow-2xl shadow-black/40">
      <div className="grid md:grid-cols-2">
        <div className="relative">
          <img
            src={article.image}
            alt={article.title}
            className="h-full w-full object-cover"
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement
              img.onerror = null
              img.src = 'https://placehold.co/960x540/0f172a/93c5fd?text=AI+Workforce+Redefined'
            }}
          />
          {article.tags?.length ? (
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {article.tags.map((t) => (
                <span key={t} className="px-2 py-1 rounded-full bg-cyan-500/15 text-cyan-300 text-xs border border-cyan-500/20">
                  {t}
                </span>
              ))}
            </div>
          ) : null}
        </div>
        <div className="p-8 md:p-12">
          <p className={classNames('text-xs font-semibold uppercase tracking-wider', article.color)}>{article.category}</p>
          <h3 className="mt-2 text-3xl md:text-4xl font-extrabold text-slate-50">{article.title}</h3>
          <p className="mt-4 text-slate-400">{article.excerpt}</p>
          <div className="mt-6 text-slate-300">
            <p className={classNames('inline-flex items-center gap-2 text-sm rounded-full px-3 py-1 border', article.color, 'border-slate-700')}>
              ⏱ {article.time} read
            </p>
          </div>

          <div className={classNames('mt-6 overflow-hidden transition-all', expanded ? 'max-h-[480px]' : 'max-h-0')}>
            <div className="prose prose-invert max-w-none text-slate-300">
              <p>{article.content}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={onToggle}
              className="px-5 py-2 rounded-xl bg-cyan-600 text-white font-semibold shadow-lg shadow-cyan-900/30 hover:bg-cyan-500 transition"
            >
              {expanded ? 'Show less' : 'Read the full story'}
            </button>
            <Link
              href="/browse"
              className="px-5 py-2 rounded-xl border border-slate-700 text-slate-200 font-semibold hover:border-slate-600 hover:bg-slate-800/40 transition"
            >
              Explore AI Services
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

const PostCard = ({
  article,
  expanded,
  onToggle,
}: {
  article: Article
  expanded: boolean
  onToggle: () => void
}) => {
  return (
    <div className="group rounded-2xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900/70 transition p-5 shadow-[0_0_0_1px_rgba(59,130,246,0.08)]">
      {article.image ? (
        <div className="overflow-hidden rounded-xl mb-4">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-44 object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
        </div>
      ) : null}
      <p className={classNames('text-[11px] font-bold uppercase tracking-widest', article.color)}>{article.category}</p>
      <h3 className="mt-1 text-xl font-bold text-slate-100 group-hover:text-cyan-300 transition">{article.title}</h3>
      <p className="mt-2 text-slate-400">{article.excerpt}</p>

      <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
        <span className="inline-flex items-center gap-2">⏱ {article.time}</span>
        <button
          onClick={onToggle}
          className="text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center gap-1"
        >
          {expanded ? (
            <>
              Show less <span className="translate-y-[1px]">↑</span>
            </>
          ) : (
            <>
              Read <span className="translate-y-[1px]">→</span>
            </>
          )}
        </button>
      </div>

      <div className={classNames('overflow-hidden transition-all', expanded ? 'max-h-[420px] mt-4' : 'max-h-0')}>
        <div className="prose prose-invert max-w-none text-slate-300">
          <p>{article.content}</p>
        </div>
        <div className="mt-5 flex gap-3">
          <Link
            href="/browse"
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-500 transition"
          >
            Find a Freelancer
          </Link>
          <Link
            href="/seller/gigs/new"
            className="px-4 py-2 rounded-lg border border-slate-700 text-slate-200 font-semibold hover:bg-slate-800/60 transition"
          >
            Start Selling
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function BlogPage() {
  const [featuredOpen, setFeaturedOpen] = useState(true)
  const [filter, setFilter] = useState<Filter>('All')
  const [query, setQuery] = useState('')
  const [expandedPost, setExpandedPost] = useState<number | null>(null)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState<null | 'ok' | 'err'>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return ALL_POSTS.filter((p) => {
      const inFilter = filter === 'All' || p.category === filter
      if (!inFilter) return false
      if (!q) return true
      return (
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(q))
      )
    })
  }, [filter, query])

function handleSubscribe(e: React.FormEvent) {
  e.preventDefault()
  setSubscribed(null)

  const emailTrim = email.trim()
  if (!emailTrim || !/^\S+@\S+\.\S+$/.test(emailTrim)) {
    setSubscribed('err')
    return
  }

  fetch('/api/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: emailTrim, source: 'blog' }),
  })
    .then(async (r) => {
      const data = await r.json().catch(() => ({}))
      if (!r.ok || data?.ok === false) throw new Error(data?.error || 'Subscribe failed')
      setSubscribed('ok')
      setEmail('')
    })
    .catch((err) => {
      console.error(err)
      setSubscribed('err')
    })
    .finally(() => {
      setTimeout(() => setSubscribed(null), 4000)
    })
}

  return (
    <div className="bg-[#030712] text-slate-200 min-h-screen font-inter">
      {/* Global visual helpers */}
      <style jsx global>{`
        html, body {
          background-color: #030712;
          scroll-behavior: smooth;
        }
        @keyframes pulse-slow { 0%, 100% { opacity: .35 } 50% { opacity: .6 } }
        .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }
        .glass {
          background: linear-gradient(180deg, rgba(2,6,23,0.7), rgba(2,6,23,0.5));
          backdrop-filter: blur(12px);
        }
      `}</style>

      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-24 -left-24 w-[28rem] h-[28rem] rounded-full bg-cyan-900/25 blur-[120px] animate-pulse-slow" />
          <div className="absolute -bottom-24 -right-24 w-[28rem] h-[28rem] rounded-full bg-indigo-900/25 blur-[120px] animate-pulse-slow" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 pt-20 md:pt-28 pb-16 md:pb-24 text-center">
          <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-[11px] tracking-widest uppercase">
            The AI Services Journal
          </p>
          <h1 className="mt-4 text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400">
            Insights, playbooks, and case studies for AI freelancers and buyers
          </h1>
          <p className="mt-5 text-slate-400 max-w-3xl mx-auto">
            Learn what works in the AI economy—productized gigs, reproducible delivery, ethical guardrails, and clear ROI.
            Everything on one page, no tabs, no rabbit holes.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link
              href="/browse"
              className="px-6 py-3 rounded-xl bg-cyan-600 text-white font-semibold shadow-lg shadow-cyan-900/30 hover:bg-cyan-500 transition"
            >
              Explore AI Gigs
            </Link>
            <Link
              href="/seller/gigs/new"
              className="px-6 py-3 rounded-xl border border-slate-700 text-slate-200 font-semibold hover:bg-slate-800/50 transition"
            >
              Become a Seller
            </Link>
          </div>
        </div>

        {/* Sticky subnav */}
        <div className="sticky top-0 z-40 glass border-t border-b border-slate-800">
          <div className="max-w-6xl mx-auto px-6 py-3 flex flex-wrap items-center gap-3">
            <nav className="flex flex-wrap gap-2 text-sm">
              <a href="#insights" className="px-3 py-1.5 rounded-lg hover:bg-slate-800/60 border border-slate-700/60">Insights</a>
              <a href="#featured" className="px-3 py-1.5 rounded-lg hover:bg-slate-800/60 border border-slate-700/60">Featured</a>
              <a href="#articles" className="px-3 py-1.5 rounded-lg hover:bg-slate-800/60 border border-slate-700/60">Articles</a>
              <a href="#subscribe" className="px-3 py-1.5 rounded-lg hover:bg-slate-800/60 border border-slate-700/60">Subscribe</a>
            </nav>
            <div className="ml-auto flex items-center gap-2">
              <div className="relative">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search topics..."
                  className="pl-9 pr-3 py-1.5 rounded-lg bg-slate-900/70 border border-slate-700 text-sm outline-none focus:ring-2 focus:ring-cyan-600/30"
                />
                <span className="absolute left-2 top-1.5 text-slate-500">🔎</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <section id="insights" className="py-14 md:py-20 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6">
          <SectionTitle title="The State of AI Services" desc="Signals that matter for buyers and freelancers." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {AI_STATS.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured story (inline reading, no new page) */}
      <section id="featured" className="py-14 md:py-20 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6">
          <SectionTitle eyebrow="Featured" title="The Great Skill Shift" desc="Why AI freelancers are winning on speed, clarity, and ROI." />
          <FeaturedArticle
            article={FEATURED}
            expanded={featuredOpen}
            onToggle={() => setFeaturedOpen((v) => !v)}
          />
        </div>
      </section>

      {/* Filters + Articles (inline expand) */}
      <section id="articles" className="py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <SectionTitle title="Latest Articles" desc="Everything on one page. Click any card to read inline." />

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {FILTERS.map((f) => {
              const active = f === filter
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={classNames(
                    'px-3 py-1.5 rounded-full border text-sm transition',
                    active
                      ? 'border-cyan-600 bg-cyan-600/15 text-cyan-300'
                      : 'border-slate-700 hover:bg-slate-800/50 text-slate-300'
                  )}
                >
                  {f}
                </button>
              )
            })}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post) => (
              <PostCard
                key={post.id}
                article={post}
                expanded={expandedPost === post.id}
                onToggle={() => setExpandedPost((id) => (id === post.id ? null : post.id))}
              />
            ))}
          </div>

          {/* CTA row */}
          <div className="mt-12 flex flex-wrap gap-3">
            <Link
              href="/browse"
              className="px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow-lg hover:bg-indigo-500 transition"
            >
              Browse AI Services
            </Link>
            <Link
              href="/seller/gigs/new"
              className="px-5 py-3 rounded-xl border border-slate-700 text-slate-200 font-semibold hover:bg-slate-800/60 transition"
            >
              Publish a Gig
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section id="subscribe" className="py-16 md:py-24 border-t border-slate-800 bg-slate-950/40">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <SectionTitle
            eyebrow="Newsletter"
            title="Don’t miss the next wave of AI"
            desc="Join thousands of builders and buyers. One concise email each week."
          />
          <form onSubmit={handleSubscribe} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 px-5 py-4 rounded-xl bg-slate-900/60 border border-slate-700 outline-none focus:ring-2 focus:ring-cyan-600/30"
            />
            <button
              type="submit"
              className="px-6 py-4 rounded-xl bg-cyan-600 text-white font-semibold shadow-lg shadow-cyan-900/30 hover:bg-cyan-500 transition"
            >
              Subscribe
            </button>
          </form>

          {subscribed === 'ok' && (
            <p className="mt-4 text-cyan-300">Thanks! We will keep you posted.</p>
          )}
          {subscribed === 'err' && (
            <p className="mt-4 text-rose-300">Please enter a valid email.</p>
          )}

          <p className="mt-6 text-xs text-slate-500">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* Footer CTAs to product */}
      <footer className="py-12 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40">
              <h4 className="text-xl font-bold text-slate-100">Hire AI Experts</h4>
              <p className="mt-2 text-slate-400">Chatbots, RAG, automations, analytics—fixed scope, clear outcomes.</p>
              <Link href="/browse" className="mt-4 inline-block text-cyan-300 hover:text-cyan-200 font-semibold">
                Explore gigs →
              </Link>
            </div>
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40">
              <h4 className="text-xl font-bold text-slate-100">Sell Your AI Services</h4>
              <p className="mt-2 text-slate-400">Reach AI-interested buyers. Productize your expertise with confidence.</p>
              <Link href="/seller/gigs/new" className="mt-4 inline-block text-indigo-300 hover:text-indigo-200 font-semibold">
                Create a gig →
              </Link>
            </div>
          </div>
          <p className="mt-8 text-center text-slate-500 text-sm">© {new Date().getFullYear()} Humanaira — The AI Services Marketplace</p>
        </div>
      </footer>
    </div>
  )
}