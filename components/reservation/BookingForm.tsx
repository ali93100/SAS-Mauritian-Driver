'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { MapPin, Navigation, Calendar, Clock, Users, Briefcase, Car, FileText, Send } from 'lucide-react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { PriceEstimator } from './PriceEstimator'
import { useReservationStore } from '@/store/useReservationStore'
import { BookingFormData } from '@/types'
import { supabase } from '@/lib/supabase'
import { estimateDistanceAndDuration, calculatePrice } from '@/lib/pricing'

const schema = z.object({
  departure: z.string().min(3, 'Adresse de départ requise'),
  arrival: z.string().min(3, 'Adresse d\'arrivée requise'),
  date: z.string().min(1, 'Date requise'),
  time: z.string().min(1, 'Heure requise'),
  passengers: z.coerce.number().min(1).max(8),
  luggage: z.coerce.number().min(0),
  type: z.enum(['course_simple', 'mise_a_disposition']),
  notes: z.string().optional(),
})

export function BookingForm() {
  const { priceCalc, setFormData, calculateEstimate } = useReservationStore()
  const [submitted, setSubmitted] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<BookingFormData>({
    resolver: zodResolver(schema),
    defaultValues: { passengers: 1, luggage: 0, type: 'course_simple' },
  })

  const watched = watch()

  useEffect(() => {
    if (watched.departure && watched.arrival && watched.date && watched.time) {
      setIsCalculating(true)
      const timer = setTimeout(() => {
        setFormData(watched)
        calculateEstimate()
        setIsCalculating(false)
      }, 600)
      return () => clearTimeout(timer)
    }
  }, [watched.departure, watched.arrival, watched.date, watched.time])

  const onSubmit = async (data: BookingFormData) => {
    setLoading(true)
    try {
      const { distance, duration } = estimateDistanceAndDuration(data.departure, data.arrival)
      const calc = calculatePrice(distance, duration, data.date, data.time)

      const { data: clientData } = await supabase
        .from('clients')
        .select('id')
        .limit(1)
        .single()

      if (!clientData) {
        alert('Veuillez vous connecter pour effectuer une réservation.')
        setLoading(false)
        return
      }

      const { error } = await supabase.from('reservations').insert({
        client_id: clientData.id,
        departure: data.departure,
        arrival: data.arrival,
        date: data.date,
        time: data.time,
        passengers: data.passengers,
        luggage: data.luggage,
        type: data.type,
        notes: data.notes,
        estimated_distance_km: distance,
        estimated_duration_min: duration,
        base_price: calc.subtotal,
        final_price: calc.total,
        night_surcharge: calc.is_night,
        sunday_surcharge: calc.is_sunday,
        status: 'pending',
      })

      if (!error) setSubmitted(true)
      else alert('Erreur lors de la réservation. Veuillez réessayer.')
    } catch {
      alert('Erreur de connexion. Vérifiez votre configuration Supabase.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <div className="w-20 h-20 bg-gradient-gold rounded-full flex items-center justify-center mb-6 shadow-gold">
          <Send size={32} className="text-black-deep" />
        </div>
        <h2 className="text-white font-bold text-2xl mb-3">Demande envoyée !</h2>
        <p className="text-gray-400 max-w-sm">
          Votre demande de réservation a été transmise. Le chauffeur vous confirmera dans les plus brefs délais.
        </p>
        <Button
          variant="gold"
          className="mt-8"
          onClick={() => setSubmitted(false)}
        >
          Nouvelle réservation
        </Button>
      </motion.div>
    )
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Form */}
      <div className="bg-black-card border border-anthracite rounded-2xl p-8">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-1 h-6 bg-gradient-gold rounded-full" />
          <h2 className="text-white font-semibold text-xl">Détails de la course</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* Route */}
          <div className="flex flex-col gap-4">
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gold z-10" />
              <input
                {...register('departure')}
                placeholder="Adresse de départ"
                className="w-full bg-black-deep border border-anthracite rounded-lg pl-10 pr-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all text-sm"
              />
              {errors.departure && <p className="text-red-400 text-xs mt-1">{errors.departure.message}</p>}
            </div>

            <div className="relative ml-4">
              <div className="absolute left-[-16px] top-1/2 -translate-y-1/2 w-px h-8 bg-anthracite" />
              <Navigation size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gold z-10" />
              <input
                {...register('arrival')}
                placeholder="Adresse d'arrivée"
                className="w-full bg-black-deep border border-anthracite rounded-lg pl-10 pr-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all text-sm"
              />
              {errors.arrival && <p className="text-red-400 text-xs mt-1">{errors.arrival.message}</p>}
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gold z-10" />
              <input
                {...register('date')}
                type="date"
                min={new Date().toISOString().split('T')[0]}
                className="w-full bg-black-deep border border-anthracite rounded-lg pl-10 pr-3 py-3.5 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all text-sm [color-scheme:dark]"
              />
            </div>
            <div className="relative">
              <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gold z-10" />
              <input
                {...register('time')}
                type="time"
                className="w-full bg-black-deep border border-anthracite rounded-lg pl-10 pr-3 py-3.5 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all text-sm [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Passengers & Luggage */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gold z-10" />
              <select
                {...register('passengers')}
                className="w-full bg-black-deep border border-anthracite rounded-lg pl-10 pr-4 py-3.5 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all text-sm appearance-none cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                  <option key={n} value={n} className="bg-black-card">{n} passager{n > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <div className="relative">
              <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gold z-10" />
              <select
                {...register('luggage')}
                className="w-full bg-black-deep border border-anthracite rounded-lg pl-10 pr-4 py-3.5 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all text-sm appearance-none cursor-pointer"
              >
                {[0, 1, 2, 3, 4, 5].map(n => (
                  <option key={n} value={n} className="bg-black-card">{n} bagage{n > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Type */}
          <div>
            <p className="text-sm text-gray-400 mb-3 font-medium">Type de service</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'course_simple', label: 'Course simple', icon: Car },
                { value: 'mise_a_disposition', label: 'Mise à disposition', icon: Clock },
              ].map(({ value, label, icon: Icon }) => (
                <label
                  key={value}
                  className="relative cursor-pointer"
                >
                  <input
                    {...register('type')}
                    type="radio"
                    value={value}
                    className="sr-only peer"
                  />
                  <div className="flex items-center gap-3 p-4 bg-black-deep border border-anthracite rounded-xl peer-checked:border-gold peer-checked:bg-gold/5 transition-all">
                    <Icon size={16} className="text-gold" />
                    <span className="text-sm text-gray-300 font-medium">{label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="relative">
            <FileText size={16} className="absolute left-3 top-4 text-gold z-10" />
            <textarea
              {...register('notes')}
              placeholder="Informations complémentaires (optionnel)"
              rows={3}
              className="w-full bg-black-deep border border-anthracite rounded-lg pl-10 pr-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all text-sm resize-none"
            />
          </div>

          <Button
            type="submit"
            variant="gold"
            size="lg"
            loading={loading}
            className="w-full mt-2"
          >
            Envoyer la demande de réservation
          </Button>
        </form>
      </div>

      {/* Price estimator */}
      <div className="bg-black-card border border-anthracite rounded-2xl p-8">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-1 h-6 bg-gradient-gold rounded-full" />
          <h2 className="text-white font-semibold text-xl">Estimation du prix</h2>
        </div>
        <PriceEstimator calc={priceCalc} loading={isCalculating} />
      </div>
    </div>
  )
}
