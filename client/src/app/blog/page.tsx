'use client'
import React, { useState } from 'react';
// Mock data for a rich, detailed page
const AI_STATS = [
  { value: '45%', label: 'Projected Annual Growth (CAGR) of AI Services Market by 2030.', icon: '📈' },
  { value: '$15.7T', label: 'Potential boost to the global economy by AI by 2030.', icon: '💰' },
  { value: '2.1M', label: 'New AI/ML jobs created worldwide in the last 12 months.', icon: '🧑‍💻' },
  { value: '78%', label: 'Companies reporting increased ROI after integrating AI freelance talent.', icon: '🎯' },
];

const FEATURED_ARTICLE = {
  title: "The Great Skill Shift: How the AI Freelancer is Redefining the Modern Workforce",
  author: "Anya Sharma",
  date: "October 12, 2025",
  readTime: "10 min read",
  summary: "The freelance market is undergoing a seismic change, driven by the demand for specialized AI skills. We analyze the rising importance of prompt engineers, MLOps specialists, and ethical AI consultants in 2025 and beyond.",
  tags: ["FutureOfWork", "FreelanceTrends", "AI-ML"],
  imageUrl: "https://placehold.co/800x400/0f172a/93c5fd?text=AI+Workforce+Redefined",
};

const LATEST_POSTS = [
  { id: 1, title: "MLOps vs. DevOps: What AI Freelancers Need to Master Now", category: "Freelancer Guide", color: "text-amber-400", time: "5 min" },
  { id: 2, title: "5 Essential Tools for Ethical AI Development in 2026", category: "Client Strategy", color: "text-emerald-400", time: "7 min" },
  { id: 3, title: "Case Study: 300% ROI from a Custom GPT Implementation", category: "Analytics", color: "text-pink-400", time: "8 min" },
  { id: 4, title: "The Rise of Specialized AI Niches: From Gen-AI to Quantum ML", category: "Industry News", color: "text-indigo-400", time: "6 min" },
  { id: 5, title: "Scaling Your AI Career: Negotiating Premium Freelance Rates", category: "Freelancer Guide", color: "text-sky-400", time: "4 min" },
  { id: 6, title: "Data Security in Cloud AI: A Non-Technical Guide for Companies", category: "Client Strategy", color: "text-cyan-400", time: "9 min" },
];

// --- Helper Components (Defined within the single file) ---

const StatCard = ({ value, label, icon }) => (
  <div className="p-6 bg-[#0f172a] rounded-xl border border-[#1e293b] shadow-lg hover:shadow-sky-500/10 transition duration-300">
    <div className="text-4xl mb-3">{icon}</div>
    <p className="text-4xl font-extrabold text-sky-400 mb-2">{value}</p>
    <p className="text-sm text-slate-400 font-medium">{label}</p>
  </div>
);

const PostCard = ({ title, category, color, time }) => (
  <div className="group p-6 bg-[#0f172a] rounded-2xl border border-[#1e293b] cursor-pointer hover:border-sky-500 transition duration-300 transform hover:-translate-y-1">
    <p className={`text-xs font-semibold uppercase tracking-widest ${color}`}>{category}</p>
    <h3 className="text-xl font-bold text-slate-100 mt-2 mb-3 group-hover:text-sky-300 transition duration-300">
      {title}
    </h3>
    <div className="flex justify-between items-center text-sm text-slate-400">
      <span>{time}</span>
      <span className="text-sky-500 group-hover:translate-x-1 transition duration-300">→</span>
    </div>
  </div>
);

// --- Main App Component ---

