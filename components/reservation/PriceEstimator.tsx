'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Clock, Euro, Moon, Sun, TrendingDown } from 'lucide-react'
import { PriceCalculation } from '@/types'
import { formatPrice } from '@/lib/pricing'

interface PriceEstimatorProps {
  calc: PriceCalculation | null
  loading?: boolean
}

export function PriceEstimator({ calc, loading }: PriceEstimatorProps) {
  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex items-center justify-center gap-3 py-8"
        >
          <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-400 text-sm">Calcul en cours...</span>
        </motion.div>
      )}

      {!loading && calc && (
        <motion.div
          key="result"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-4"
        >
          {/* Distance & Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-black-deep border border-anthracite rounded-xl p-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center">
                <MapPin size={14} className="text-blue-400" />
              </div>
              <div>
                <p className="text-gray-500 text-xs">Distance</p>
                <p className="text-white font-semibold">{calc.distance_km} km</p>
              </div>
            </div>
            <div className="bg-black-deep border border-anthracite rounded-xl p-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-500/10 border border-purple-500/20 rounded-lg flex items-center justify-center">
                <Clock size={14} className="text-purple-400" />
              </div>
              <div>
                <p className="text-gray-500 text-xs">Durée estimée</p>
                <p className="text-white font-semibold">{calc.duration_min} min</p>
              </div>
            </div>
          </div>

          {/* Price breakdown */}
          <div className="bg-black-deep border border-anthracite rounded-xl p-5">
            <p className="text-gray-400 text-sm font-medium mb-4">Détail tarifaire</p>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Prise en charge</span>
                <span className="text-white">{formatPrice(calc.base)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Distance ({calc.distance_km} km × 1,40 €)</span>
                <span className="text-white">{formatPrice(calc.distance_fee)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Temps ({calc.duration_min} min × 0,20 €)</span>
                <span className="text-white">{formatPrice(calc.time_fee)}</span>
              </div>

              {(calc.is_night || calc.is_sunday) && (
                <div className="pt-3 border-t border-anthracite flex flex-col gap-2">
                  {calc.is_night && (
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-400 flex items-center gap-1.5">
                        <Moon size={12} /> Supplément nuit (+20%)
                      </span>
                      <span className="text-blue-400">+{formatPrice(calc.night_surcharge)}</span>
                    </div>
                  )}
                  {calc.is_sunday && (
                    <div className="flex justify-between text-sm">
                      <span className="text-orange-400 flex items-center gap-1.5">
                        <Sun size={12} /> Supplément dimanche (+20%)
                      </span>
                      <span className="text-orange-400">+{formatPrice(calc.sunday_surcharge)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Total */}
          <div className="bg-gradient-gold rounded-xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Euro size={20} className="text-black-deep" />
              <span className="text-black-deep font-bold text-lg">Total estimé</span>
            </div>
            <span className="text-black-deep font-bold text-2xl">{formatPrice(calc.total)}</span>
          </div>

          {/* Loyalty note */}
          <div className="flex items-center gap-2 p-3 bg-gold/5 border border-gold/20 rounded-lg">
            <TrendingDown size={14} className="text-gold shrink-0" />
            <p className="text-gold text-xs">
              Programme fidélité : -10% toutes les 5 courses
            </p>
          </div>
        </motion.div>
      )}

      {!loading && !calc && (
        <motion.div
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12 text-center"
        >
          <div className="w-16 h-16 bg-anthracite rounded-full flex items-center justify-center mb-4">
            <Euro size={24} className="text-gray-600" />
          </div>
          <p className="text-gray-500 text-sm">Remplissez le formulaire pour obtenir une estimation</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
