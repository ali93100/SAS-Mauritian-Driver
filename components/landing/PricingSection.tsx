'use client'

import { motion } from 'framer-motion'
import { Check, Moon, Sun } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export function PricingSection() {
  return (
    <section className="py-24 bg-black-deep">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-gold text-sm font-semibold tracking-widest uppercase mb-4">Tarification</p>
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-stone-100 mb-6">
            Prix clairs & transparents
          </h2>
          <p className="text-stone-400 text-lg max-w-2xl mx-auto">
            Calculez instantanément le coût de votre trajet. Aucune surprise.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Base pricing */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-black-card border border-anthracite rounded-2xl p-8"
          >
            <h3 className="text-gold font-display font-semibold text-xl mb-6">Tarif de base</h3>
            <ul className="flex flex-col gap-1">
              {[
                { label: 'Prise en charge', value: '3,00 €' },
                { label: 'Par kilomètre', value: '1,40 €' },
                { label: 'Par minute', value: '0,20 €' },
              ].map((item) => (
                <li key={item.label}
                    className="flex items-center justify-between py-3.5 border-b border-anthracite/60 last:border-0">
                  <span className="text-stone-400 text-sm">{item.label}</span>
                  <span className="text-stone-100 font-semibold">{item.value}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Supplements */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-black-card border border-anthracite rounded-2xl p-8"
          >
            <h3 className="text-gold font-display font-semibold text-xl mb-6">Suppléments</h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-4 py-3 border-b border-anthracite/60">
                <div className="w-9 h-9 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <Moon size={14} className="text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-stone-300 text-sm font-medium">Supplément nuit</p>
                  <p className="text-stone-500 text-xs mt-0.5">22h00 — 06h00</p>
                </div>
                <span className="text-gold font-semibold">+20%</span>
              </li>
              <li className="flex items-start gap-4 py-3">
                <div className="w-9 h-9 bg-coffee/15 border border-coffee/30 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <Sun size={14} className="text-gold-light" />
                </div>
                <div className="flex-1">
                  <p className="text-stone-300 text-sm font-medium">Supplément dimanche</p>
                  <p className="text-stone-500 text-xs mt-0.5">Tous les dimanches</p>
                </div>
                <span className="text-gold font-semibold">+20%</span>
              </li>
            </ul>

            {/* Loyalty note */}
            <div className="mt-5 p-4 bg-gold/6 border border-gold/20 rounded-xl">
              <p className="text-gold text-sm font-medium flex items-center gap-2">
                <Check size={14} />
                Programme fidélité : -10% toutes les 5 courses
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link href="/reservation">
            <Button variant="gold" size="lg">Estimer mon trajet</Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
