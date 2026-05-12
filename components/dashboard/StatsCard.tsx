'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  trend?: number
  color?: 'gold' | 'green' | 'blue' | 'coffee'
  delay?: number
}

export function StatsCard({ title, value, subtitle, icon, trend, color = 'gold', delay = 0 }: StatsCardProps) {
  // Antique Brass is the primary accent; Coffee as warm secondary
  const colors = {
    gold:   'bg-gold/12 border-gold/25 text-gold',
    coffee: 'bg-coffee/20 border-coffee/35 text-gold-light',
    green:  'bg-green-500/10 border-green-500/20 text-green-400',
    blue:   'bg-blue-500/10 border-blue-500/20 text-blue-400',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-black-card border border-anthracite rounded-xl p-6 hover:border-anthracite-light transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn('w-11 h-11 rounded-xl border flex items-center justify-center', colors[color])}>
          {icon}
        </div>
        {trend !== undefined && (
          <div className={cn('flex items-center gap-1 text-xs font-medium',
            trend >= 0 ? 'text-green-400' : 'text-red-400')}>
            {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="text-stone-500 text-sm mb-1">{title}</p>
      <p className="text-stone-100 font-bold text-2xl font-display">{value}</p>
      {subtitle && <p className="text-stone-600 text-xs mt-1">{subtitle}</p>}
    </motion.div>
  )
}
