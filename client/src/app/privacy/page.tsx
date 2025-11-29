'use client'

import Link from 'next/link'
import React from 'react'

const BRAND = '#35BFFF'

// Inline SVG Icon for Mail (for Contact section)
const MailIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24" height="24" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
)

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#030712] text-slate-200 font-sans relative overflow-hidden">
      {/* Brand glow accents */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div
          className="absolute -top-24 -left-28 w-[28rem] h-[28rem] rounded-full blur-[160px]"
          style={{ background: 'rgba(53,191,255,0.22)' }}
        />
        <div
          className="absolute -bottom-32 -right-28 w-[32rem] h-[32rem] rounded-full blur-[170px]"
          style={{ background: 'rgba(53,191,255,0.18)' }}
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 pt-28 pb-16">
        {/* Header */}
        <header className="relative z-10 text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight" style={{ color: BRAND }}>
            Privacy Policy
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </header>

        {/* Quick navigation */}
        <nav
          className="relative z-10 rounded-2xl border bg-slate-900/70 backdrop-blur-sm p-4 md:p-5 mb-8"
          style={{ borderColor: 'rgba(53,191,255,0.25)' }}
          aria-label="Privacy Policy Sections"
        >
          <h2 className="text-sm font-semibold mb-2 text-slate-300">On this page</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <li><a href="#intro" className="underline decoration-transparent hover:decoration-inherit transition" style={{ color: BRAND }}>1. Introduction</a></li>
            <li><a href="#collect" className="underline decoration-transparent hover:decoration-inherit transition" style={{ color: BRAND }}>2. Information We Collect</a></li>
            <li><a href="#use" className="underline decoration-transparent hover:decoration-inherit transition" style={{ color: BRAND }}>3. How We Use Information</a></li>
            <li><a href="#share" className="underline decoration-transparent hover:decoration-inherit transition" style={{ color: BRAND }}>4. Sharing Information</a></li>
            <li><a href="#security" className="underline decoration-transparent hover:decoration-inherit transition" style={{ color: BRAND }}>5. Data Security</a></li>
            <li><a href="#choices" className="underline decoration-transparent hover:decoration-inherit transition" style={{ color: BRAND }}>6. Your Choices</a></li>
            <li><a href="#changes" className="underline decoration-transparent hover:decoration-inherit transition" style={{ color: BRAND }}>7. Changes to this Policy</a></li>
            <li><a href="#contact" className="underline decoration-transparent hover:decoration-inherit transition" style={{ color: BRAND }}>8. Contact Us</a></li>
          </ul>
        </nav>

        {/* Main Content Card */}
        <section
          className="relative z-10 rounded-3xl shadow-2xl p-8 md:p-12 bg-slate-900/80 backdrop-blur-sm border"
          style={{ borderColor: 'rgba(53,191,255,0.35)', boxShadow: '0 24px 64px rgba(3,6,16,0.6)' }}
        >
          <div className="space-y-10">
            {/* 1. Introduction */}
            <div id="intro">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight" style={{ color: BRAND }}>
                1. Introduction
              </h2>
              <p className="text-slate-300 leading-relaxed">
                Humanaira Ltd is committed to protecting your privacy. This Privacy Policy explains how we collect, use,
                and safeguard your information when you use our platform.
              </p>
            </div>

            {/* 2. Information We Collect */}
            <div id="collect">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight" style={{ color: BRAND }}>
                2. Information We Collect
              </h2>
              <ul className="list-disc pl-6 text-slate-300 space-y-3 leading-relaxed">
                <li>Account information (name, email, etc.)</li>
                <li>Profile details and content you provide</li>
                <li>Usage data and analytics</li>
                <li>Payment and transaction information</li>
              </ul>
            </div>

            {/* 3. How We Use Your Information */}
            <div id="use">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight" style={{ color: BRAND }}>
                3. How We Use Your Information
              </h2>
              <ul className="list-disc pl-6 text-slate-300 space-y-3 leading-relaxed">
                <li>To provide and improve our services</li>
                <li>To communicate with you about your account or orders</li>
                <li>To ensure platform security and prevent fraud</li>
                <li>To comply with legal obligations</li>
              </ul>
            </div>

            {/* 4. Sharing Your Information */}
            <div id="share">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight" style={{ color: BRAND }}>
                4. Sharing Your Information
              </h2>
              <ul className="list-disc pl-6 text-slate-300 space-y-3 leading-relaxed">
                <li>We do not sell your personal information.</li>
                <li>We may share information with trusted service providers to operate our platform.</li>
                <li>We may disclose information if required by law or to protect our rights.</li>
              </ul>
            </div>

            {/* 5. Data Security */}
            <div id="security">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight" style={{ color: BRAND }}>
                5. Data Security
              </h2>
              <p className="text-slate-300 leading-relaxed">
                We use industry-standard security measures to protect your data. However, no method of transmission over
                the Internet is 100% secure.
              </p>
            </div>

            {/* 6. Your Choices */}
            <div id="choices">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight" style={{ color: BRAND }}>
                6. Your Choices
              </h2>
              <ul className="list-disc pl-6 text-slate-300 space-y-3 leading-relaxed">
                <li>You can update your account information at any time.</li>
                <li>You may request deletion of your account and data.</li>
                <li>You can opt out of marketing communications.</li>
              </ul>
            </div>

            {/* 7. Changes to This Policy */}
            <div id="changes">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight" style={{ color: BRAND }}>
                7. Changes to This Policy
              </h2>
              <p className="text-slate-300 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any significant changes.
              </p>
            </div>

            {/* 8. Contact Us */}
            <div id="contact">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight" style={{ color: BRAND }}>
                8. Contact Us
              </h2>
              <p className="text-slate-300 mb-4 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <a
                href="mailto:hello@humanaira.com"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition duration-200 ease-in-out hover:scale-[1.01] focus:outline-none"
                style={{
                  background: BRAND,
                  color: '#06121f',
                  boxShadow: '0 12px 26px rgba(53,191,255,0.25)',
                }}
              >
                <MailIcon className="w-5 h-5" />
                hello@humanaira.com
              </a>
            </div>
          </div>
        </section>

        {/* Footer Link */}
        <div className="mt-10 text-center text-slate-500 text-sm">
          <Link
            href="/"
            className="underline decoration-transparent hover:decoration-inherit transition"
            style={{ color: BRAND }}
          >
            Back to Home
          </Link>
        </div>
      </div>

      {/* Global styles for dark theme look */}
      <style jsx global>{`
        body {
          background-color: #030712;
          color: #f1f5f9;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji',
            'Segoe UI Emoji';
        }
        /* Refined Scrollbar Styles */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-thumb {
          background: #35bfff;
          border-radius: 4px;
          border: 2px solid #030712;
        }
        ::-webkit-scrollbar-track {
          background: #1f2937;
        }
      `}</style>
    </main>
  )
}