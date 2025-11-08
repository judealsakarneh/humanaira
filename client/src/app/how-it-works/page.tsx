export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020617] via-[#0A0F1F] to-[#050B16] text-white px-6 py-24">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-extrabold mb-6 text-center">How It Works</h1>
        <p className="text-xl text-slate-300 mb-12 text-center max-w-3xl mx-auto">
          Discover how Humanaira connects clients with talented freelancers in just a few simple steps.
        </p>
        
        <div className="space-y-12">
          <div className="bg-[#0D1328]/60 border border-[#35BFFF]/20 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4 text-[#35BFFF]">For Clients</h2>
            <ol className="space-y-4 text-slate-300">
              <li className="flex gap-4"><span className="font-bold text-[#35BFFF] min-w-[30px]">1.</span> Browse our marketplace and find the perfect service for your needs</li>
              <li className="flex gap-4"><span className="font-bold text-[#35BFFF] min-w-[30px]">2.</span> Review freelancer profiles, portfolios, and ratings</li>
              <li className="flex gap-4"><span className="font-bold text-[#35BFFF] min-w-[30px]">3.</span> Place an order or contact the seller to discuss your project</li>
              <li className="flex gap-4"><span className="font-bold text-[#35BFFF] min-w-[30px]">4.</span> Collaborate with your freelancer through our messaging system</li>
              <li className="flex gap-4"><span className="font-bold text-[#35BFFF] min-w-[30px]">5.</span> Receive your completed work and leave a review</li>
            </ol>
          </div>

          <div className="bg-[#0D1328]/60 border border-[#35BFFF]/20 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4 text-[#35BFFF]">For Freelancers</h2>
            <ol className="space-y-4 text-slate-300">
              <li className="flex gap-4"><span className="font-bold text-[#35BFFF] min-w-[30px]">1.</span> Create your seller profile and showcase your skills</li>
              <li className="flex gap-4"><span className="font-bold text-[#35BFFF] min-w-[30px]">2.</span> List your services with pricing and delivery time</li>
              <li className="flex gap-4"><span className="font-bold text-[#35BFFF] min-w-[30px]">3.</span> Receive orders from clients worldwide</li>
              <li className="flex gap-4"><span className="font-bold text-[#35BFFF] min-w-[30px]">4.</span> Deliver high-quality work on time</li>
              <li className="flex gap-4"><span className="font-bold text-[#35BFFF] min-w-[30px]">5.</span> Build your reputation and grow your business (5% commission)</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
