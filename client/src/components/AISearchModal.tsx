'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

const AI_SEARCH_CATEGORIES = [
  { icon: '🎨', label: 'Design & Creative', query: 'design creative graphic branding' },
  { icon: '💻', label: 'Web Development', query: 'web development coding programming' },
  { icon: '📱', label: 'Mobile Apps', query: 'mobile app development ios android' },
  { icon: '🤖', label: 'AI & Machine Learning', query: 'artificial intelligence machine learning AI ML' },
  { icon: '📝', label: 'Content Writing', query: 'content writing copywriting articles blogs' },
  { icon: '🎬', label: 'Video & Animation', query: 'video editing animation motion graphics' },
  { icon: '📊', label: 'Data Analysis', query: 'data analysis analytics visualization' },
  { icon: '🎵', label: 'Audio & Music', query: 'audio music production sound design' },
]

const AI_SEARCH_PROMPTS = [
  'I need a logo for my startup',
  'Build me a modern website',
  'Create an AI chatbot',
  'Write SEO-optimized content',
  'Edit my product video',
  'Analyze my business data',
]

export default function AISearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [searchText, setSearchText] = useState('')
  const [searching, setSearching] = useState(false)
  const router = useRouter()

  if (!isOpen) return null

  const handleSearch = async (query: string) => {
    if (!query.trim()) return
    
    setSearching(true)
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Navigate to browse with search query
    router.push(`/browse?q=${encodeURIComponent(query)}`)
    setSearching(false)
    onClose()
  }

  const handleCategoryClick = (query: string) => {
    setSearchText(query)
    handleSearch(query)
  }

  const handlePromptClick = (prompt: string) => {
    setSearchText(prompt)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-4xl bg-gradient-to-br from-[#0D1328] to-[#0A0F1E] rounded-3xl border-2 border-[#35BFFF]/30 shadow-2xl shadow-[#35BFFF]/20 overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-8 pb-6 border-b border-[#35BFFF]/20 bg-gradient-to-r from-[#35BFFF]/10 to-transparent">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#35BFFF] to-[#2A9FE6] flex items-center justify-center shadow-lg shadow-[#35BFFF]/50">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-white">AI-Powered Search</h2>
                <p className="text-slate-400 text-sm">Find the perfect service for your needs</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all flex items-center justify-center"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search Input */}
          <form onSubmit={(e) => { e.preventDefault(); handleSearch(searchText); }} className="relative">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Describe what you need... (e.g., 'I need a modern website for my business')"
              className="w-full px-6 py-4 pr-32 rounded-2xl bg-gradient-to-r from-[#1E293B] to-[#0F172A] border-2 border-[#35BFFF]/30 focus:border-[#35BFFF]/60 focus:outline-none focus:ring-2 focus:ring-[#35BFFF]/30 text-white placeholder:text-slate-500 text-base transition-all"
              autoFocus
            />
            <button
              type="submit"
              disabled={searching || !searchText.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#35BFFF] to-[#2A9FE6] text-white font-semibold hover:shadow-lg hover:shadow-[#35BFFF]/50 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
            >
              {searching ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search
                </>
              )}
            </button>
          </form>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8 max-h-[60vh] overflow-auto custom-scrollbar">
          {/* Quick Prompts */}
          <div>
            <h3 className="text-sm font-semibold text-[#35BFFF] mb-4 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Quick Prompts
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {AI_SEARCH_PROMPTS.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handlePromptClick(prompt)}
                  className="p-3 text-left rounded-xl bg-gradient-to-r from-[#1E293B] to-[#0F172A] border border-[#35BFFF]/20 hover:border-[#35BFFF]/40 text-slate-300 hover:text-white transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#35BFFF] flex-shrink-0 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-sm">{prompt}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-[#35BFFF] mb-4 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Popular Categories
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {AI_SEARCH_CATEGORIES.map((category, index) => (
                <button
                  key={index}
                  onClick={() => handleCategoryClick(category.query)}
                  className="p-4 rounded-xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-[#35BFFF]/20 hover:border-[#35BFFF]/40 hover:shadow-lg hover:shadow-[#35BFFF]/20 transition-all group transform hover:scale-105 flex flex-col items-center gap-2 text-center"
                >
                  <span className="text-3xl group-hover:scale-110 transition-transform">{category.icon}</span>
                  <span className="text-sm text-slate-300 group-hover:text-white font-medium">{category.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Pro Tip */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#35BFFF]/10 to-[#2A9FE6]/10 border border-[#35BFFF]/30">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#35BFFF]/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-[#35BFFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm mb-1">💡 Pro Tip</h4>
                <p className="text-slate-400 text-sm">
                  Be specific about your requirements! Instead of "logo design", try "modern minimalist logo for tech startup in blue and white colors"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #35BFFF, #2A9FE6);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #2A9FE6, #35BFFF);
        }
      `}</style>
    </div>
  )
}
