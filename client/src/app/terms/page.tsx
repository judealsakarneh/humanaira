'use client'
import React from 'react';

export default function TermsPage() {
  // We use standard <a> tags instead of Next.js <Link> for single-file compatibility
  return (
    <main className="min-h-screen bg-[#030712] text-slate-200 font-sans">
      <div className="max-w-4xl mx-auto px-4 py-20 pt-28">
        {/* --- Decorative Blur Backgrounds (Subtle, Dark Accent) --- */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-sky-900/30 rounded-full blur-[100px] opacity-20 z-0" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-900/40 rounded-full blur-[120px] opacity-15 z-0" />
        
        <h1 className="relative z-10 text-5xl font-extrabold text-white mb-10 text-center tracking-tight">
          Terms of Service
        </h1>
        
        {/* --- Main Content Panel (Sleek Dark Card) --- */}
        <div className="relative z-10 bg-[#0f172a] rounded-3xl shadow-2xl shadow-black/50 border border-[#1e293b] p-8 md:p-12 backdrop-blur-sm">
          
          <div className="space-y-10">
            {/* 1. Acceptance of Terms */}
            <div>
              <h2 className="text-3xl font-bold text-sky-600 mb-4 tracking-tight">1. Acceptance of Terms</h2>
              <p className="text-slate-400 leading-relaxed">
                By accessing or using Humanaira Ltd, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to all terms, you must not use our platform or services.
              </p>
            </div>

            {/* 2. User Accounts */}
            <div>
              <h2 className="text-3xl font-bold text-sky-600 mb-4 tracking-tight">2. User Accounts</h2>
              <ul className="list-disc pl-6 text-slate-400 space-y-3 leading-relaxed">
                <li>You must provide accurate and complete information when registering an account.</li>
                <li>You are solely responsible for maintaining the confidentiality of your credentials.</li>
                <li>You are responsible for all activities that occur under your account.</li>
                <li>Accounts are non-transferable and may be suspended or terminated for violations.</li>
              </ul>
            </div>

            {/* 3. Use of Services */}
            <div>
              <h2 className="text-3xl font-bold text-sky-600 mb-4 tracking-tight">3. Prohibited Use</h2>
              <ul className="list-disc pl-6 text-slate-400 space-y-3 leading-relaxed">
                <li>You must not use Humanaira Ltd for any unlawful or malicious purpose, including fraud, harassment, or distribution of illegal content.</li>
                <li>Any attempt to reverse-engineer, exploit, or disrupt the platform's integrity or security is strictly prohibited.</li>
                <li>You agree not to infringe upon the rights of others, including intellectual property and privacy rights.</li>
              </ul>
            </div>

            {/* 4. Payments & Refunds */}
            <div>
              <h2 className="text-3xl font-bold text-sky-600 mb-4 tracking-tight">4. Billing and Refunds</h2>
              <ul className="list-disc pl-6 text-slate-400 space-y-3 leading-relaxed">
                <li>All service payments are processed securely through third-party providers.</li>
                <li>Prices are subject to change upon notice. You are responsible for all applicable taxes.</li>
                <li>Refunds are granted according to our specific Money-Back Guarantee Policy, available upon request.</li>
              </ul>
            </div>

            {/* 5. Intellectual Property */}
            <div>
              <h2 className="text-3xl font-bold text-sky-600 mb-4 tracking-tight">5. Intellectual Property and Licensing</h2>
              <ul className="list-disc pl-6 text-slate-400 space-y-3 leading-relaxed">
                <li>All code, graphics, and content on Humanaira Ltd are the exclusive property of Humanaira Ltd and protected by global copyright laws.</li>
                <li>Users retain ownership of the content they submit, but grant Humanaira Ltd a non-exclusive license to use, host, and display that content for service provision.</li>
              </ul>
            </div>
            
            {/* 6. Disclaimer of Warranties */}
            <div>
              <h2 className="text-3xl font-bold text-sky-600 mb-4 tracking-tight">6. Disclaimer of Warranties</h2>
              <p className="text-slate-400 leading-relaxed">
                Humanaira Ltd provides its services "as is" and "as available," without any warranties of any kind, either express or implied, including, but not limited to, fitness for a particular purpose or non-infringement. We do not warrant that the service will be uninterrupted, error-free, or completely secure.
              </p>
            </div>
          </div>
          
          {/* Contact Section */}
          <div className="mt-12 pt-8 border-t border-[#1e293b]">
            <h2 className="text-2xl font-bold text-white mb-3">Questions & Contact</h2>
            <p className="text-slate-400 mb-4">
              If you have any concerns or need clarification regarding these Terms of Service, please reach out to our legal team.
            </p>
            <a
              href="mailto:hello@humanaira.com"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-sky-700 text-white font-semibold shadow-lg shadow-sky-900/50 hover:bg-sky-600 transition duration-200 ease-in-out transform hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-sky-500/50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24"><path fill="currentColor" d="M12 12.713l-11.413-8.713h22.826l-11.413 8.713zm0 2.587l-12-9.281v14.499h24v-14.499l-12 9.281z"/></svg>
              hello@humanaira.com
            </a>
          </div>
        </div>
        
        {/* Footer Link */}
        <div className="mt-12 text-center text-slate-500 text-sm">
          <a href="/" className="hover:text-sky-500 underline transition duration-200">Back to the Marketplace</a>
        </div>
      </div>
      
      {/* Global styles for dark theme look */}
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
