'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { MapPin, Navigation, Calendar, Clock, Users, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useReservationStore } from '@/store/useReservationStore'
import { BookingFormData } from '@/types'

const fieldCls = `w-full bg-black-deep/80 border border-anthracite rounded-lg pl-10 pr-4 py-3
  text-stone-100 placeholder:text-stone-600
  focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20
  transition-all duration-200 text-sm`

export function QuickBookingForm() {
  const router = useRouter()
  const { setFormData } = useReservationStore()
  const { register, handleSubmit } = useForm<Partial<BookingFormData>>()
  const [loading, setLoading] = useState(false)

  const onSubmit = (data: Partial<BookingFormData>) => {
    setLoading(true)
    setFormData(data)
    setTimeout(() => router.push('/reservation'), 400)
  }

  return (
    <div className="bg-black-soft/90 backdrop-blur-lg border border-anthracite rounded-2xl p-6 shadow-dark-lg">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1 h-6 bg-gradient-gold rounded-full" />
        <h2 className="text-stone-100 font-display font-semibold text-lg">Réservation rapide</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Départ */}
        <div className="relative">
          <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gold z-10" />
          <input {...register('departure')} placeholder="Adresse de départ" className={fieldCls} />
        </div>

        {/* Arrivée */}
        <div className="relative">
          <Navigation size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gold z-10" />
          <input {...register('arrival')} placeholder="Adresse d'arrivée" className={fieldCls} />
        </div>

        {/* Date & Heure */}
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gold z-10" />
            <input
              {...register('date')}
              type="date"
              min={new Date().toISOString().split('T')[0]}
              className={fieldCls + ' [color-scheme:dark]'}
            />
          </div>
          <div className="relative">
            <Clock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gold z-10" />
            <input
              {...register('time')}
              type="time"
              className={fieldCls + ' [color-scheme:dark]'}
            />
          </div>
        </div>

        {/* Passagers */}
        <div className="relative">
          <Users size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gold z-10" />
          <select
            {...register('passengers')}
            className={fieldCls + ' appearance-none cursor-pointer'}
          >
            {[1,2,3,4,5,6,7,8].map(n => (
              <option key={n} value={n} className="bg-black-card">
                {n} passager{n > 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </div>

        <Button type="submit" variant="gold" size="lg" loading={loading} className="w-full mt-2 gap-2">
          Calculer le prix
          <ArrowRight size={18} />
        </Button>
      </form>

      <p className="text-stone-600 text-xs text-center mt-4">
        Estimation instantanée · Sans engagement
      </p>
    </div>
  )
}
