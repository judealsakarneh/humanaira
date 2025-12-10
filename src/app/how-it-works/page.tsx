'use client'

import React, { useState, useRef } from 'react'
import Link from 'next/link'

type Step = {
  number: string
  title: string
  description: string
  details: string[]
  icon: string
}

const STEPS_FOR_BUYERS: Step[] = [
  {
    number: '01',
    title: 'Browse AI Services',
    description: 'Explore our marketplace of vetted AI freelancers and pre-packaged services.',
    details: [
      'Search by category: ChatGPT integrations, RAG systems, ML models, automation',
      'Review seller portfolios, ratings, and delivery history',
      'Compare packages with clear pricing and timelines',
    ],
    icon: '🔍',
  },
  {
    number: '02',
    title: 'Select & Purchase',
    description: 'Choose the service that fits your needs and budget.',
    details: [
      'Select from Basic, Standard, or Premium tiers',
      'Add optional add-ons for extended features',
      'Secure payment with buyer protection',
    ],
    icon: '🛒',
  },
  {
    number: '03',
    title: 'Collaborate & Track',
    description: 'Work directly with your freelancer through our platform.',
    details: [
      'Real-time messaging and file sharing',
      'Milestone-based progress tracking',
      'Request revisions within package terms',
    ],
    icon: '💬',
  },
  {
    number: '04',
    title: 'Receive & Review',
    description: 'Get your deliverables and provide feedback.',
    details: [
      'Download source code, models, and documentation',
      'Test and validate against requirements',
      'Leave a review to help the community',
    ],
    icon: '✅',
  },
]

const STEPS_FOR_SELLERS: Step[] = [
  {
    number: '01',
    title: 'Create Your Profile',
    description: 'Showcase your AI expertise and build credibility.',
    details: [
      'Upload portfolio projects and case studies',
      'Highlight technical skills and certifications',
      'Set your bio and hourly rate baseline',
    ],
    icon: '👤',
  },
  {
    number: '02',
    title: 'List Your Services',
    description: 'Package your skills into clear, purchasable gigs.',
    details: [
      'Define 3 tiers with specific deliverables',
      'Set delivery times and revision policies',
      'Add images, demos, or sample outputs',
    ],
    icon: '📦',
  },
  {
    number: '03',
    title: 'Receive Orders',
    description: 'Get notified when buyers purchase your services.',
    details: [
      'Review order requirements and timeline',
      'Communicate with buyer to clarify scope',
      'Start work with milestone tracking',
    ],
    icon: '🔔',
  },
  {
    number: '04',
    title: 'Deliver & Earn',
    description: 'Submit your work and get paid securely.',
    details: [
      'Upload final deliverables through platform',
      'Request buyer approval or revisions',
      'Receive payment to your connected account',
    ],
    icon: '💰',
  },
]

const FAQ_ITEMS = [
  {
    question: 'How long does it take to get started?',
    answer: 'For buyers, you can browse and purchase immediately. For sellers, profile setup takes 10-15 minutes, and gig approval typically happens within 24 hours.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, PayPal, and bank transfers. Payments are held securely until work is delivered and approved.',
  },
  {
    question: 'How do you ensure quality?',
    answer: 'All sellers undergo a vetting process. We review portfolios, verify credentials, and monitor ratings. Buyers have revision rights and can dispute if deliverables don\'t match the gig description.',
  },
  {
    question: 'What fees do you charge?',
    answer: 'Buyers pay the listed price with no hidden fees. Sellers pay a 7% service fee on completed orders, which covers payment processing, platform maintenance, and buyer protection.',
  },
]

