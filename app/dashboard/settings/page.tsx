'use client'

import { useEffect, useState } from 'react'
import { Save, Camera } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { supabase } from '@/lib/supabase'

export default function SettingsPage() {
  const [form, setForm] = useState({
    full_name: 'Ahmad Abdool Wahed',
    phone: '+33 6 20 03 78 10',
    email: 'mauritiandriver@gmail.com',
    zone: 'French Riviera — Côte d\'Azur',
    siret: '',
    vtc_card_number: '',
    vtc_card_expiry: '',
    bio: '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase.from('driver_profile').select('*').single().then(({ data }) => {
      if (data) setForm({ ...data, vtc_card_expiry: data.vtc_card_expiry || '' })
    })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    await supabase.from('driver_profile').upsert(form)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const labelCls = 'text-gray-400 text-xs mb-1.5 block'
  const inputCls = 'w-full bg-black-deep border border-anthracite rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all [color-scheme:dark]'

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-white font-bold text-2xl">Paramètres</h1>
        <p className="text-gray-500 text-sm mt-1">Gérez votre profil chauffeur</p>
      </div>

      <div className="bg-black-card border border-anthracite rounded-2xl p-6 flex flex-col gap-5">
        <h2 className="text-white font-semibold">Informations personnelles</h2>

        <div className="grid md:grid-cols-2 gap-4">
          {[
            { key: 'full_name', label: 'Nom complet', type: 'text', placeholder: 'Prénom Nom' },
            { key: 'phone', label: 'Téléphone', type: 'tel', placeholder: '+230 00 000 000' },
            { key: 'email', label: 'Email', type: 'email', placeholder: 'contact@example.fr' },
            { key: 'zone', label: "Zone d'activité", type: 'text', placeholder: 'Île Maurice & Métropole' },
            { key: 'siret', label: 'SIRET', type: 'text', placeholder: '000 000 000 00000' },
            { key: 'vtc_card_number', label: 'Carte VTC n°', type: 'text', placeholder: 'VTC-2024-000000' },
            { key: 'vtc_card_expiry', label: 'Expiration carte VTC', type: 'date', placeholder: '' },
          ].map(({ key, label, type, placeholder }) => (
            <div key={key}>
              <label className={labelCls}>{label}</label>
              <input
                type={type}
                placeholder={placeholder}
                className={inputCls}
                value={(form as any)[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              />
            </div>
          ))}
        </div>

        <div>
          <label className={labelCls}>Biographie</label>
          <textarea
            rows={4}
            className={inputCls + ' resize-none'}
            placeholder="Décrivez votre expérience et votre approche du service..."
            value={form.bio}
            onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
          />
        </div>

        <Button
          variant={saved ? 'outline' : 'gold'}
          loading={saving}
          onClick={handleSave}
          className="self-start"
        >
          <Save size={16} />
          {saved ? 'Enregistré !' : 'Sauvegarder'}
        </Button>
      </div>
    </div>
  )
}
