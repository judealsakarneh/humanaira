export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020617] via-[#0A0F1F] to-[#050B16] text-white px-6 py-24">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-extrabold mb-6 text-center">Community</h1>
        <p className="text-xl text-slate-300 mb-16 text-center max-w-3xl mx-auto">
          Join our growing community of freelancers and clients
        </p>
        
        <div className="space-y-8">
          <div className="bg-[#0D1328]/60 border border-[#35BFFF]/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4 text-[#35BFFF]">Connect with Peers</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              Network with other freelancers, share experiences, and learn from the best in your field.
            </p>
          </div>

          <div className="bg-[#0D1328]/60 border border-[#35BFFF]/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4 text-[#35BFFF]">Stay Updated</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              Get the latest news, platform updates, and industry insights. Follow us on social media for tips, success stories, and community highlights.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-[#35BFFF] hover:text-[#2BA3E0] transition">Twitter</a>
              <a href="#" className="text-[#35BFFF] hover:text-[#2BA3E0] transition">LinkedIn</a>
              <a href="#" className="text-[#35BFFF] hover:text-[#2BA3E0] transition">Facebook</a>
            </div>
          </div>

          <div className="bg-[#0D1328]/60 border border-[#35BFFF]/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4 text-[#35BFFF]">Community Guidelines</h2>
            <ul className="space-y-2 text-slate-300">
              <li>• Treat all community members with respect</li>
              <li>• Share knowledge and help others succeed</li>
              <li>• Maintain professionalism in all interactions</li>
              <li>• Report inappropriate behavior to our support team</li>
              <li>• Celebrate wins and support each other</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
