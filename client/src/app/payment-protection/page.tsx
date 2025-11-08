export default function PaymentProtectionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020617] via-[#0A0F1F] to-[#050B16] text-white px-6 py-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-extrabold mb-6 text-center">Payment Protection</h1>
        <p className="text-xl text-slate-300 mb-12 text-center">
          Your transactions are secure with industry-leading payment protection
        </p>
        
        <div className="space-y-8">
          <div className="bg-[#0D1328]/60 border border-[#35BFFF]/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4 text-[#35BFFF]">Secure Payments via Stripe</h2>
            <p className="text-slate-300 leading-relaxed">
              All payments are processed through Stripe, the world's leading payment platform trusted by millions of businesses. Your payment information is encrypted and never stored on our servers.
            </p>
          </div>

          <div className="bg-[#0D1328]/60 border border-[#35BFFF]/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4 text-[#35BFFF]">Escrow Protection</h2>
            <p className="text-slate-300 leading-relaxed">
              When you place an order, funds are held securely until the work is delivered and approved. This ensures freelancers get paid for their work and clients receive what they ordered.
            </p>
          </div>

          <div className="bg-[#0D1328]/60 border border-[#35BFFF]/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4 text-[#35BFFF]">Dispute Resolution</h2>
            <p className="text-slate-300 leading-relaxed">
              If issues arise, our support team is here to help mediate and resolve disputes fairly for both parties.
            </p>
          </div>

          <div className="bg-[#0D1328]/60 border border-[#35BFFF]/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4 text-[#35BFFF]">Transparent Pricing</h2>
            <p className="text-slate-300 leading-relaxed">
              No hidden fees. Clients pay the listed price, and sellers keep 95% of their earnings (only 5% platform commission).
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
