'use client'

export default function SecurityPage() {
  return (
    <main className="min-h-screen bg-[#090a10] text-gray-100 font-inter">
      <section className="max-w-3xl mx-auto px-4 py-24 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-200 mb-4">
          Security & Trust
        </h1>
        <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl">
          Your safety is our top priority. Learn how Humanaira protects your data, payments, and privacy.
        </p>
        <div className="w-full bg-[#101a2a]/90 border border-blue-900 rounded-2xl shadow-xl p-8 mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">Our Security Practices</h2>
          <ul className="space-y-4 text-blue-200 text-left max-w-xl mx-auto">
            <li>
              <span className="font-semibold text-white">Data Encryption:</span> All sensitive data is encrypted in transit (TLS 1.2+) and at rest.
            </li>
            <li>
              <span className="font-semibold text-white">Secure Payments:</span> Payments are processed via PCI-compliant providers and held in escrow until project completion.
            </li>
            <li>
              <span className="font-semibold text-white">Account Protection:</span> Multi-factor authentication (MFA) and strong password requirements help keep your account safe.
            </li>
            <li>
              <span className="font-semibold text-white">Regular Audits:</span> We conduct security reviews and vulnerability scans on our infrastructure.
            </li>
            <li>
              <span className="font-semibold text-white">Privacy First:</span> Your personal information is never sold or shared without your consent.
            </li>
          </ul>
        </div>
        <div className="w-full bg-[#181a23] border border-blue-900 rounded-2xl shadow p-8 mb-10">
          <h3 className="text-xl font-semibold text-blue-100 mb-3">Report a Security Issue</h3>
          <p className="text-blue-200 mb-4">
            If you believe you’ve found a security vulnerability, please contact our security team directly.
          </p>
          <a
            href="mailto:hello@humanaira.com"
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#38bdf8] text-white font-bold text-lg shadow hover:from-[#1e40af] hover:to-[#0ea5e9] transition"
          >
            hello@humanaira.com
          </a>
        </div>
        <div className="text-blue-200 mt-8 text-sm">
          For more details, see our <a href="/privacy" className="underline hover:text-blue-400">Privacy Policy</a> and <a href="/terms" className="underline hover:text-blue-400">Terms of Service</a>.
        </div>
      </section>
    </main>
  )
}