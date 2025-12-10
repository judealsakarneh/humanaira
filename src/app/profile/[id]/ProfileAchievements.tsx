'use client'

import { useState, useEffect, useMemo } from 'react'
import { createSupabaseBrowser } from '../../api/lib/supabaseBrowser'

interface ProfileAchievementsProps {
  userId: string
}

interface SellerStats {
  completed_orders: number
  gross_cents: number
}

interface GigStats {
  total_views: number
  active_gigs: number
}

export default function ProfileAchievements({ userId }: ProfileAchievementsProps) {
  const [stats, setStats] = useState<SellerStats & GigStats>({
    completed_orders: 0,
    gross_cents: 0,
    total_views: 0,
    active_gigs: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const supabase = createSupabaseBrowser()

        // Fetch seller balance stats
        const { data: balanceData } = await supabase
          .from('seller_balances')
          .select('completed_orders, gross_cents')
          .eq('user_id', userId)
          .single()

        // Fetch gig stats
        const { data: gigsData } = await supabase
          .from('gigs')
          .select('id, views')
          .eq('seller_id', userId)

        const totalViews = gigsData?.reduce((sum, gig) => sum + (gig.views || 0), 0) || 0
        const activeGigs = gigsData?.length || 0

        setStats({
          completed_orders: balanceData?.completed_orders || 0,
          gross_cents: balanceData?.gross_cents || 0,
          total_views: totalViews,
          active_gigs: activeGigs
        })
      } catch (error) {
        console.error('Error fetching seller stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [userId])

  const grossDollars = stats.gross_cents / 100

  // Define all milestones
  const milestones = useMemo(() => [
    {
      id: 'first_sale',
      icon: '🎉',
      title: 'First Sale',
      description: 'Complete your first order',
      target: 1,
      current: stats.completed_orders,
      gradient: 'from-[#35BFFF] to-[#60a5fa]',
      color: '#35BFFF'
    },
    {
      id: 'rising_star',
      icon: '⭐',
      title: 'Rising Star',
      description: 'Complete 10 orders',
      target: 10,
      current: stats.completed_orders,
      gradient: 'from-[#60a5fa] to-[#3b82f6]',
      color: '#60a5fa'
    },
    {
      id: 'pro_seller',
      icon: '💎',
      title: 'Pro Seller',
      description: 'Complete 50 orders',
      target: 50,
      current: stats.completed_orders,
      gradient: 'from-[#a855f7] to-[#ec4899]',
      color: '#a855f7'
    },
    {
      id: 'elite_performer',
      icon: '👑',
      title: 'Elite Performer',
      description: 'Complete 100 orders',
      target: 100,
      current: stats.completed_orders,
      gradient: 'from-[#ec4899] to-[#f43f5e]',
      color: '#ec4899'
    },
    {
      id: 'money_maker',
      icon: '💰',
      title: 'Money Maker',
      description: 'Earn $1,000 in sales',
      target: 1000,
      current: grossDollars,
      gradient: 'from-[#10b981] to-[#059669]',
      color: '#10b981'
    },
    {
      id: 'high_roller',
      icon: '🚀',
      title: 'High Roller',
      description: 'Earn $5,000 in sales',
      target: 5000,
      current: grossDollars,
      gradient: 'from-[#f59e0b] to-[#d97706]',
      color: '#f59e0b'
    },
    {
      id: 'viral_seller',
      icon: '🔥',
      title: 'Viral Seller',
      description: 'Reach 1,000 views',
      target: 1000,
      current: stats.total_views,
      gradient: 'from-[#f97316] to-[#ea580c]',
      color: '#f97316'
    },
    {
      id: 'service_master',
      icon: '🎯',
      title: 'Service Master',
      description: 'Have 5 active gigs',
      target: 5,
      current: stats.active_gigs,
      gradient: 'from-[#8b5cf6] to-[#7c3aed]',
      color: '#8b5cf6'
    },
  ], [stats, grossDollars])

  // Determine seller level
  const { level, levelTitle } = useMemo(() => {
    if (stats.completed_orders >= 100) return { level: 5, levelTitle: 'Legend' }
    if (stats.completed_orders >= 50) return { level: 4, levelTitle: 'Elite' }
    if (stats.completed_orders >= 25) return { level: 3, levelTitle: 'Pro' }
    if (stats.completed_orders >= 10) return { level: 2, levelTitle: 'Rising' }
    if (stats.completed_orders >= 1) return { level: 1, levelTitle: 'Starter' }
    return { level: 0, levelTitle: 'Newbie' }
  }, [stats.completed_orders])

  const getLevelColor = (lvl: number) => {
    if (lvl >= 5) return '#FFD700' // Gold
    if (lvl >= 4) return '#FF8C00' // Orange
    if (lvl >= 3) return '#ec4899' // Pink
    if (lvl >= 2) return '#a855f7' // Purple
    if (lvl >= 1) return '#60a5fa' // Blue
    return '#94a3b8' // Gray
  }

  const completedMilestones = milestones.filter(m => m.current >= m.target).length

  if (loading) {
    return (
      <div className="relative overflow-hidden rounded-3xl border-2 border-[#35BFFF]/30 p-8 shadow-2xl backdrop-blur-xl"
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9))',
          boxShadow: '0 20px 60px rgba(53,191,255,0.15)'
        }}>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-[#35BFFF] border-slate-700"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-[#35BFFF]/30 p-8 md:p-10 shadow-2xl backdrop-blur-xl liquid-bg"
      style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9))',
        boxShadow: '0 20px 60px rgba(53,191,255,0.15), inset 0 1px 0 rgba(53,191,255,0.1)'
      }}>
      
      {/* Shimmer effect */}
      <div className="shimmer-effect" />
      
      {/* Floating orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-48 h-48 bg-[#35BFFF]/5 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-[#a855f7]/5 rounded-full blur-3xl animate-float-medium" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-10 bg-gradient-to-b from-[#35BFFF] to-[#60a5fa] rounded-full shadow-[0_0_15px_#35BFFF]" />
            <h2 className="text-3xl font-bold text-white">Achievements</h2>
          </div>
          <div className="text-sm text-slate-300">
            <span className="text-[#35BFFF] font-bold text-lg">{completedMilestones}</span> / {milestones.length} Unlocked
          </div>
        </div>

        {/* Level Badge */}
        <div className="mb-8 p-6 rounded-2xl border-2 relative overflow-hidden"
          style={{
            borderColor: getLevelColor(level),
            background: `linear-gradient(135deg, ${getLevelColor(level)}15, ${getLevelColor(level)}05)`,
            boxShadow: `0 8px 24px ${getLevelColor(level)}30`
          }}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 shimmer-effect" />
          </div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-bold border-2"
              style={{
                background: `linear-gradient(135deg, ${getLevelColor(level)}, ${getLevelColor(level)}cc)`,
                borderColor: getLevelColor(level),
                boxShadow: `0 4px 16px ${getLevelColor(level)}40`
              }}>
              {level}
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ color: getLevelColor(level) }}>
                {levelTitle}
              </div>
              <div className="text-slate-300 text-sm">
                {stats.completed_orders} Orders Completed
              </div>
            </div>
          </div>
        </div>

        {/* Milestones Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {milestones.map((milestone) => {
            const isUnlocked = milestone.current >= milestone.target
            const progress = Math.min((milestone.current / milestone.target) * 100, 100)

            return (
              <div
                key={milestone.id}
                className="relative p-5 rounded-2xl border-2 overflow-hidden transition-all duration-300"
                style={{
                  borderColor: isUnlocked ? milestone.color : 'rgba(148, 163, 184, 0.2)',
                  background: isUnlocked 
                    ? `linear-gradient(135deg, ${milestone.color}15, ${milestone.color}05)`
                    : 'linear-gradient(135deg, rgba(15, 23, 42, 0.6), rgba(30, 41, 59, 0.4))',
                  boxShadow: isUnlocked 
                    ? `0 8px 24px ${milestone.color}20`
                    : '0 4px 12px rgba(0,0,0,0.2)',
                  filter: isUnlocked ? 'grayscale(0)' : 'grayscale(0.7)',
                  opacity: isUnlocked ? 1 : 0.6
                }}
              >
                {/* Shimmer for unlocked */}
                {isUnlocked && (
                  <div className="absolute inset-0 shimmer-effect opacity-50" />
                )}

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="text-5xl mb-3 flex items-center justify-center">
                    {milestone.icon}
                  </div>

                  {/* Title */}
                  <div className="text-center mb-2">
                    <div className="text-white font-bold text-base mb-1">
                      {milestone.title}
                    </div>
                    <div className="text-slate-400 text-xs">
                      {milestone.description}
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-slate-300">
                        {milestone.current.toLocaleString()}
                      </span>
                      <span className="text-slate-400">
                        {milestone.target.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${progress}%`,
                          background: isUnlocked 
                            ? `linear-gradient(90deg, ${milestone.color}, ${milestone.color}cc)`
                            : 'linear-gradient(90deg, #475569, #334155)',
                          boxShadow: isUnlocked ? `0 0 10px ${milestone.color}60` : 'none'
                        }}
                      />
                    </div>
                  </div>

                  {/* Unlock status */}
                  {isUnlocked && (
                    <div className="mt-3 flex items-center justify-center gap-1 text-xs font-semibold"
                      style={{ color: milestone.color }}>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Unlocked</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
