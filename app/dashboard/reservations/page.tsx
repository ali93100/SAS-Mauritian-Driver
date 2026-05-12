'use client'

import { useEffect, useState } from 'react'
import { Filter } from 'lucide-react'
import { ReservationTable } from '@/components/dashboard/ReservationTable'
import { supabase } from '@/lib/supabase'
import { Reservation } from '@/types'

const STATUSES = [
  { value: 'all', label: 'Toutes' },
  { value: 'pending', label: 'En attente' },
  { value: 'confirmed', label: 'Confirmées' },
  { value: 'completed', label: 'Terminées' },
  { value: 'refused', label: 'Refusées' },
  { value: 'cancelled', label: 'Annulées' },
]

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  const fetchReservations = async () => {
    let query = supabase
      .from('reservations')
      .select('*, client:clients(full_name, email, phone)')
      .order('created_at', { ascending: false })

    if (filter !== 'all') query = query.eq('status', filter)

    const { data } = await query
    setReservations((data as any) || [])
    setLoading(false)
  }

  useEffect(() => { fetchReservations() }, [filter])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-white font-bold text-2xl">Réservations</h1>
        <p className="text-gray-500 text-sm mt-1">Gérez toutes vos demandes de réservation</p>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter size={14} className="text-gray-500" />
        {STATUSES.map((s) => (
          <button
            key={s.value}
            onClick={() => setFilter(s.value)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              filter === s.value
                ? 'bg-gold/15 text-gold border border-gold/30'
                : 'bg-anthracite text-gray-400 hover:text-white border border-anthracite-light'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <ReservationTable reservations={reservations} onRefresh={fetchReservations} />
    </div>
  )
}
