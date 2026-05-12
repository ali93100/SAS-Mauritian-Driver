'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Availability } from '@/types'

// Import FullCalendar sans SSR — évite "cannot be invoked without new"
const FullCalendar = dynamic(
  () => import('./FullCalendarWrapper'),
  { ssr: false, loading: () => <CalendarSkeleton /> }
)

function CalendarSkeleton() {
  return (
    <div className="flex items-center justify-center h-[520px]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        <p className="text-stone-500 text-sm">Chargement du calendrier...</p>
      </div>
    </div>
  )
}

interface CalendarEvent {
  id: string
  title: string
  date: string
  classNames: string[]
}

export function AvailabilityCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([])

  useEffect(() => {
    fetchAvailabilities()
  }, [])

  const fetchAvailabilities = async () => {
    try {
      const { data } = await supabase
        .from('availability')
        .select('*')
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true })

      if (data) {
        setEvents(data.map((av: Availability) => ({
          id: av.id,
          title: av.is_available ? 'Disponible' : 'Indisponible',
          date: av.date,
          classNames: [av.is_available ? 'fc-event-available' : 'fc-event-unavailable'],
        })))
      }
    } catch { /* Supabase non configuré */ }
  }

  return (
    <div className="bg-black-card border border-anthracite rounded-2xl p-6 lg:p-8">
      {/* Légende */}
      <div className="flex items-center gap-6 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500/60 border border-green-500/40" />
          <span className="text-stone-400 text-sm">Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/60 border border-red-500/40" />
          <span className="text-stone-400 text-sm">Indisponible</span>
        </div>
      </div>

      {/* Calendrier */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <FullCalendar events={events} />
      </motion.div>

      {/* Note */}
      <div className="mt-6 p-4 bg-gold/5 border border-gold/20 rounded-xl flex items-start gap-3">
        <Check size={16} className="text-gold shrink-0 mt-0.5" />
        <p className="text-stone-300 text-sm">
          Pour réserver sur une date disponible, utilisez le{' '}
          <a href="/reservation" className="text-gold hover:underline font-medium">
            formulaire de réservation
          </a>
          . Ahmad confirmera rapidement votre demande.
        </p>
      </div>
    </div>
  )
}
