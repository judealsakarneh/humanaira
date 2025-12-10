'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-[#030712] text-slate-200 font-sans relative overflow-hidden">
      {/* Animated background with purple-blue mix */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-gradient-to-br from-[#35BFFF]/20 to-[#a855f7]/15 rounded-full blur-[160px] animate-float-slow" />
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-gradient-to-br from-[#a855f7]/20 to-[#ec4899]/15 rounded-full blur-[160px] animate-float-medium" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-[#60a5fa]/15 to-[#a855f7]/12 rounded-full blur-[140px] animate-float-fast" />
      </div>

      {/* Grid overlay */}
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(#35BFFF22 1px, transparent 1px), linear-gradient(90deg, #a855f722 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      <HeroSection />
      <SupportCategories />
      <TicketSystemSection />
      <FAQSection />
      <ResourcesSection />
    </main>
  )
}

/* ========== Hero Section ========== */
function HeroSection() {
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 })
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    const glowX = ((e.clientX - rect.left) / rect.width) * 100
    const glowY = ((e.clientY - rect.top) / rect.height) * 100
    setGlowPosition({ x: glowX, y: glowY })
    
    const rotateX = ((y - centerY) / centerY) * -5
    const rotateY = ((x - centerX) / centerX) * 5
    setRotation({ x: rotateX, y: rotateY })
  }

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 })
    setGlowPosition({ x: 50, y: 50 })
  }

  return (
    <section className="relative pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-7xl md:text-8xl font-black mb-6 bg-gradient-to-r from-[#35BFFF] via-[#a855f7] to-[#ec4899] bg-clip-text text-transparent animate-gradient">
            Support Center
          </h1>
          <p className="text-2xl text-slate-400 max-w-3xl mx-auto">
            Get the help you need, when you need it. Our expert team is here 24/7 to assist you.
          </p>
        </div>

        {/* Interactive Support Card */}
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative max-w-4xl mx-auto p-10 rounded-3xl bg-gradient-to-br from-[#0f172a]/95 via-[#1a1f35]/90 to-[#1e293b]/95 border-2 border-[#35BFFF]/30 overflow-hidden group shadow-2xl"
          style={{
            transform: `perspective(1200px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transition: 'transform 0.3s ease-out',
            boxShadow: '0 20px 60px rgba(53,191,255,0.3), inset 0 1px 0 rgba(53,191,255,0.2)'
          }}
        >
          {/* Liquid background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#35BFFF]/10 to-[#a855f7]/10 opacity-50" />
          
          {/* Interactive glow */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `radial-gradient(circle 400px at ${glowPosition.x}% ${glowPosition.y}%, rgba(168,85,247,0.3), transparent 70%)`
            }}
          />

          {/* Shimmer effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
          </div>

          <div className="relative z-10 text-center">
            <div className="text-6xl mb-6 animate-pulse-glow">🎯</div>
            <h2 className="text-3xl font-bold text-white mb-4">How can we help you today?</h2>
            <div className="flex justify-center mt-8">
              <Link href="#ticket" className="px-10 py-5 rounded-xl font-bold bg-gradient-to-r from-[#35BFFF] via-[#60a5fa] to-[#a855f7] text-white hover:scale-105 transition-all duration-300 shadow-lg">
                📩 Submit Support Ticket
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ========== Support Categories ========== */
function SupportCategories() {
  const categories = [
    { 
      icon: '🚀', 
      title: 'Getting Started', 
      desc: 'Account setup, onboarding, and first steps',
      color: '#35BFFF',
      guides: [
        { step: 1, title: 'Create Your Account', desc: 'Sign up with email or social login. Verify your email address to unlock full features.' },
        { step: 2, title: 'Complete Your Profile', desc: 'Add your photo, bio, and skills. A complete profile increases trust by 85%.' },
        { step: 3, title: 'Explore the Platform', desc: 'Browse categories, save favorites, and understand how buyers find services.' },
        { step: 4, title: 'Place Your First Order', desc: 'Start small to understand the process. Read reviews and check seller ratings.' },
      ]
    },
    { 
      icon: '💳', 
      title: 'Payments & Billing', 
      desc: 'Invoices, refunds, payment methods, and transactions',
      color: '#a855f7',
      guides: [
        { step: 1, title: 'Add Payment Method', desc: 'Link your credit card, PayPal, or bank account. All transactions are encrypted with SSL.' },
        { step: 2, title: 'Understanding Invoices', desc: 'View detailed breakdowns of charges, fees, and taxes in your order history.' },
        { step: 3, title: 'Request a Refund', desc: 'If you\'re not satisfied, request a refund within 14 days. Processed in 3-5 business days.' },
        { step: 4, title: 'Withdraw Earnings', desc: 'Sellers can withdraw funds once they reach $50. Choose from multiple withdrawal methods.' },
      ]
    },
    { 
      icon: '🛡️', 
      title: 'Security & Privacy', 
      desc: 'Account security, data protection, and privacy settings',
      color: '#ec4899',
      guides: [
        { step: 1, title: 'Enable Two-Factor Authentication', desc: 'Add an extra layer of security with 2FA. Use authenticator apps for best protection.' },
        { step: 2, title: 'Manage Privacy Settings', desc: 'Control who can see your profile, orders, and activity. Customize your visibility.' },
        { step: 3, title: 'Update Your Password', desc: 'Use strong, unique passwords. Change them regularly and never share with anyone.' },
        { step: 4, title: 'Data Protection Rights', desc: 'Request your data export or deletion. We comply with GDPR and CCPA regulations.' },
      ]
    },
    { 
      icon: '⚙️', 
      title: 'Technical Support', 
      desc: 'Platform issues, bugs, and technical assistance',
      color: '#60a5fa',
      guides: [
        { step: 1, title: 'Report a Bug', desc: 'Found an issue? Submit detailed steps to reproduce. Include screenshots if possible.' },
        { step: 2, title: 'Browser Compatibility', desc: 'We support Chrome, Firefox, Safari, and Edge. Clear cache if experiencing issues.' },
        { step: 3, title: 'Performance Optimization', desc: 'Slow loading? Check your internet connection, disable extensions, or try incognito mode.' },
        { step: 4, title: 'API Access', desc: 'Developers can integrate our API. Documentation and rate limits available in dev portal.' },
      ]
    },
    { 
      icon: '📊', 
      title: 'Seller Support', 
      desc: 'Gig management, analytics, and seller tools',
      color: '#10b981',
      guides: [
        { step: 1, title: 'Create Your First Gig', desc: 'Choose a clear title, add detailed description, set competitive pricing, and upload samples.' },
        { step: 2, title: 'Optimize for Search', desc: 'Use relevant keywords, tags, and categories. High-quality images boost visibility by 60%.' },
        { step: 3, title: 'Track Your Analytics', desc: 'Monitor views, clicks, orders, and revenue. Adjust strategy based on performance data.' },
        { step: 4, title: 'Level Up Your Account', desc: 'Complete orders on time, maintain high ratings, and unlock seller levels for more benefits.' },
      ]
    },
    { 
      icon: '🛒', 
      title: 'Buyer Support', 
      desc: 'Ordering, delivery, and buyer protection',
      color: '#f59e0b',
      guides: [
        { step: 1, title: 'How to Order', desc: 'Browse services, check reviews, read requirements, and click "Order Now" to proceed.' },
        { step: 2, title: 'Track Your Order', desc: 'Monitor progress in real-time. Receive notifications for updates, delivery, and revisions.' },
        { step: 3, title: 'Request Revisions', desc: 'Not satisfied? Request modifications within revision limits. Communicate clearly with seller.' },
        { step: 4, title: 'Leave a Review', desc: 'Share your experience after delivery. Honest reviews help the community make informed decisions.' },
      ]
    },
  ]

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black mb-4 bg-gradient-to-r from-[#a855f7] via-[#ec4899] to-[#35BFFF] bg-clip-text text-transparent">
            Support Categories
          </h2>
          <p className="text-xl text-slate-400">Choose your topic to find step-by-step guidance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <CategoryCard key={idx} {...cat} />
          ))}
        </div>
      </div>
    </section>
  )
}

function CategoryCard({ icon, title, desc, color, guides }: any) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 })
  const [showModal, setShowModal] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    const glowX = ((e.clientX - rect.left) / rect.width) * 100
    const glowY = ((e.clientY - rect.top) / rect.height) * 100
    setGlowPosition({ x: glowX, y: glowY })
    
    const rotateX = ((y - centerY) / centerY) * -8
    const rotateY = ((x - centerX) / centerX) * 8
    setRotation({ x: rotateX, y: rotateY })
  }

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 })
    setGlowPosition({ x: 50, y: 50 })
  }

  const handleNext = () => {
    if (currentStep < guides.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => setShowModal(true)}
        className="relative p-8 rounded-2xl bg-gradient-to-br from-[#0f172a]/95 via-[#1a1f35]/90 to-[#1e293b]/95 border-2 transition-all duration-500 group overflow-hidden cursor-pointer hover:scale-105"
        style={{
          transform: `perspective(1200px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(1)`,
          borderColor: `${color}60`,
          boxShadow: `0 8px 32px ${color}44, inset 0 1px 0 ${color}22`
        }}
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br opacity-20" style={{ background: `linear-gradient(135deg, ${color}40, transparent)` }} />
        
        {/* Interactive glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle 300px at ${glowPosition.x}% ${glowPosition.y}%, ${color}44, transparent 70%)`
          }}
        />

        {/* Shimmer */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
        </div>

        <div className="relative z-10">
          <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">{icon}</div>
          <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
          <p className="text-slate-400 mb-6">{desc}</p>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold" style={{ color: color }}>
              {guides.length} Step Guide
            </span>
            <span className="text-2xl" style={{ color: color }}>→</span>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setShowModal(false)}>
          <div className="relative max-w-2xl w-full p-8 rounded-3xl bg-gradient-to-br from-[#0f172a]/95 via-[#1a1f35]/90 to-[#1e293b]/95 border-2 animate-scale-up" 
            style={{ borderColor: `${color}60`, boxShadow: `0 20px 60px ${color}44` }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white text-2xl flex items-center justify-center transition-colors"
            >
              ×
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{icon}</div>
              <h3 className="text-3xl font-black mb-2 bg-gradient-to-r bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(to right, ${color}, #fff)` }}>
                {title}
              </h3>
              <p className="text-slate-400">{desc}</p>
            </div>

            {/* Progress */}
            <div className="flex justify-center gap-2 mb-8">
              {guides.map((_: any, idx: number) => (
                <div 
                  key={idx} 
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: idx === currentStep ? '40px' : '20px',
                    backgroundColor: idx === currentStep ? color : idx < currentStep ? `${color}80` : '#334155'
                  }}
                />
              ))}
            </div>

            {/* Content */}
            <div className="mb-8 min-h-[200px]">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-2xl flex-shrink-0" style={{ backgroundColor: `${color}30`, color: color }}>
                  {guides[currentStep].step}
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-white mb-3">{guides[currentStep].title}</h4>
                  <p className="text-lg text-slate-300 leading-relaxed">{guides[currentStep].desc}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="px-6 py-3 rounded-xl font-bold border-2 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:enabled:scale-105 transition-all duration-300"
                style={{ borderColor: `${color}60` }}
              >
                ← Previous
              </button>
              
              <span className="text-slate-400 font-semibold">
                Step {currentStep + 1} of {guides.length}
              </span>

              {currentStep < guides.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-3 rounded-xl font-bold text-white hover:scale-105 transition-all duration-300"
                  style={{ backgroundColor: color }}
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 rounded-xl font-bold text-white hover:scale-105 transition-all duration-300"
                  style={{ backgroundColor: color }}
                >
                  Done ✓
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/* ========== Live Chat Section ========== */
function LiveChatSection() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <section id="live-chat" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="relative p-12 rounded-3xl bg-gradient-to-br from-[#0f172a]/95 via-[#1a1f35]/90 to-[#1e293b]/95 border-2 border-[#35BFFF]/40 overflow-hidden shadow-2xl"
          style={{ boxShadow: '0 20px 60px rgba(53,191,255,0.3), inset 0 1px 0 rgba(53,191,255,0.2)' }}
        >
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#35BFFF]/15 to-[#a855f7]/15 opacity-50" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#35BFFF]/20 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#a855f7]/20 rounded-full blur-3xl animate-float-medium" />

          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#35BFFF]/20 border border-[#35BFFF]/50 text-[#35BFFF] font-bold mb-6">
                <span className="w-3 h-3 bg-[#35BFFF] rounded-full mr-2 animate-pulse"></span>
                Available 24/7
              </div>
              <h2 className="text-5xl font-black mb-6 bg-gradient-to-r from-[#35BFFF] to-[#60a5fa] bg-clip-text text-transparent">
                Live Chat Support
              </h2>
              <p className="text-xl text-slate-300 mb-8">
                Connect with our support team instantly. Average response time: <span className="text-[#35BFFF] font-bold">under 2 minutes</span>.
              </p>
              <ul className="space-y-4 mb-8">
                {['Instant responses', 'Expert support team', 'Screen sharing available', 'Multi-language support'].map((item, i) => (
                  <li key={i} className="flex items-center text-slate-300">
                    <span className="text-2xl mr-3">✓</span>
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ul>
              <button
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="px-10 py-5 rounded-xl font-bold bg-gradient-to-r from-[#35BFFF] via-[#60a5fa] to-[#a855f7] text-white hover:scale-105 transition-all duration-300 shadow-lg text-lg"
                style={{ boxShadow: isHovered ? '0 12px 40px rgba(53,191,255,0.5)' : '0 8px 32px rgba(53,191,255,0.4)' }}
              >
                💬 Start Chat Now
              </button>
            </div>

            {/* Chat Preview */}
            <div className="relative">
              <div className="bg-gradient-to-br from-[#0a0f1e]/80 to-[#0f172a]/60 rounded-2xl p-6 border-2 border-[#35BFFF]/30 shadow-xl">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#35BFFF] to-[#60a5fa] flex items-center justify-center text-2xl">
                    🎯
                  </div>
                  <div>
                    <div className="font-bold text-white">Support Agent</div>
                    <div className="text-sm text-[#35BFFF]">Online • Typing...</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#35BFFF] to-[#60a5fa] flex-shrink-0"></div>
                    <div className="bg-[#1e293b]/80 rounded-2xl rounded-tl-none p-4 max-w-[80%]">
                      <p className="text-sm text-slate-300">Hi! How can I help you today?</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 justify-end">
                    <div className="bg-gradient-to-br from-[#35BFFF]/20 to-[#a855f7]/20 border border-[#35BFFF]/40 rounded-2xl rounded-tr-none p-4 max-w-[80%]">
                      <p className="text-sm text-white">I need help with my order</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#a855f7] to-[#ec4899] flex-shrink-0"></div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#35BFFF] to-[#60a5fa] flex-shrink-0"></div>
                    <div className="bg-[#1e293b]/80 rounded-2xl rounded-tl-none p-4 max-w-[80%]">
                      <p className="text-sm text-slate-300">I'd be happy to help! What's your order ID?</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-700">
                  <div className="flex items-center gap-2 px-4 py-3 bg-[#0a0f1e]/60 rounded-xl border border-slate-700">
                    <input type="text" placeholder="Type your message..." className="flex-1 bg-transparent text-white outline-none text-sm" />
                    <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#35BFFF] to-[#60a5fa] text-white font-semibold text-sm">
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ========== Ticket System Section ========== */
function TicketSystemSection() {
  return (
    <section id="ticket" className="py-20 px-6 bg-gradient-to-b from-transparent to-[#0a0f1e]/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black mb-4 bg-gradient-to-r from-[#a855f7] via-[#ec4899] to-[#35BFFF] bg-clip-text text-transparent">
            Submit a Support Ticket
          </h2>
          <p className="text-xl text-slate-400">For detailed issues, create a ticket and track your request</p>
        </div>

        <TicketForm />
      </div>
    </section>
  )
}

function TicketForm() {
  const [formData, setFormData] = useState({
    category: '',
    priority: '',
    subject: '',
    description: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
    setTimeout(() => setIsSubmitted(false), 3000)
  }

  return (
    <div className="relative p-10 rounded-3xl bg-gradient-to-br from-[#0f172a]/95 via-[#1a1f35]/90 to-[#1e293b]/95 border-2 border-[#a855f7]/30 overflow-hidden shadow-2xl"
      style={{ boxShadow: '0 20px 60px rgba(168,85,247,0.3), inset 0 1px 0 rgba(168,85,247,0.2)' }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#a855f7]/10 to-[#ec4899]/10 opacity-50" />

      <div className="relative z-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Category</label>
              <select 
                className="w-full px-5 py-4 rounded-xl bg-[#0a0f1e]/60 border-2 border-slate-700/60 focus:border-[#a855f7]/70 text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#a855f7]/30"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="">Select a category</option>
                <option value="billing">Payments & Billing</option>
                <option value="technical">Technical Support</option>
                <option value="account">Account Issues</option>
                <option value="seller">Seller Support</option>
                <option value="buyer">Buyer Support</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Priority</label>
              <select 
                className="w-full px-5 py-4 rounded-xl bg-[#0a0f1e]/60 border-2 border-slate-700/60 focus:border-[#a855f7]/70 text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#a855f7]/30"
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
              >
                <option value="">Select priority</option>
                <option value="low">🟢 Low - General question</option>
                <option value="medium">🟡 Medium - Issue affecting usage</option>
                <option value="high">🟠 High - Urgent issue</option>
                <option value="critical">🔴 Critical - Service down</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Subject</label>
            <input
              type="text"
              placeholder="Brief description of your issue"
              className="w-full px-5 py-4 rounded-xl bg-[#0a0f1e]/60 border-2 border-slate-700/60 focus:border-[#a855f7]/70 text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#a855f7]/30"
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Description</label>
            <textarea
              rows={6}
              placeholder="Please provide detailed information about your issue..."
              className="w-full px-5 py-4 rounded-xl bg-[#0a0f1e]/60 border-2 border-slate-700/60 focus:border-[#a855f7]/70 text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#a855f7]/30 resize-none"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="text-sm text-slate-400">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#a855f7]/20 text-[#a855f7] font-semibold border border-[#a855f7]/30">
                ⏱️ Response time: 2-4 hours
              </span>
            </div>
            <button
              type="submit"
              className="px-10 py-4 rounded-xl font-bold bg-gradient-to-r from-[#a855f7] via-[#ec4899] to-[#f97316] text-white hover:scale-105 transition-all duration-300 shadow-lg"
              style={{ boxShadow: '0 8px 32px rgba(168,85,247,0.4)' }}
            >
              ✨ Submit Ticket
            </button>
          </div>
        </form>

        {isSubmitted && (
          <div className="mt-6 p-6 rounded-xl bg-gradient-to-r from-emerald-500/20 to-green-500/10 border-2 border-emerald-500/50">
            <div className="flex items-center gap-3">
              <span className="text-4xl">✓</span>
              <div>
                <div className="font-bold text-emerald-300 text-lg">Ticket Submitted Successfully!</div>
                <div className="text-sm text-slate-300 mt-1">Ticket ID: #SUP-{Math.floor(Math.random() * 10000)} • We'll get back to you soon.</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ========== FAQ Section ========== */
function FAQSection() {
  const faqs = [
    {
      q: "How quickly will I get a response?",
      a: "Live chat responses are typically under 2 minutes. Email support tickets are answered within 2-4 hours. Critical issues are prioritized and addressed immediately."
    },
    {
      q: "Is support available 24/7?",
      a: "Yes! Our support team works around the clock to ensure you always have someone to help, regardless of your timezone."
    },
    {
      q: "Can I escalate my ticket?",
      a: "Absolutely. If you feel your issue needs urgent attention, you can mark it as high priority or contact us via live chat for immediate escalation."
    },
    {
      q: "What languages do you support?",
      a: "We offer support in English, Spanish, French, German, Arabic, and 15+ other languages. Select your preferred language in the chat widget."
    },
    {
      q: "How do I track my ticket?",
      a: "After submitting a ticket, you'll receive a tracking ID via email. You can check the status anytime in your account dashboard under 'Support Tickets'."
    },
    {
      q: "What if I have a billing dispute?",
      a: "Contact our billing team directly via live chat or submit a ticket under 'Payments & Billing'. We have a dedicated team for financial matters."
    },
  ]

  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black mb-4 bg-gradient-to-r from-[#35BFFF] via-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-slate-400">Quick answers to common questions</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <FAQItem key={idx} question={faq.q} answer={faq.a} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative p-6 rounded-2xl bg-gradient-to-br from-[#0f172a]/95 via-[#1a1f35]/90 to-[#1e293b]/95 border-2 border-slate-700/50 hover:border-[#35BFFF]/50 transition-all duration-300 overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-[#35BFFF]/5 to-[#a855f7]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-10 w-full flex items-center justify-between text-left"
      >
        <h3 className="text-lg font-bold text-white pr-4">{question}</h3>
        <div className={`text-3xl transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} text-[#35BFFF]`}>
          ⌄
        </div>
      </button>
      
      {isOpen && (
        <div className="relative z-10 mt-4 pt-4 border-t border-slate-700/50">
          <p className="text-slate-300 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  )
}

/* ========== Resources Section ========== */
function ResourcesSection() {
  const resources = [
    { icon: '📚', title: 'Documentation', desc: 'Comprehensive guides and tutorials', link: '/help' },
    { icon: '💡', title: 'Knowledge Base', desc: 'Searchable help articles', link: '/help' },
    { icon: '👥', title: 'Community Forum', desc: 'Connect with other users', link: '/community' },
  ]

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black mb-4 bg-gradient-to-r from-[#ec4899] via-[#a855f7] to-[#35BFFF] bg-clip-text text-transparent">
            Self-Service Resources
          </h2>
          <p className="text-xl text-slate-400">Find answers instantly in our resource library</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resources.map((resource, idx) => (
            <Link
              key={idx}
              href={resource.link}
              className="relative p-8 rounded-2xl bg-gradient-to-br from-[#0f172a]/95 via-[#1a1f35]/90 to-[#1e293b]/95 border-2 border-slate-700/50 hover:border-[#a855f7]/70 transition-all duration-300 group overflow-hidden hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#a855f7]/10 to-[#ec4899]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10 text-center">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">{resource.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{resource.title}</h3>
                <p className="text-sm text-slate-400">{resource.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ========== Emergency Support ========== */
function EmergencySupport() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="relative p-12 rounded-3xl bg-gradient-to-br from-[#dc2626]/10 to-[#f97316]/10 border-2 border-[#dc2626]/50 overflow-hidden shadow-2xl"
          style={{ boxShadow: '0 20px 60px rgba(220,38,38,0.3), inset 0 1px 0 rgba(220,38,38,0.2)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#dc2626]/5 to-[#f97316]/5" />
          
          <div className="relative z-10 text-center">
            <div className="text-7xl mb-6 animate-pulse">🚨</div>
            <h2 className="text-4xl font-black mb-4 text-white">Emergency Support</h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Experiencing a critical issue? Account compromised or service completely down?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:+1234567890" className="px-10 py-5 rounded-xl font-bold bg-gradient-to-r from-[#dc2626] to-[#f97316] text-white hover:scale-105 transition-all duration-300 shadow-lg text-lg">
                📞 Call Emergency Line
              </a>
              <button className="px-10 py-5 rounded-xl font-bold border-2 border-[#dc2626] text-white hover:bg-[#dc2626]/20 transition-all duration-300 text-lg">
                ⚡ Priority Escalation
              </button>
            </div>
            <p className="text-sm text-slate-400 mt-6">Available 24/7 • Average wait time: &lt;30 seconds</p>
          </div>
        </div>
      </div>
    </section>
  )
}