function StepCard({ step, index }: { step: Step; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -5
    const rotateY = ((x - centerX) / centerX) * 5

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
  }

  const handleMouseLeave = () => {
    if (!cardRef.current) return
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)'
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="step-card group relative p-8 rounded-3xl border-2 border-[#35BFFF]/20 liquid-bg overflow-hidden transition-all duration-300"
    >
      <div className="shimmer-effect" />
      <div className="step-glow" />
      
      <div className="relative z-10">
        <div className="flex items-start gap-6 mb-6">
          <div className="text-6xl">{step.icon}</div>
          <div className="flex-1">
            <div className="text-5xl font-black text-[#35BFFF]/20 mb-2">{step.number}</div>
            <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
            <p className="text-slate-300 leading-relaxed">{step.description}</p>
          </div>
        </div>
        
        <ul className="space-y-3">
          {step.details.map((detail, i) => (
            <li key={i} className="flex items-start gap-3 text-slate-300">
              <span className="text-[#35BFFF] mt-1">▸</span>
              <span className="leading-relaxed">{detail}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="faq-item relative p-6 rounded-2xl border-2 border-[#35BFFF]/20 liquid-bg overflow-hidden">
      <div className="shimmer-effect" />
      <button
        onClick={() => setOpen(!open)}
        className="relative z-10 w-full flex items-center justify-between gap-4 text-left"
      >
        <h4 className="text-lg font-bold text-white">{question}</h4>
        <span className={`text-2xl text-[#35BFFF] transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
          ↓
        </span>
      </button>
      <div
        className={`relative z-10 overflow-hidden transition-all duration-300 ${open ? 'max-h-96 mt-4' : 'max-h-0'}`}
      >
        <p className="text-slate-300 leading-relaxed">{answer}</p>
      </div>
    </div>
  )
}

export default function HowItWorksPage() {
  const [activeTab, setActiveTab] = useState<'buyers' | 'sellers'>('buyers')

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200">
      {/* Hero Section */}
      <section className="relative overflow-hidden hero-section">
        <div className="hero-bg" />
        <div className="hero-grid" />
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-20 text-center">
          <p className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#35BFFF]/30 bg-[#35BFFF]/10 text-[#35BFFF] text-xs tracking-widest uppercase mb-6">
            Simple. Transparent. Effective.
          </p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
            <span className="bg-gradient-to-r from-[#35BFFF] via-[#60a5fa] to-[#a855f7] bg-clip-text text-transparent">
              How It Works
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Whether you're hiring AI talent or selling your expertise, we've made it straightforward. 
            No mystery, no bureaucracy, just clear steps to get you moving.
          </p>
        </div>
      </section>

      {/* Tab Switcher */}
      <section className="relative max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-center gap-4 mb-16">
          <button
            onClick={() => setActiveTab('buyers')}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
              activeTab === 'buyers'
                ? 'bg-gradient-to-r from-[#35BFFF] to-[#60a5fa] text-white shadow-lg shadow-[#35BFFF]/50'
                : 'border-2 border-[#35BFFF]/30 text-slate-300 hover:border-[#35BFFF]/60'
            }`}
          >
            For Buyers
          </button>
          <button
            onClick={() => setActiveTab('sellers')}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
              activeTab === 'sellers'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                : 'border-2 border-purple-500/30 text-slate-300 hover:border-purple-500/60'
            }`}
          >
            For Sellers
          </button>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {(activeTab === 'buyers' ? STEPS_FOR_BUYERS : STEPS_FOR_SELLERS).map((step, index) => (
            <StepCard key={step.number} step={step} index={index} />
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative max-w-4xl mx-auto px-6 py-20">
        <h2 className="text-4xl md:text-5xl font-black text-center mb-4">
          <span className="bg-gradient-to-r from-[#35BFFF] to-[#a855f7] bg-clip-text text-transparent">
            Frequently Asked Questions
          </span>
        </h2>
        <p className="text-center text-slate-400 mb-12 text-lg">
          Got questions? We've got answers.
        </p>
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, index) => (
            <FAQItem key={index} {...item} index={index} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative max-w-6xl mx-auto px-6 py-20">
        <div className="relative p-16 rounded-3xl border-2 border-[#35BFFF]/30 liquid-bg overflow-hidden text-center">
          <div className="shimmer-effect" />
          <div className="cta-glow" />
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-white">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
              Join thousands of AI professionals and companies building the future of work.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link
                href="/browse"
                className="px-10 py-5 rounded-xl bg-gradient-to-r from-[#35BFFF] to-[#60a5fa] text-white font-bold text-lg shadow-lg shadow-[#35BFFF]/50 hover:shadow-[#35BFFF]/80 transition hover:scale-105"
              >
                Browse AI Services
              </Link>
              <Link
                href="/seller/gigs/new"
                className="px-10 py-5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg shadow-lg shadow-purple-500/50 hover:shadow-purple-500/80 transition hover:scale-105"
              >
                Start Selling
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .hero-section {
          background: radial-gradient(ellipse at top, #1e1b4b 0%, #030712 50%);
        }
        .hero-bg {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(circle at 20% 50%, rgba(53, 191, 255, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.15) 0%, transparent 50%);
        }
        .hero-grid {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(53, 191, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(53, 191, 255, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
          mask-image: radial-gradient(ellipse at center, black 0%, transparent 80%);
        }

        .liquid-bg {
          background: linear-gradient(135deg, 
            rgba(15, 23, 42, 0.95) 0%, 
            rgba(30, 41, 59, 0.9) 25%,
            rgba(53, 191, 255, 0.05) 50%,
            rgba(30, 41, 59, 0.9) 75%,
            rgba(15, 23, 42, 0.95) 100%
          );
          background-size: 200% 200%;
          animation: liquid-flow 8s ease-in-out infinite;
        }

        .shimmer-effect {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(53, 191, 255, 0.1) 50%,
            transparent 100%
          );
          animation: shimmer 3s linear infinite;
          pointer-events: none;
        }

        .step-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .step-card:hover {
          box-shadow: 0 20px 60px rgba(53, 191, 255, 0.3);
          border-color: rgba(53, 191, 255, 0.5);
        }

        .step-glow {
          position: absolute;
          inset: -40px;
          background: radial-gradient(circle, rgba(53, 191, 255, 0.3) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.3s;
          pointer-events: none;
        }
        .step-card:hover .step-glow {
          opacity: 1;
        }

        .cta-glow {
          position: absolute;
          inset: -60px;
          background: radial-gradient(circle, rgba(53, 191, 255, 0.2) 0%, transparent 70%);
          filter: blur(60px);
        }

        @keyframes liquid-flow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}
