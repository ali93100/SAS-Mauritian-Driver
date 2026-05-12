'use client'

import { useEffect, useState } from 'react'
import { Euro, Car, Users, Clock, TrendingUp, Calendar } from 'lucide-react'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { ReservationTable } from '@/components/dashboard/ReservationTable'
import { supabase } from '@/lib/supabase'
import { Reservation, DashboardStats } from '@/types'
import { formatPrice } from '@/lib/pricing'
import { useAuthStore } from '@/store/useAuthStore'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [pendingReservations, setPendingReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    const today = new Date().toISOString().split('T')[0]
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    const [todayRes, weekRes, monthRes, pendingRes, clientsRes] = await Promise.all([
      supabase.from('reservations').select('final_price').eq('date', today).eq('status', 'completed'),
      supabase.from('reservations').select('final_price').gte('date', weekAgo).eq('status', 'completed'),
      supabase.from('reservations').select('final_price').gte('date', monthAgo).eq('status', 'completed'),
      supabase.from('reservations').select('*, client:clients(full_name, email)').eq('status', 'pending').order('created_at', { ascending: false }),
      supabase.from('clients').select('id'),
    ])

    const sumPrices = (data: any[] | null) =>
      data?.reduce((acc, r) => acc + (r.final_price || 0), 0) ?? 0

    setStats({
      today_revenue: sumPrices(todayRes.data),
      week_revenue: sumPrices(weekRes.data),
      month_revenue: sumPrices(monthRes.data),
      today_rides: todayRes.data?.length ?? 0,
      week_rides: weekRes.data?.length ?? 0,
      month_rides: monthRes.data?.length ?? 0,
      pending_reservations: pendingRes.data?.length ?? 0,
      total_clients: clientsRes.data?.length ?? 0,
    })

    setPendingReservations((pendingRes.data as any) || [])
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-white font-bold text-2xl">Tableau de bord</h1>
        <p className="text-gray-500 text-sm mt-1">
          Bonjour{user?.full_name ? `, ${user.full_name}` : ''} · {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="CA du jour"
          value={stats ? formatPrice(stats.today_revenue) : '—'}
          subtitle={`${stats?.today_rides ?? 0} course(s)`}
          icon={<Euro size={18} />}
          color="gold"
          delay={0}
        />
        <StatsCard
          title="CA de la semaine"
          value={stats ? formatPrice(stats.week_revenue) : '—'}
          subtitle={`${stats?.week_rides ?? 0} course(s)`}
          icon={<TrendingUp size={18} />}
          color="green"
          delay={0.05}
        />
        <StatsCard
          title="CA du mois"
          value={stats ? formatPrice(stats.month_revenue) : '—'}
          subtitle={`${stats?.month_rides ?? 0} course(s)`}
          icon={<Car size={18} />}
          color="blue"
          delay={0.1}
        />
        <StatsCard
          title="Total clients"
          value={stats?.total_clients ?? '—'}
          subtitle={`${stats?.pending_reservations ?? 0} en attente`}
          icon={<Users size={18} />}
          color="coffee"
          delay={0.15}
        />
      </div>

      {/* Pending reservations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-white font-semibold text-lg">Réservations en attente</h2>
            {pendingReservations.length > 0 && (
              <span className="px-2 py-0.5 bg-gold/15 text-gold border border-gold/20 rounded-full text-xs font-semibold">
                {pendingReservations.length}
              </span>
            )}
          </div>
        </div>
        <ReservationTable reservations={pendingReservations} onRefresh={fetchData} />
      </div>
    </div>
  )
}
