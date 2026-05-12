'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ChevronDown, Star, Shield, Clock, MapPin, Phone } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { QuickBookingForm } from './QuickBookingForm'

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1549317661-bd32c8ce0729?w=1920&q=90')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-gradient-to-r from-black-deep/90 via-black/50 to-transparent" />
      </div>

      {/* Subtle golden glow */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ opacity: [0.04, 0.1, 0.04] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-1/3 right-1/3 w-80 h-80 rounded-full bg-gold blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text content */}
          <div>
            {/* Location badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm border border-gold/20 rounded-full text-xs text-gold font-medium mb-8"
            >
              <MapPin size={12} />
              French Riviera — Côte d&apos;Azur
            </motion.div>

            {/* Main heading — personal */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <p className="text-gray-400 text-sm font-medium tracking-widest uppercase mb-3">
                Votre chauffeur privé
              </p>
              <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl font-bold text-white leading-[0.95] mb-2">
                Ahmad
              </h1>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-gold mb-6 leading-tight">
                Abdool Wahed
              </h2>
            </motion.div>

            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-8"
            >
              <p className="text-gray-300 text-lg leading-relaxed max-w-md">
                Service haut de gamme pour particuliers & entreprises
              </p>
              <div className="flex items-center gap-4 mt-4">
                {['Ponctualité', 'Discrétion', 'Confort'].map((word, i) => (
                  <div key={word} className="flex items-center gap-4">
                    <span className="text-gold/80 font-semibold tracking-wider text-xs uppercase">{word}</span>
                    {i < 2 && <span className="w-1 h-1 rounded-full bg-gold/40" />}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-3 mb-10"
            >
              {[
                { icon: Star, label: '4.9 ★ · +500 courses' },
                { icon: Shield, label: 'Carte VTC certifiée' },
                { icon: Clock, label: '10 ans d\'expérience' },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-sm border border-white/10 rounded-full text-xs text-gray-300 font-medium"
                >
                  <Icon size={11} className="text-gold" />
                  {label}
                </span>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/reservation">
                <Button variant="gold" size="lg" className="w-full sm:w-auto">
                  Réserver une course
                </Button>
              </Link>
              <a href="tel:+33620037810">
                <Button variant="ghost" size="lg" className="w-full sm:w-auto gap-2">
                  <Phone size={16} />
                  +33 6 20 03 78 10
                </Button>
              </a>
            </motion.div>
          </div>

          {/* Quick booking form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <QuickBookingForm />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <ChevronDown size={24} className="text-gold/50" />
      </motion.div>
    </section>
  )
}
