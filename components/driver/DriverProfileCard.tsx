'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, CreditCard, Shield, Star, CheckCircle, Calendar, Quote } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { DriverProfile } from '@/types'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

const defaultDriver: DriverProfile = {
  id: '1',
  full_name: 'Ahmad Abdool Wahed',
  photo_url: undefined,
  phone: '+33 6 20 03 78 10',
  email: 'mauritiandriver@gmail.com',
  zone: 'French Riviera — Côte d\'Azur',
  siret: '000 000 000 00000',
  vtc_card_number: 'VTC-2024-001234',
  vtc_card_expiry: '2026-12-31',
  bio: 'Né à l\'Île Maurice, installé sur la French Riviera, je mets ma passion du service à votre disposition depuis plus de 10 ans. Ponctualité, discrétion et le sourire — c\'est ma façon de vous accueillir à chaque trajet. Que ce soit pour un aéroport, une soirée ou un déplacement professionnel, je m\'adapte à vos besoins avec le plus grand soin.',
}

export function DriverProfileCard() {
  const [driver, setDriver] = useState<DriverProfile>(defaultDriver)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await supabase.from('driver_profile').select('*').single()
        if (data) setDriver(data)
      } catch { /* use default */ }
    }
    fetchProfile()
  }, [])

  return (
    <div className="flex flex-col gap-6">
      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black-card border border-anthracite rounded-2xl overflow-hidden"
      >
        {/* Header banner */}
        <div className="h-36 bg-gradient-to-br from-black-deep via-anthracite/80 to-black-deep relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-3 right-12 w-40 h-40 rounded-full border border-gold/10" />
            <div className="absolute top-8 right-24 w-24 h-24 rounded-full border border-gold/15" />
            <div className="absolute -bottom-4 left-16 w-28 h-28 rounded-full border border-gold/8" />
          </div>
          <div className="absolute bottom-4 right-6 text-right">
            <p className="text-gold/40 text-xs tracking-widest uppercase font-medium">French Riviera</p>
            <p className="text-white/20 text-xs">Côte d&apos;Azur</p>
          </div>
        </div>

        <div className="px-8 pb-8">
          {/* Avatar + name */}
          <div className="flex items-end gap-6 -mt-14 mb-8">
            <div className="w-28 h-28 rounded-2xl bg-gradient-gold shadow-gold-lg flex items-center justify-center border-4 border-black-card shrink-0">
              <span className="text-4xl font-bold text-black-deep font-display">A</span>
            </div>
            <div className="pb-2 min-w-0">
              <h2 className="text-white font-display font-bold text-3xl leading-tight">Ahmad</h2>
              <p className="text-gold font-semibold text-lg tracking-wide">Abdool Wahed</p>
              <div className="flex items-center gap-2 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} className="text-gold fill-gold" />
                ))}
                <span className="text-gray-500 text-sm ml-1">Chauffeur VTC certifié</span>
              </div>
            </div>
          </div>

          {/* Personal quote */}
          <div className="flex gap-3 mb-8 p-5 bg-black-deep rounded-xl border-l-2 border-gold">
            <Quote size={18} className="text-gold shrink-0 mt-0.5" />
            <p className="text-gray-300 text-sm leading-relaxed italic">
              {driver.bio}
            </p>
          </div>

          {/* Info grid */}
          <div className="grid md:grid-cols-2 gap-3">
            {[
              { icon: Phone, label: 'Téléphone', value: driver.phone, href: `tel:${driver.phone.replace(/\s/g, '')}` },
              { icon: Mail, label: 'Email', value: driver.email, href: `mailto:${driver.email}` },
              { icon: MapPin, label: 'Zone d\'activité', value: driver.zone, href: undefined },
              { icon: Shield, label: 'SIRET', value: driver.siret, href: undefined },
            ].map(({ icon: Icon, label, value, href }) => (
              <div
                key={label}
                className="flex items-center gap-4 p-4 bg-black-deep border border-anthracite rounded-xl hover:border-gold/20 transition-colors group"
              >
                <div className="w-10 h-10 bg-gold/10 border border-gold/20 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-gold/15 transition-colors">
                  <Icon size={16} className="text-gold" />
                </div>
                <div className="min-w-0">
                  <p className="text-gray-500 text-xs">{label}</p>
                  {href ? (
                    <a href={href} className="text-white text-sm font-medium mt-0.5 hover:text-gold transition-colors block truncate">
                      {value}
                    </a>
                  ) : (
                    <p className="text-white text-sm font-medium mt-0.5 truncate">{value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* VTC Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-black-card border border-gold/25 rounded-2xl p-6 shadow-gold"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-gradient-gold rounded-lg flex items-center justify-center shadow-gold">
            <CreditCard size={18} className="text-black-deep" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Carte Professionnelle VTC</h3>
            <p className="text-gray-500 text-xs">Délivrée par l&apos;autorité préfectorale compétente</p>
          </div>
          <CheckCircle size={20} className="text-green-400 ml-auto" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-black-deep border border-anthracite rounded-xl p-4">
            <p className="text-gray-500 text-xs mb-1">Numéro de carte</p>
            <p className="text-gold font-mono font-semibold text-sm">{driver.vtc_card_number}</p>
          </div>
          <div className="bg-black-deep border border-anthracite rounded-xl p-4">
            <p className="text-gray-500 text-xs mb-1">Validité</p>
            <p className="text-white font-medium text-sm flex items-center gap-1.5">
              <Calendar size={12} className="text-gold" />
              {driver.vtc_card_expiry
                ? new Date(driver.vtc_card_expiry).toLocaleDateString('fr-FR')
                : 'En cours de validité'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-4"
      >
        {[
          { label: '+500', sublabel: 'courses effectuées' },
          { label: '10 ans', sublabel: 'd\'expérience' },
          { label: '4.9 ★', sublabel: 'note moyenne' },
        ].map(({ label, sublabel }) => (
          <div key={label} className="bg-black-card border border-anthracite rounded-xl p-5 text-center hover:border-gold/20 transition-colors">
            <p className="text-gold font-display font-bold text-2xl">{label}</p>
            <p className="text-gray-500 text-xs mt-1">{sublabel}</p>
          </div>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 gap-3"
      >
        <a href="tel:+33620037810">
          <Button variant="ghost" size="lg" className="w-full gap-2">
            <Phone size={16} />
            Appeler Ahmad
          </Button>
        </a>
        <Link href="/reservation">
          <Button variant="gold" size="lg" className="w-full">
            Réserver maintenant
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}