const AiBlog = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Simulate subscription logic
    console.log('Subscribing:', email);
    // IMPORTANT: Replacing alert() with a console log for canvas environment compliance
    // You would use a custom modal/notification in a real app
    console.log(`Subscribed ${email}! (Simulation)`); 
    setEmail('');
  };

  return (
    <div className="bg-[#030712] text-slate-200 min-h-screen font-inter">
      {/* Global Style Reset for Scrollbar/Gap Fix */}
      <style jsx global>{`
        html, body {
            margin: 0 !important; 
            padding: 0 !important;
            overflow-x: hidden;
            background-color: #030712;
            scroll-behavior: smooth;
        }
      `}</style>
      
      {/* Header/Hero Section */}
      <header className="py-20 md:py-32 text-center overflow-hidden relative">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500 mb-4">
            The AI Intelligence Hub
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 font-light max-w-2xl mx-auto mb-8">
            Deep insights, data-driven analysis, and expert commentary on the future of work and the AI services economy.
          </p>
          <a
            href="#"
            className="inline-flex items-center justify-center px-8 py-3 border-2 border-sky-500 text-base font-medium rounded-full text-white bg-sky-600 hover:bg-sky-700 shadow-xl shadow-sky-500/30 transition duration-300 transform hover:scale-[1.02]"
          >
            Explore AI Services
          </a>
        </div>
        {/* Subtle Background Glows (Apple/Modern Effect) */}
        <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-sky-900/30 rounded-full blur-[150px] opacity-20 animate-pulse-slow"></div>
            <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-indigo-900/30 rounded-full blur-[150px] opacity-20 animate-pulse-slow delay-500"></div>
        </div>
      </header>

      {/* AI Analytics & Stats Section */}
      <section className="py-16 md:py-24 border-t border-b border-[#1e293b]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-slate-100 text-center mb-12">
            The State of AI: Key Market Data
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {AI_STATS.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Article Section */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-semibold text-sky-400 mb-6 uppercase tracking-wider">Featured Story</h2>
          <div className="flex flex-col lg:flex-row bg-[#0f172a] rounded-3xl border border-[#1e293b] shadow-2xl shadow-black/50 overflow-hidden">
            {/* Image/Visual */}
            <div className="lg:w-1/2">
                <img 
                    src={FEATURED_ARTICLE.imageUrl} 
                    alt={FEATURED_ARTICLE.title}
                    className="w-full h-64 lg:h-full object-cover"
                    onError={(e) => {
                      const img = e.currentTarget as HTMLImageElement;
                      img.onerror = null;
                      img.src = "https://placehold.co/800x400/0f172a/93c5fd?text=AI+Workforce+Redefined";
                    }}
                />
            </div>
            {/* Content */}
            <div className="lg:w-1/2 p-8 md:p-12">
              <div className="flex space-x-3 text-sm mb-4">
                {FEATURED_ARTICLE.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-sky-500/20 text-sky-300 rounded-full text-xs font-medium">{tag}</span>
                ))}
              </div>
              <h3 className="text-4xl font-bold text-slate-50 mb-4">{FEATURED_ARTICLE.title}</h3>
              <p className="text-lg text-slate-400 mb-6">{FEATURED_ARTICLE.summary}</p>
              <div className="text-sm text-slate-500 mb-8">
                By <span className="text-sky-400 font-semibold">{FEATURED_ARTICLE.author}</span> | {FEATURED_ARTICLE.date} | {FEATURED_ARTICLE.readTime}
              </div>
              <a
                href="#"
                className="text-lg font-semibold text-sky-400 hover:text-sky-300 transition duration-300 inline-flex items-center group"
              >
                Read Full Article 
                <span className="ml-2 text-2xl group-hover:translate-x-1 transition duration-300">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* Dual Focus Section (Freelancer vs. Client) */}
      <section className="py-20 md:py-28 bg-[#0f172a] border-t border-[#1e293b]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-slate-100 text-center mb-16">
            Insights for Every Stakeholder
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Focus 1: AI Freelancers */}
            <div className="p-10 rounded-3xl border border-sky-700/50 bg-sky-900/10 shadow-xl shadow-sky-900/20">
              <h3 className="text-3xl font-bold text-sky-300 mb-4 flex items-center gap-3">
                {/* <Code size={28} /> */}
                For AI Freelancers
              </h3>
              <p className="text-slate-400 mb-6">
                Stay ahead of the curve. Our content helps you identify high-demand skills, optimize your portfolio, and understand rate benchmarks in specialized fields like **Generative AI, Computer Vision, and Robotics**.
              </p>
              <ul className="space-y-3 text-slate-300 list-inside">
                <li className="flex items-center gap-2">✅ Mastering Prompt Engineering for $150+/hr</li>
                <li className="flex items-center gap-2">✅ Building an Immutable MLOps Portfolio</li>
                <li className="flex items-center gap-2">✅ Legal and Tax Considerations for Global AI Work</li>
              </ul>
              <a href="#" className="mt-6 inline-block font-semibold text-sky-300 hover:text-sky-200 transition duration-300">
                View Freelancer Guides →
              </a>
            </div>

            {/* Focus 2: Clients and Companies */}
            <div className="p-10 rounded-3xl border border-indigo-700/50 bg-indigo-900/10 shadow-xl shadow-indigo-900/20">
              <h3 className="text-3xl font-bold text-indigo-300 mb-4 flex items-center gap-3">
                {/* <Briefcase size={28} /> */}
                For Clients & Businesses
              </h3>
              <p className="text-slate-400 mb-6">
                Navigate the AI talent landscape. Learn how to scope projects effectively, calculate the **Return on Investment (ROI)** of external AI teams, and ensure ethical compliance in your models.
              </p>
              <ul className="space-y-3 text-slate-300 list-inside">
                <li className="flex items-center gap-2">✅ ROI Calculator: Hiring Freelance vs. Full-Time AI Teams</li>
                <li className="flex items-center gap-2">✅ De-risking AI: Best Practices for Data Privacy</li>
                <li className="flex items-center gap-2">✅ Scoping Your First Large Language Model Project</li>
              </ul>
              <a href="#" className="mt-6 inline-block font-semibold text-indigo-300 hover:text-indigo-200 transition duration-300">
                View Client Strategies →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Posts Grid Section */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-slate-100 mb-12">Latest Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {LATEST_POSTS.map((post) => (
              <PostCard key={post.id} {...post} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA Footer */}
      <footer className="py-16 md:py-24 bg-[#0f172a] border-t border-[#1e293b]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-4xl font-extrabold text-sky-400 mb-4">
            Don't Miss the Next Wave of AI News
          </h3>
          <p className="text-xl text-slate-400 mb-8">
            Join 50,000 AI professionals and get our weekly digest of market intelligence delivered straight to your inbox.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email address"
              className="flex-grow px-6 py-4 rounded-xl border border-[#1e293b] bg-[#111827] text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
            />
            <button
              type="submit"
              className="flex-shrink-0 px-8 py-4 rounded-xl bg-sky-600 text-white font-bold text-lg shadow-lg shadow-sky-900/40 hover:bg-sky-700 transition duration-300"
            >
              Subscribe Now
            </button>
          </form>
          <p className="mt-6 text-sm text-slate-500">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AiBlog;
