'use client'

export default function TermsPage() {
  const BRAND = '#35BFFF'

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
          <h1
            className="text-4xl md:text-5xl font-extrabold tracking-tight"
            style={{ color: BRAND }}
          >
            Terms of Service
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </header>

        {/* Quick navigation */}
        <nav
          className="relative z-10 rounded-2xl border bg-slate-900/70 backdrop-blur-sm p-4 md:p-5 mb-8"
          style={{ borderColor: 'rgba(53,191,255,0.25)' }}
          aria-label="Terms of Service Sections"
        >
          <h2 className="text-sm font-semibold mb-2 text-slate-300">On this page</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <li>
              <a href="#acceptance" className="underline decoration-transparent hover:decoration-inherit transition" style={{ color: BRAND }}>
                1. Acceptance of Terms
              </a>
            </li>
            <li>
              <a href="#accounts" className="underline decoration-transparent hover:decoration-inherit transition" style={{ color: BRAND }}>
                2. User Accounts
              </a>
            </li>
            <li>
              <a href="#prohibited" className="underline decoration-transparent hover:decoration-inherit transition" style={{ color: BRAND }}>
                3. Prohibited Use
              </a>
            </li>
            <li>
              <a href="#billing" className="underline decoration-transparent hover:decoration-inherit transition" style={{ color: BRAND }}>
                4. Billing & Refunds
              </a>
            </li>
            <li>
              <a href="#ip" className="underline decoration-transparent hover:decoration-inherit transition" style={{ color: BRAND }}>
                5. Intellectual Property
              </a>
            </li>
            <li>
              <a href="#warranty" className="underline decoration-transparent hover:decoration-inherit transition" style={{ color: BRAND }}>
                6. Disclaimer of Warranties
              </a>
            </li>
            <li>
              <a href="#contact" className="underline decoration-transparent hover:decoration-inherit transition" style={{ color: BRAND }}>
                Questions & Contact
              </a>
            </li>
          </ul>
        </nav>

        {/* Card */}
        <section
          className="relative z-10 rounded-3xl shadow-2xl p-8 md:p-12 bg-slate-900/80 backdrop-blur-sm border"
          style={{ borderColor: 'rgba(53,191,255,0.35)', boxShadow: '0 24px 64px rgba(3,6,16,0.6)' }}
        >
          <div className="space-y-10">
            {/* 1. Acceptance of Terms */}
            <div id="acceptance">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight" style={{ color: BRAND }}>
                1. Acceptance of Terms
              </h2>
              <p className="text-slate-300 leading-relaxed">
                By accessing or using Humanaira Ltd, you agree to be bound by these Terms of Service and our Privacy
                Policy. If you do not agree to all terms, you must not use our platform or services.
              </p>
            </div>

            {/* 2. User Accounts */}
            <div id="accounts">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight" style={{ color: BRAND }}>
                2. User Accounts
              </h2>
              <ul className="list-disc pl-6 text-slate-300 space-y-3 leading-relaxed">
                <li>You must provide accurate and complete information when registering an account.</li>
                <li>You are solely responsible for maintaining the confidentiality of your credentials.</li>
                <li>You are responsible for all activities that occur under your account.</li>
                <li>Accounts are non-transferable and may be suspended or terminated for violations.</li>
              </ul>
            </div>

            {/* 3. Prohibited Use */}
            <div id="prohibited">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight" style={{ color: BRAND }}>
                3. Prohibited Use
              </h2>
              <ul className="list-disc pl-6 text-slate-300 space-y-3 leading-relaxed">
                <li>
                  You must not use Humanaira Ltd for any unlawful or malicious purpose, including fraud, harassment, or
                  distribution of illegal content.
                </li>
                <li>
                  Any attempt to reverse-engineer, exploit, or disrupt the platform&apos;s integrity or security is strictly
                  prohibited.
                </li>
                <li>
                  You agree not to infringe upon the rights of others, including intellectual property and privacy rights.
                </li>
              </ul>
            </div>

            {/* 4. Billing & Refunds */}
            <div id="billing">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight" style={{ color: BRAND }}>
                4. Billing & Refunds
              </h2>
              <ul className="list-disc pl-6 text-slate-300 space-y-3 leading-relaxed">
                <li>All service payments are processed securely through third-party providers.</li>
                <li>Prices are subject to change upon notice. You are responsible for all applicable taxes.</li>
                <li>
                  Refunds are granted according to our Money-Back Guarantee Policy, available upon request or on relevant
                  service pages.
                </li>
              </ul>
            </div>

            {/* 5. Intellectual Property */}
            <div id="ip">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight" style={{ color: BRAND }}>
                5. Intellectual Property and Licensing
              </h2>
              <ul className="list-disc pl-6 text-slate-300 space-y-3 leading-relaxed">
                <li>
                  All code, graphics, and content on Humanaira Ltd are the exclusive property of Humanaira Ltd and
                  protected by global copyright laws.
                </li>
                <li>
                  Users retain ownership of the content they submit but grant Humanaira Ltd a non-exclusive license to
                  use, host, and display that content for service provision and platform operations.
                </li>
              </ul>
            </div>

            {/* 6. Disclaimer of Warranties */}
            <div id="warranty">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight" style={{ color: BRAND }}>
                6. Disclaimer of Warranties
              </h2>
              <p className="text-slate-300 leading-relaxed">
                Humanaira Ltd provides its services &quot;as is&quot; and &quot;as available,&quot; without any warranties of any kind,
                either express or implied, including, but not limited to, fitness for a particular purpose or
                non-infringement. We do not warrant that the service will be uninterrupted, error-free, or completely
                secure.
              </p>
            </div>

            {/* Contact Section */}
            <div id="contact" className="pt-6 border-t" style={{ borderColor: 'rgba(53,191,255,0.25)' }}>
              <h2 className="text-2xl font-bold mb-3" style={{ color: BRAND }}>
                Questions & Contact
              </h2>
              <p className="text-slate-300 mb-4">
                If you have any concerns or need clarification regarding these Terms of Service, please reach out to our
                legal team.
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12 12.713 0.587 4h22.826L12 12.713zm0 2.587L0 6.019V20.518h24V6.019L12 15.3z"
                  />
                </svg>
                hello@humanaira.com
              </a>
            </div>
          </div>
        </section>

        {/* Footer Link */}
        <div className="mt-10 text-center text-slate-500 text-sm">
          <a
            href="/"
            className="underline decoration-transparent hover:decoration-inherit transition"
            style={{ color: BRAND }}
          >
            Back to the Marketplace
          </a>
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