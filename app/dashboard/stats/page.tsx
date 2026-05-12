'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Euro, Car, TrendingUp, Users, Calendar } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { formatPrice } from '@/lib/pricing'

interface MonthlyData {
  month: string
  revenue: number
  rides: number
}

export default function StatsPage() {
  const [monthly, setMonthly] = useState<MonthlyData[]>([])
  const [totals, setTotals] = useState({ revenue: 0, rides: 0, clients: 0, avg: 0 })
  const maxRevenue = Math.max(...monthly.map(m => m.revenue), 1)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    const { data: allRes } = await supabase
      .from('reservations')
      .select('date, final_price, status')
      .eq('status', 'completed')
      .order('date', { ascending: false })

    const { data: clients } = await supabase.from('clients').select('id')

    if (allRes) {
      const monthMap: Record<string, MonthlyData> = {}
      let total = 0

      allRes.forEach(res => {
        const d = new Date(res.date)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        const label = d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
        if (!monthMap[key]) monthMap[key] = { month: label, revenue: 0, rides: 0 }
        monthMap[key].revenue += res.final_price || 0
        monthMap[key].rides += 1
        total += res.final_price || 0
      })

      const sorted = Object.entries(monthMap)
        .sort(([a], [b]) => b.localeCompare(a))
        .slice(0, 6)
        .map(([, v]) => v)
        .reverse()

      setMonthly(sorted)
      setTotals({
        revenue: total,
        rides: allRes.length,
        clients: clients?.length || 0,
        avg: allRes.length ? total / allRes.length : 0,
      })
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-white font-bold text-2xl">Statistiques</h1>
        <p className="text-gray-500 text-sm mt-1">Vue d'ensemble de votre activité</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="CA Total" value={formatPrice(totals.revenue)} icon={<Euro size={18} />} color="gold" />
        <StatsCard title="Courses totales" value={totals.rides} icon={<Car size={18} />} color="blue" delay={0.05} />
        <StatsCard title="Clients" value={totals.clients} icon={<Users size={18} />} color="coffee" delay={0.1} />
        <StatsCard title="Panier moyen" value={formatPrice(totals.avg)} icon={<TrendingUp size={18} />} color="green" delay={0.15} />
      </div>

      {/* Monthly chart */}
      <div className="bg-black-card border border-anthracite rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-8">
          <Calendar size={16} className="text-gold" />
          <h2 className="text-white font-semibold">Chiffre d'affaires mensuel</h2>
        </div>

        {monthly.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-gray-500">
            Aucune donnée disponible
          </div>
        ) : (
          <div className="flex items-end gap-4 h-48">
            {monthly.map((m, i) => (
              <motion.div
                key={m.month}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex-1 flex flex-col items-center gap-2"
              >
                <span className="text-gray-400 text-xs font-medium">{formatPrice(m.revenue)}</span>
                <div
                  className="w-full bg-gradient-gold rounded-t-lg transition-all duration-500"
                  style={{ height: `${Math.max((m.revenue / maxRevenue) * 160, 8)}px` }}
                />
                <div className="text-center">
                  <p className="text-gray-400 text-xs capitalize leading-tight">
                    {m.month.split(' ')[0].slice(0, 3)}
                  </p>
                  <p className="text-gray-600 text-xs">{m.rides} course{m.rides > 1 ? 's' : ''}{/* eslint-disable-line */}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
