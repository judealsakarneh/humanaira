'use client'
import Link from 'next/link'
import React from 'react';

// Inline SVG Icon for Mail (for Contact section)
const MailIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
);


export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#030712] text-slate-200 font-sans">
      <div className="max-w-4xl mx-auto px-4 py-20 pt-28">
        
        {/* --- Decorative Blur Backgrounds (Subtle, Dark Accent) --- */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-sky-900/30 rounded-full blur-[100px] opacity-20 z-0" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-900/40 rounded-full blur-[120px] opacity-15 z-0" />

        <h1 className="relative z-10 text-5xl font-extrabold text-white mb-10 text-center tracking-tight">
          Privacy Policy
        </h1>
        
        {/* --- Main Content Panel (Sleek Dark Card) --- */}
        <div className="relative z-10 bg-[#0f172a] rounded-3xl shadow-2xl shadow-black/50 border border-[#1e293b] p-8 md:p-12 backdrop-blur-sm">
          
          <div className="space-y-10">
            
            {/* 1. Introduction */}
            <div>
              <h2 className="text-3xl font-bold text-sky-600 mb-4 tracking-tight">1. Introduction</h2>
              <p className="text-slate-400 leading-relaxed">
                Humanaira Ltd is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our platform.
              </p>
            </div>

            {/* 2. Information We Collect */}
            <div>
              <h2 className="text-3xl font-bold text-sky-600 mb-4 tracking-tight">2. Information We Collect</h2>
              <ul className="list-disc pl-6 text-slate-400 space-y-3 leading-relaxed">
                <li>Account information (name, email, etc.)</li>
                <li>Profile details and content you provide</li>
                <li>Usage data and analytics</li>
                <li>Payment and transaction information</li>
              </ul>
            </div>

            {/* 3. How We Use Your Information */}
            <div>
              <h2 className="text-3xl font-bold text-sky-600 mb-4 tracking-tight">3. How We Use Your Information</h2>
              <ul className="list-disc pl-6 text-slate-400 space-y-3 leading-relaxed">
                <li>To provide and improve our services</li>
                <li>To communicate with you about your account or orders</li>
                <li>To ensure platform security and prevent fraud</li>
                <li>To comply with legal obligations</li>
              </ul>
            </div>

            {/* 4. Sharing Your Information */}
            <div>
              <h2 className="text-3xl font-bold text-sky-600 mb-4 tracking-tight">4. Sharing Your Information</h2>
              <ul className="list-disc pl-6 text-slate-400 space-y-3 leading-relaxed">
                <li>We do not sell your personal information.</li>
                <li>We may share information with trusted service providers to operate our platform.</li>
                <li>We may disclose information if required by law or to protect our rights.</li>
              </ul>
            </div>

            {/* 5. Data Security */}
            <div>
              <h2 className="text-3xl font-bold text-sky-600 mb-4 tracking-tight">5. Data Security</h2>
              <p className="text-slate-400 leading-relaxed">
                We use industry-standard security measures to protect your data. However, no method of transmission over the Internet is 100% secure.
              </p>
            </div>

            {/* 6. Your Choices */}
            <div>
              <h2 className="text-3xl font-bold text-sky-600 mb-4 tracking-tight">6. Your Choices</h2>
              <ul className="list-disc pl-6 text-slate-400 space-y-3 leading-relaxed">
                <li>You can update your account information at any time.</li>
                <li>You may request deletion of your account and data.</li>
                <li>You can opt out of marketing communications.</li>
              </ul>
            </div>

            {/* 7. Changes to This Policy */}
            <div>
              <h2 className="text-3xl font-bold text-sky-600 mb-4 tracking-tight">7. Changes to This Policy</h2>
              <p className="text-slate-400 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any significant changes.
              </p>
            </div>
            
            {/* 8. Contact Us */}
            <div>
              <h2 className="text-3xl font-bold text-sky-600 mb-4 tracking-tight">8. Contact Us</h2>
              <p className="text-slate-400 mb-2 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
            </div>
          </div>
          
          {/* Contact Section - Aligned with TermsPage styling */}
          <div className="mt-12 pt-8 border-t border-[#1e293b]">
            <a
              href="mailto:hello@humanaira.com"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-sky-700 text-white font-semibold shadow-lg shadow-sky-900/50 hover:bg-sky-600 transition duration-200 ease-in-out transform hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-sky-500/50"
            >
              <MailIcon className="w-5 h-5" />
              hello@humanaira.com
            </a>
          </div>
        </div>
        
        {/* Footer Link */}
        <div className="mt-12 text-center text-slate-500 text-sm">
          <Link href="/" className="hover:text-sky-500 underline transition duration-200">
            Back to Home
          </Link>
        </div>
      </div>
      
      {/* Global styles for dark theme look (from TermsPage) */}
      <style jsx global>{`
        body {
            background-color: #030712;
            color: #f1f5f9;
            font-family: 'Inter', sans-serif;
        }
        /* Refined Scrollbar Styles */
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-thumb { 
            background: linear-gradient(180deg,#0ea5e9,#38bdf8); 
            border-radius: 4px;
            border: 2px solid #030712; 
        }
        ::-webkit-scrollbar-track { background: #1f2937; }
      `}</style>
    </main>
  );
}
