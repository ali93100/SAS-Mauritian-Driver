'use client'

import { motion } from 'framer-motion'
import { Quote, Phone, MapPin } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'

export function AboutSection() {
  return (
    <section className="py-24 bg-black-deep">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Visual side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="bg-black-card border border-anthracite rounded-3xl p-10 relative overflow-hidden">
              {/* Warm Coffee glow */}
              <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-coffee/10 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-gold/6 blur-2xl pointer-events-none" />

              {/* Subtle rings */}
              <div className="absolute -top-6 -right-6 w-44 h-44 rounded-full border border-gold/8" />
              <div className="absolute -top-2 -right-2 w-28 h-28 rounded-full border border-gold/12" />

              {/* Logo */}
              <div className="mb-6 relative z-10">
                <Logo size={110} />
              </div>

              <h3 className="font-display font-bold text-stone-100 text-4xl mb-1 relative z-10">Ahmad</h3>
              <p className="text-gold font-semibold text-xl mb-6 tracking-wide relative z-10">Abdool Wahed</p>

              <div className="flex gap-3 relative z-10">
                <Quote size={20} className="text-gold/40 shrink-0 mt-1" />
                <p className="text-stone-400 text-sm leading-relaxed">
                  Né à l&apos;Île Maurice, je vis et travaille sur la French Riviera depuis des années.
                  Chaque trajet est une occasion de vous offrir le meilleur de moi-même.
                </p>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 mt-8 p-3.5 bg-black-deep rounded-xl border border-anthracite relative z-10">
                <MapPin size={14} className="text-gold" />
                <span className="text-stone-300 text-sm font-medium">French Riviera — Côte d&apos;Azur</span>
              </div>
            </div>

            {/* Floating stat cards — Antique Brass accent */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3.5, repeat: Infinity }}
              className="absolute -bottom-5 -left-5 bg-black-card border border-gold/25 rounded-2xl p-4 shadow-gold"
            >
              <p className="text-gold font-display font-bold text-2xl">10 ans</p>
              <p className="text-stone-500 text-xs mt-0.5">d&apos;expérience</p>
            </motion.div>

            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              className="absolute -top-5 -right-3 bg-black-card border border-gold/25 rounded-2xl p-4 shadow-gold"
            >
              <p className="text-gold font-display font-bold text-2xl">4.9 ★</p>
              <p className="text-stone-500 text-xs mt-0.5">note clients</p>
            </motion.div>
          </motion.div>

          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <p className="text-gold text-sm font-semibold tracking-widest uppercase mb-4">À propos</p>
            <h2 className="font-display font-bold text-stone-100 text-4xl lg:text-5xl leading-tight mb-6">
              Votre chauffeur,<br />
              <span className="text-transparent bg-clip-text bg-gradient-gold">
                une personne de confiance
              </span>
            </h2>

            <div className="flex flex-col gap-5 text-stone-400 text-[15px] leading-relaxed mb-10">
              <p>
                Originaire de l&apos;Île Maurice, j&apos;ai fait de la French Riviera mon terrain professionnel.
                Chaque course est une responsabilité — celle de vous amener à destination
                en sécurité, dans les délais, avec le sourire.
              </p>
              <p>
                Particuliers, hommes d&apos;affaires, familles en vacances ou artistes de passage
                sur la Côte d&apos;Azur — je m&apos;adapte à chaque profil avec discrétion et professionnalisme.
              </p>
              <p>
                Disponible 7j/7, je réponds personnellement à chaque demande.
                Appelez-moi directement ou réservez en ligne.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="tel:+33620037810">
                <Button variant="gold" size="lg" className="gap-2 w-full sm:w-auto">
                  <Phone size={16} />
                  Appeler Ahmad
                </Button>
              </a>
              <Link href="/chauffeur">
                <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                  Voir mon profil
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
