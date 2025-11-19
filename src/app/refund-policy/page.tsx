'use client'
import React from 'react';
// Note: Using standard <a> tag instead of Link for component simplicity
// const Link = (props: any) => <a {...props}>{props.children}</a>;

// Inline SVG Icon for Payment/Money
const CurrencyIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-2m-2 0H8M12 16V8m-4 8h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2z"/></svg>
);


export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-[#030712] text-slate-200 font-sans">
      <div className="max-w-4xl mx-auto px-4 py-20 pt-28">
        
        {/* --- Decorative Blur Backgrounds --- */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-fuchsia-900/30 rounded-full blur-[100px] opacity-20 z-0" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-fuchsia-900/40 rounded-full blur-[120px] opacity-15 z-0" />

        <h1 className="relative z-10 text-5xl font-extrabold text-white mb-10 text-center tracking-tight">
          Refund Policy
        </h1>
        
        {/* --- Main Content Panel (Sleek Dark Card) --- */}
        <div className="relative z-10 bg-[#0f172a] rounded-3xl shadow-2xl shadow-black/50 border border-[#1e293b] p-8 md:p-12 backdrop-blur-sm">
          
          <div className="space-y-10">
            
            {/* 1. General Policy and Commitment */}
            <div>
              <h2 className="text-3xl font-bold text-sky-600 mb-4 tracking-tight">1. Our Commitment</h2>
              <p className="text-slate-400 leading-relaxed">
                At **Humanaira.com**, we strive for 100% client satisfaction with our freelance digital services, including design, development, and consulting. This policy outlines the terms under which refunds may be issued for services purchased through our platform.
              </p>
            </div>

            {/* 2. Refund Eligibility for Services */}
            <div>
              <h2 className="text-3xl font-bold text-sky-600 mb-4 tracking-tight">2. Eligibility & Service Types</h2>
              <ul className="list-disc pl-6 text-slate-400 space-y-3 leading-relaxed">
                <li>
                  <span className="font-semibold text-white">Project-Based Work (e.g., Websites, Apps):</span> A full refund may be provided if the project is canceled *before* any initial work or discovery phase has begun. Once work starts, refunds are calculated on a pro-rata basis, deducting the value of completed milestones or hours worked, as agreed upon in the initial Statement of Work (SOW).
                </li>
                <li>
                  <span className="font-semibold text-white">Consultation Services:</span> Refunds are only granted if the session is canceled with a minimum of **48 hours notice**. No refunds will be provided for missed appointments or cancellations made less than 48 hours in advance.
                </li>
                <li>
                  <span className="font-semibold text-white">Failure to Deliver:</span> If Humanaira.com fails to complete the service as defined in the SOW, you may be eligible for a full or partial refund of the undelivered portion.
                </li>
              </ul>
            </div>

            {/* 3. Non-Refundable Items */}
            <div>
              <h2 className="text-3xl font-bold text-sky-600 mb-4 tracking-tight">3. Non-Refundable Conditions</h2>
              <ul className="list-disc pl-6 text-slate-400 space-y-3 leading-relaxed">
                <li>**Third-Party Costs:** Fees paid to external providers (e.g., domain registration, stock image licenses, software subscriptions) are non-refundable.</li>
                <li>**Completed Milestones:** Any project milestone that has been signed off and approved by the client is considered complete and is non-refundable.</li>
                <li>**Change of Mind:** Refunds are not issued based on a change of business direction or client preference after the work has been delivered according to the agreed-upon specifications.</li>
              </ul>
            </div>

            {/* 4. The Refund Process (Stripe Specific) */}
            <div>
              <h2 className="text-3xl font-bold text-sky-600 mb-4 tracking-tight">4. Refund Submission and Processing</h2>
              <ol className="list-decimal pl-6 text-slate-400 space-y-3 leading-relaxed">
                <li>**Submit Request:** All refund requests must be submitted via email to the contact address below, clearly stating the reason for the request and providing relevant invoice numbers.</li>
                <li>**Review:** Humanaira.com will review the request within **5 business days** of receipt.</li>
                <li>**Stripe Processing:** If approved, the refund will be processed immediately via **Stripe** back to the original method of payment.</li>
                <li>**Timing:** Please note that while we process the refund instantly, it typically takes **5 to 10 business days** for the funds to reflect in your bank account, depending on your bank and Stripe's processing times.</li>
              </ol>
            </div>
          </div>
          
          {/* Contact Section */}
          <div className="mt-12 pt-8 border-t border-[#1e293b]">
            <h2 className="text-2xl font-bold text-white mb-3">Initiate a Refund Request</h2>
            <p className="text-slate-400 mb-4">
              To request a refund or if you have any questions regarding this policy, please contact us directly.
            </p>
            <a
              href="mailto:hello@humanaira.com"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-sky-700 text-white font-semibold shadow-lg shadow-sky-900/50 hover:bg-sky-600 transition duration-200 ease-in-out transform hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-sky-500/50"
            >
              <CurrencyIcon className="h-5 w-5 fill-white" />
              hello@humanaira.com
            </a>
          </div>
        </div>
        
        {/* Footer Link */}
        <div className="mt-12 text-center text-slate-500 text-sm">
          {/* Replace Link with <a> for single-file React component */}
          <a href="/" className="hover:text-sky-500 underline transition duration-200">
            Back to Home
          </a>
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
