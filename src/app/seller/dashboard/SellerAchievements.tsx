'use client'

import { useState, useRef, useMemo } from 'react'

interface AchievementsProps {
  completedOrders: number
  grossCents: number
  totalViews: number
  activeGigs: number
}

export default function SellerAchievements({ completedOrders, grossCents, totalViews, activeGigs }: AchievementsProps) {
  const grossDollars = grossCents / 100

  // Define milestones with purple-blue gradient theme
  const milestones = [
    {
      id: 'first_sale',
      icon: '🎉',
      title: 'First Sale',
      description: 'Complete your first order',
      target: 1,
      current: completedOrders,
      type: 'orders' as const,
      gradient: 'from-[#35BFFF] to-[#60a5fa]',
      bgGradient: 'from-[#35BFFF]/20 to-[#60a5fa]/10',
      color: '#35BFFF'
    },
    {
      id: 'rising_star',
      icon: '⭐',
      title: 'Rising Star',
      description: 'Complete 10 orders',
      target: 10,
      current: completedOrders,
      type: 'orders' as const,
      gradient: 'from-[#60a5fa] to-[#a855f7]',
      bgGradient: 'from-[#60a5fa]/20 to-[#a855f7]/10',
      color: '#60a5fa'
    },
    {
      id: 'pro_seller',
      icon: '💎',
      title: 'Pro Seller',
      description: 'Complete 50 orders',
      target: 50,
      current: completedOrders,
      type: 'orders' as const,
      gradient: 'from-[#a855f7] to-[#ec4899]',
      bgGradient: 'from-[#a855f7]/20 to-[#ec4899]/10',
      color: '#a855f7'
    },
    {
      id: 'elite_performer',
      icon: '👑',
      title: 'Elite Performer',
      description: 'Complete 100 orders',
      target: 100,
      current: completedOrders,
      type: 'orders' as const,
      gradient: 'from-[#ec4899] to-[#f43f5e]',
      bgGradient: 'from-[#ec4899]/20 to-[#f43f5e]/10',
      color: '#ec4899'
    },
    {
      id: 'money_maker',
      icon: '💰',
      title: 'Money Maker',
      description: 'Earn $1,000 in sales',
      target: 1000,
      current: grossDollars,
      type: 'revenue' as const,
      gradient: 'from-[#10b981] to-[#059669]',
      bgGradient: 'from-[#10b981]/20 to-[#059669]/10',
      color: '#10b981'
    },
    {
      id: 'high_roller',
      icon: '🚀',
      title: 'High Roller',
      description: 'Earn $5,000 in sales',
      target: 5000,
      current: grossDollars,
      type: 'revenue' as const,
      gradient: 'from-[#f59e0b] to-[#d97706]',
      bgGradient: 'from-[#f59e0b]/20 to-[#d97706]/10',
      color: '#f59e0b'
    },
    {
      id: 'viral_seller',
      icon: '🔥',
      title: 'Viral Seller',
      description: 'Reach 1,000 views',
      target: 1000,
      current: totalViews,
      type: 'views' as const,
      gradient: 'from-[#f97316] to-[#ea580c]',
      bgGradient: 'from-[#f97316]/20 to-[#ea580c]/10',
      color: '#f97316'
    },
    {
      id: 'service_master',
      icon: '🎯',
      title: 'Service Master',
      description: 'Have 5 active gigs',
      target: 5,
      current: activeGigs,
      type: 'gigs' as const,
      gradient: 'from-[#8b5cf6] to-[#7c3aed]',
      bgGradient: 'from-[#8b5cf6]/20 to-[#7c3aed]/10',
      color: '#8b5cf6'
    },
  ]

  // Calculate overall progress
  const completedMilestones = milestones.filter(m => m.current >= m.target).length
  const totalMilestones = milestones.length
  const overallProgress = (completedMilestones / totalMilestones) * 100

  // Determine seller level
  const { level, levelTitle, nextLevel, progressToNext } = useMemo(() => {
    if (completedOrders >= 100) return { level: 5, levelTitle: 'Legend', nextLevel: null, progressToNext: 100 }
    if (completedOrders >= 50) return { level: 4, levelTitle: 'Elite', nextLevel: 'Legend (100)', progressToNext: (completedOrders / 100) * 100 }
    if (completedOrders >= 25) return { level: 3, levelTitle: 'Pro', nextLevel: 'Elite (50)', progressToNext: (completedOrders / 50) * 100 }
    if (completedOrders >= 10) return { level: 2, levelTitle: 'Rising', nextLevel: 'Pro (25)', progressToNext: (completedOrders / 25) * 100 }
    if (completedOrders >= 1) return { level: 1, levelTitle: 'Starter', nextLevel: 'Rising (10)', progressToNext: (completedOrders / 10) * 100 }
    return { level: 0, levelTitle: 'Newbie', nextLevel: 'Starter (1)', progressToNext: 0 }
  }, [completedOrders])

  return (
    <div className="space-y-6">
      {/* Level Progress Card */}
      <LevelCard 
        level={level}
        levelTitle={levelTitle}
        nextLevel={nextLevel}
        progressToNext={progressToNext}
        completedOrders={completedOrders}
      />

      {/* Achievements Grid */}
      <div className="relative p-8 rounded-3xl bg-gradient-to-br from-[#0f172a]/95 via-[#1a1f35]/90 to-[#1e293b]/95 border-2 border-[#a855f7]/30 overflow-hidden backdrop-blur-xl shadow-2xl"
        style={{ boxShadow: '0 8px 32px rgba(168,85,247,0.25), inset 0 1px 0 rgba(168,85,247,0.1)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#a855f7]/5 via-transparent to-[#35BFFF]/5" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-[#35BFFF] via-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">
                Achievements
              </h2>
              <p className="text-slate-400 mt-1">
                {completedMilestones} of {totalMilestones} milestones unlocked
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-black bg-gradient-to-r from-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">
                {Math.round(overallProgress)}%
              </div>
              <div className="text-sm text-slate-500">Complete</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {milestones.map((milestone) => (
              <MilestoneCard key={milestone.id} {...milestone} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function LevelCard({ level, levelTitle, nextLevel, progressToNext, completedOrders }: any) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    const rotateX = ((y - centerY) / centerY) * -3
    const rotateY = ((x - centerX) / centerX) * 3
    setRotation({ x: rotateX, y: rotateY })
  }

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 })
  }

  const levelColors = [
    { bg: 'from-slate-600 to-slate-700', text: 'text-slate-400', glow: 'rgba(148, 163, 184, 0.3)' },
    { bg: 'from-[#35BFFF] to-[#0ea5e9]', text: 'text-[#35BFFF]', glow: 'rgba(53, 191, 255, 0.4)' },
    { bg: 'from-[#60a5fa] to-[#3b82f6]', text: 'text-[#60a5fa]', glow: 'rgba(96, 165, 250, 0.4)' },
    { bg: 'from-[#a855f7] to-[#9333ea]', text: 'text-[#a855f7]', glow: 'rgba(168, 85, 247, 0.4)' },
    { bg: 'from-[#ec4899] to-[#db2777]', text: 'text-[#ec4899]', glow: 'rgba(236, 72, 153, 0.4)' },
    { bg: 'from-[#f59e0b] to-[#d97706]', text: 'text-[#f59e0b]', glow: 'rgba(245, 158, 11, 0.5)' },
  ]

  const currentLevel = levelColors[Math.min(level, levelColors.length - 1)]

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative p-8 rounded-3xl bg-gradient-to-br from-[#0f172a]/95 via-[#1a1f35]/90 to-[#1e293b]/95 border-2 border-[#35BFFF]/30 overflow-hidden backdrop-blur-xl shadow-2xl group"
      style={{
        transform: `perspective(1200px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        transition: 'transform 0.3s ease-out',
        boxShadow: `0 8px 32px ${currentLevel.glow}, inset 0 1px 0 rgba(53,191,255,0.1)`
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{ animation: 'shimmer 3s linear infinite' }}
      />

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
        {/* Level Badge */}
        <div className="relative">
          <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${currentLevel.bg} flex items-center justify-center shadow-2xl animate-pulse-glow`}
            style={{ boxShadow: `0 0 40px ${currentLevel.glow}` }}
          >
            <div className="text-center">
              <div className="text-5xl font-black text-white">
                {level}
              </div>
              <div className="text-xs font-bold text-white/80 uppercase tracking-wider">
                Level
              </div>
            </div>
          </div>
          <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
            <span className="text-xl">⭐</span>
          </div>
        </div>

        {/* Level Info */}
        <div className="flex-1 text-center md:text-left">
          <h3 className={`text-4xl font-black mb-2 ${currentLevel.text}`}>
            {levelTitle} Seller
          </h3>
          <p className="text-slate-400 mb-4">
            {completedOrders} orders completed
          </p>

          {nextLevel && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Progress to {nextLevel}</span>
                <span className="font-bold text-[#a855f7]">{Math.round(progressToNext)}%</span>
              </div>
              <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div 
                  className={`h-full bg-gradient-to-r ${currentLevel.bg} transition-all duration-1000 ease-out`}
                  style={{ 
                    width: `${progressToNext}%`,
                    boxShadow: `0 0 10px ${currentLevel.glow}`
                  }}
                />
              </div>
            </div>
          )}

          {!nextLevel && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/50">
              <span className="text-2xl">🏆</span>
              <span className="font-bold text-yellow-400">Max Level Achieved!</span>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes pulse-glow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

function MilestoneCard({ icon, title, description, target, current, type, gradient, bgGradient, color }: any) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 })
  const cardRef = useRef<HTMLDivElement>(null)

  const progress = Math.min((current / target) * 100, 100)
  const isCompleted = current >= target

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    const glowX = ((e.clientX - rect.left) / rect.width) * 100
    const glowY = ((e.clientY - rect.top) / rect.height) * 100
    setGlowPosition({ x: glowX, y: glowY })
    
    const rotateX = ((y - centerY) / centerY) * -8
    const rotateY = ((x - centerX) / centerX) * 8
    setRotation({ x: rotateX, y: rotateY })
  }

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 })
    setGlowPosition({ x: 50, y: 50 })
  }

  const formatValue = (val: number) => {
    if (type === 'revenue') return `$${val.toLocaleString()}`
    return val.toLocaleString()
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative p-6 rounded-2xl border-2 transition-all duration-500 group overflow-hidden ${
        isCompleted 
          ? 'bg-gradient-to-br from-[#0f172a]/95 via-[#1a1f35]/90 to-[#1e293b]/95 border-opacity-70 shadow-2xl' 
          : 'bg-gradient-to-br from-[#0f172a]/60 via-[#1a1f35]/50 to-[#1e293b]/60 border-slate-700/30'
      }`}
      style={{
        transform: `perspective(1200px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        boxShadow: isCompleted ? `0 8px 32px ${color}44, inset 0 1px 0 ${color}22` : 'none',
        borderColor: isCompleted ? `${color}60` : 'rgba(71, 85, 105, 0.3)'
      }}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} ${isCompleted ? 'opacity-50' : 'opacity-20'}`} />
      
      {/* Interactive glow */}
      {isCompleted && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle 300px at ${glowPosition.x}% ${glowPosition.y}%, ${color}44, transparent 70%)`
          }}
        />
      )}

      {/* Shimmer effect for completed */}
      {isCompleted && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" 
            style={{ animation: 'shimmer 2s linear infinite' }} 
          />
        </div>
      )}

      <div className="relative z-10 space-y-4">
        {/* Icon and Title */}
        <div className="flex items-start justify-between">
          <div className={`text-5xl ${isCompleted ? 'grayscale-0' : 'grayscale opacity-40'}`}>
            {icon}
          </div>
          {isCompleted && (
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>

        {/* Title and Description */}
        <div>
          <h4 className={`text-lg font-bold mb-1 ${isCompleted ? 'text-white' : 'text-slate-500'}`}>
            {title}
          </h4>
          <p className={`text-sm ${isCompleted ? 'text-slate-400' : 'text-slate-600'}`}>
            {description}
          </p>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className={isCompleted ? 'text-slate-400' : 'text-slate-600'}>
              {formatValue(current)} / {formatValue(target)}
            </span>
            <span className={`font-bold ${isCompleted ? `bg-gradient-to-r ${gradient} bg-clip-text text-transparent` : 'text-slate-600'}`}>
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-2 bg-slate-800/50 rounded-full overflow-hidden border border-slate-700/30">
            <div 
              className={`h-full bg-gradient-to-r ${gradient} transition-all duration-1000 ease-out ${isCompleted ? 'shadow-lg' : ''}`}
              style={{ 
                width: `${progress}%`,
                boxShadow: isCompleted ? `0 0 8px ${color}` : 'none'
              }}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}
