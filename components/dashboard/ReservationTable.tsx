'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, X, Eye, FileText, MoreHorizontal } from 'lucide-react'
import { Reservation } from '@/types'
import { StatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { supabase } from '@/lib/supabase'
import { formatPrice } from '@/lib/pricing'

interface ReservationTableProps {
  reservations: Reservation[]
  onRefresh: () => void
}

export function ReservationTable({ reservations, onRefresh }: ReservationTableProps) {
  const [selected, setSelected] = useState<Reservation | null>(null)
  const [loading, setLoading] = useState<string | null>(null)

  const updateStatus = async (id: string, status: string) => {
    setLoading(id + status)
    await supabase.from('reservations').update({ status }).eq('id', id)
    setLoading(null)
    setSelected(null)
    onRefresh()
  }

  const formatDateTime = (date: string, time: string) => {
    return `${new Date(date).toLocaleDateString('fr-FR')} à ${time.slice(0, 5)}`
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-anthracite">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-anthracite bg-black-deep">
              <th className="px-4 py-3 text-left text-gray-400 font-medium">Client</th>
              <th className="px-4 py-3 text-left text-gray-400 font-medium hidden md:table-cell">Trajet</th>
              <th className="px-4 py-3 text-left text-gray-400 font-medium hidden lg:table-cell">Date</th>
              <th className="px-4 py-3 text-left text-gray-400 font-medium">Prix</th>
              <th className="px-4 py-3 text-left text-gray-400 font-medium">Statut</th>
              <th className="px-4 py-3 text-right text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                  Aucune réservation
                </td>
              </tr>
            )}
            {reservations.map((res, i) => (
              <motion.tr
                key={res.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="border-b border-anthracite/50 hover:bg-anthracite/20 transition-colors"
              >
                <td className="px-4 py-3">
                  <p className="text-white font-medium text-sm">
                    {res.client?.full_name || 'Client'}
                  </p>
                  <p className="text-gray-500 text-xs">{res.client?.email}</p>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <p className="text-gray-300 text-xs truncate max-w-48">
                    {res.departure.split(',')[0]}
                  </p>
                  <p className="text-gray-500 text-xs">→ {res.arrival.split(',')[0]}</p>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell text-gray-300 text-xs">
                  {formatDateTime(res.date, res.time)}
                </td>
                <td className="px-4 py-3 text-gold font-semibold text-sm">
                  {formatPrice(res.final_price)}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={res.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {res.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateStatus(res.id, 'confirmed')}
                          disabled={loading === res.id + 'confirmed'}
                          className="w-7 h-7 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center justify-center text-green-400 hover:bg-green-500/20 transition-all"
                        >
                          <Check size={12} />
                        </button>
                        <button
                          onClick={() => updateStatus(res.id, 'refused')}
                          disabled={loading === res.id + 'refused'}
                          className="w-7 h-7 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-all"
                        >
                          <X size={12} />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setSelected(res)}
                      className="w-7 h-7 bg-anthracite rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all"
                    >
                      <Eye size={12} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Détail de la réservation"
        size="lg"
      >
        {selected && (
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Départ', value: selected.departure },
                { label: 'Arrivée', value: selected.arrival },
                { label: 'Date', value: new Date(selected.date).toLocaleDateString('fr-FR') },
                { label: 'Heure', value: selected.time.slice(0, 5) },
                { label: 'Passagers', value: selected.passengers },
                { label: 'Bagages', value: selected.luggage },
                { label: 'Type', value: selected.type === 'course_simple' ? 'Course simple' : 'Mise à disposition' },
                { label: 'Distance', value: `${selected.estimated_distance_km} km` },
              ].map(({ label, value }) => (
                <div key={label} className="bg-black-deep rounded-lg p-3">
                  <p className="text-gray-500 text-xs">{label}</p>
                  <p className="text-white text-sm font-medium mt-0.5">{String(value)}</p>
                </div>
              ))}
            </div>

            {selected.notes && (
              <div className="bg-black-deep rounded-lg p-4">
                <p className="text-gray-500 text-xs mb-1">Notes</p>
                <p className="text-gray-300 text-sm">{selected.notes}</p>
              </div>
            )}

            <div className="flex items-center justify-between p-4 bg-gold/5 border border-gold/20 rounded-xl">
              <span className="text-gray-300 font-medium">Prix total</span>
              <span className="text-gold font-bold text-xl">{formatPrice(selected.final_price)}</span>
            </div>

            {selected.status === 'pending' && (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10"
                  onClick={() => updateStatus(selected.id, 'refused')}
                >
                  Refuser
                </Button>
                <Button
                  variant="gold"
                  className="flex-1"
                  onClick={() => updateStatus(selected.id, 'confirmed')}
                >
                  Confirmer
                </Button>
              </div>
            )}
            {selected.status === 'confirmed' && (
              <Button
                variant="gold"
                onClick={() => updateStatus(selected.id, 'completed')}
              >
                Marquer comme terminée
              </Button>
            )}
          </div>
        )}
      </Modal>
    </>
  )
}
