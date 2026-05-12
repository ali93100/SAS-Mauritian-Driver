'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, QrCode, Gift, TrendingUp, FileText } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Client } from '@/types'
import { formatPrice } from '@/lib/pricing'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { generateQRCode } from '@/lib/qrcode'

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Client | null>(null)
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClients()
  }, [])

  useEffect(() => {
    if (selected) {
      generateQRCode(selected.referral_code).then(setQrDataUrl)
    }
  }, [selected])

  const fetchClients = async () => {
    const { data } = await supabase
      .from('clients')
      .select('*, loyalty(*)')
      .order('total_rides', { ascending: false })
    setClients((data as any) || [])
    setLoading(false)
  }

  const filtered = clients.filter(c =>
    c.full_name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  const getDiscount = (client: Client) => {
    const loyalty = client.loyalty as any
    return loyalty?.current_discount || client.discount_percent || 0
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-white font-bold text-2xl">CRM Clients</h1>
        <p className="text-gray-500 text-sm mt-1">{clients.length} clients enregistrés</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un client..."
          className="w-full max-w-sm bg-black-card border border-anthracite rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-gold transition-all"
        />
      </div>

      {/* Client grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((client, i) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            onClick={() => setSelected(client)}
            className="bg-black-card border border-anthracite rounded-xl p-5 cursor-pointer hover:border-gold/30 hover:shadow-gold transition-all"
          >
            {/* Avatar & Name */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-11 h-11 rounded-xl bg-gradient-gold shadow-gold flex items-center justify-center text-black-deep font-bold text-lg shrink-0">
                {client.full_name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-white font-medium text-sm truncate">{client.full_name}</p>
                <p className="text-gray-500 text-xs truncate">{client.email}</p>
              </div>
              {getDiscount(client) > 0 && (
                <Badge variant="gold" className="ml-auto shrink-0">-{getDiscount(client)}%</Badge>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Courses', value: client.total_rides },
                { label: 'Dépenses', value: formatPrice(client.total_spent) },
                { label: 'Code', value: client.referral_code },
              ].map(({ label, value }) => (
                <div key={label} className="bg-black-deep rounded-lg p-2.5 text-center">
                  <p className="text-white text-xs font-semibold truncate">{String(value)}</p>
                  <p className="text-gray-600 text-xs mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Client detail modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title="Fiche client" size="md">
        {selected && (
          <div className="flex flex-col gap-5">
            {/* Header */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-gold shadow-gold flex items-center justify-center text-black-deep font-bold text-2xl">
                {selected.full_name.charAt(0)}
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">{selected.full_name}</h3>
                <p className="text-gray-400 text-sm">{selected.email}</p>
                {selected.phone && <p className="text-gray-500 text-sm">{selected.phone}</p>}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Courses', value: selected.total_rides, icon: TrendingUp },
                { label: 'Total dépensé', value: formatPrice(selected.total_spent), icon: FileText },
                { label: 'Remise active', value: `${getDiscount(selected)}%`, icon: Gift },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="bg-black-deep border border-anthracite rounded-xl p-4 text-center">
                  <Icon size={14} className="text-gold mx-auto mb-2" />
                  <p className="text-white font-bold text-sm">{value}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Loyalty */}
            {selected.loyalty && (
              <div className="bg-gold/5 border border-gold/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Gift size={14} className="text-gold" />
                  <p className="text-gold text-sm font-medium">Programme fidélité</p>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex-1 h-2 bg-anthracite rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-gold rounded-full transition-all"
                      style={{ width: `${((selected.loyalty as any).rides_since_last_discount / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-gray-400 text-xs">{(selected.loyalty as any).rides_since_last_discount}/5</span>
                </div>
                <p className="text-gray-500 text-xs">
                  {5 - (selected.loyalty as any).rides_since_last_discount} course(s) avant la prochaine remise -10%
                </p>
              </div>
            )}

            {/* QR Code */}
            <div className="bg-black-deep border border-anthracite rounded-xl p-5 flex flex-col items-center gap-3">
              <div className="flex items-center gap-2">
                <QrCode size={14} className="text-gold" />
                <p className="text-gray-300 text-sm font-medium">Code parrainage QR</p>
              </div>
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="QR Code" className="w-32 h-32 rounded-lg" />
              ) : (
                <div className="w-32 h-32 bg-anthracite rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              <p className="text-gold font-mono text-sm font-semibold tracking-widest">{selected.referral_code}</p>
              <p className="text-gray-500 text-xs text-center">
                Partagez ce code pour offrir -10% à vos proches
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
