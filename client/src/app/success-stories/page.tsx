export default function SuccessStoriesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020617] via-[#0A0F1F] to-[#050B16] text-white px-6 py-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-extrabold mb-6 text-center">Success Stories</h1>
        <p className="text-xl text-slate-300 mb-16 text-center max-w-3xl mx-auto">
          Real stories from freelancers building successful businesses on Humanaira
        </p>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-[#0D1328]/60 border border-[#35BFFF]/20 rounded-2xl p-8">
            <div className="mb-4">
              <div className="text-[#35BFFF] font-bold text-lg mb-2">Sarah M. - AI Specialist</div>
              <div className="text-sm text-slate-400">Joined 6 months ago</div>
            </div>
            <p className="text-slate-300 leading-relaxed mb-4">
              "I've completed over 50 projects on Humanaira and earned more than $15,000. The platform's low 5% commission means I keep more of what I earn. The clients are professional and the payment system is seamless."
            </p>
            <div className="text-sm text-[#35BFFF]">Revenue: $15,000+ | Projects: 50+</div>
          </div>

          <div className="bg-[#0D1328]/60 border border-[#35BFFF]/20 rounded-2xl p-8">
            <div className="mb-4">
              <div className="text-[#35BFFF] font-bold text-lg mb-2">James K. - Developer</div>
              <div className="text-sm text-slate-400">Joined 1 year ago</div>
            </div>
            <p className="text-slate-300 leading-relaxed mb-4">
              "As a full-stack developer, Humanaira has become my primary source of income. The quality of clients and projects is outstanding. I've built long-term relationships with several clients who keep coming back."
            </p>
            <div className="text-sm text-[#35BFFF]">Revenue: $30,000+ | Projects: 80+</div>
          </div>

          <div className="bg-[#0D1328]/60 border border-[#35BFFF]/20 rounded-2xl p-8">
            <div className="mb-4">
              <div className="text-[#35BFFF] font-bold text-lg mb-2">Maria L. - Designer</div>
              <div className="text-sm text-slate-400">Joined 8 months ago</div>
            </div>
            <p className="text-slate-300 leading-relaxed mb-4">
              "The platform is incredibly user-friendly. I love that I can focus on my creative work while Humanaira handles payments securely. The 5% commission is the best I've seen in the industry."
            </p>
            <div className="text-sm text-[#35BFFF]">Revenue: $12,000+ | Projects: 45+</div>
          </div>

          <div className="bg-[#0D1328]/60 border border-[#35BFFF]/20 rounded-2xl p-8">
            <div className="mb-4">
              <div className="text-[#35BFFF] font-bold text-lg mb-2">Alex R. - Consultant</div>
              <div className="text-sm text-slate-400">Joined 3 months ago</div>
            </div>
            <p className="text-slate-300 leading-relaxed mb-4">
              "I was skeptical at first, but Humanaira exceeded my expectations. The quality of clients and the professional environment make it stand out from other freelance platforms."
            </p>
            <div className="text-sm text-[#35BFFF]">Revenue: $8,000+ | Projects: 25+</div>
          </div>
        </div>
      </div>
    </div>
  )
}
