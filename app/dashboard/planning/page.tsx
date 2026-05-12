'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { supabase } from '@/lib/supabase'
import { Availability } from '@/types'

const PlanningCalendar = dynamic(
  () => import('@/components/calendar/PlanningCalendarWrapper'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-[580px]">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    ),
  }
)

export default function PlanningPage() {
  const [events, setEvents] = useState<any[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({
    date: '', start_time: '08:00', end_time: '20:00', is_available: true, notes: '',
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchAvailabilities() }, [])

  const fetchAvailabilities = async () => {
    try {
      const { data } = await supabase.from('availability').select('*').order('date')
      if (data) {
        setEvents(data.map((av: Availability) => ({
          id: av.id,
          title: av.is_available
            ? `✓ Disponible (${av.start_time.slice(0,5)}–${av.end_time.slice(0,5)})`
            : '✗ Indisponible',
          date: av.date,
          classNames: [av.is_available ? 'fc-event-available' : 'fc-event-unavailable'],
        })))
      }
    } catch { /* Supabase non configuré */ }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await supabase.from('availability').insert(form)
    } catch { /* Supabase non configuré */ }
    setSaving(false)
    setModalOpen(false)
    setForm({ date: '', start_time: '08:00', end_time: '20:00', is_available: true, notes: '' })
    fetchAvailabilities()
  }

  const fieldCls = 'w-full bg-black-deep border border-anthracite rounded-lg px-3 py-2.5 text-stone-100 text-sm focus:outline-none focus:border-gold transition-all [color-scheme:dark]'
  const labelCls = 'text-stone-400 text-xs mb-1.5 block'

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-stone-100 font-display font-bold text-2xl">Planning</h1>
          <p className="text-stone-500 text-sm mt-1">Gérez vos disponibilités</p>
        </div>
        <Button variant="gold" size="sm" onClick={() => setModalOpen(true)}>
          <Plus size={16} />
          Ajouter
        </Button>
      </div>

      <div className="bg-black-card border border-anthracite rounded-2xl p-6">
        <PlanningCalendar events={events} />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Ajouter une disponibilité">
        <div className="flex flex-col gap-4">
          <div>
            <label className={labelCls}>Date</label>
            <input type="date" className={fieldCls} value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Heure de début</label>
              <input type="time" className={fieldCls} value={form.start_time}
                onChange={e => setForm(f => ({ ...f, start_time: e.target.value }))} />
            </div>
            <div>
              <label className={labelCls}>Heure de fin</label>
              <input type="time" className={fieldCls} value={form.end_time}
                onChange={e => setForm(f => ({ ...f, end_time: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Disponibilité</label>
            <div className="flex gap-3">
              {[
                { val: true,  label: 'Disponible',   cls: 'border-green-500/40 text-green-400' },
                { val: false, label: 'Indisponible',  cls: 'border-red-500/40 text-red-400' },
              ].map(({ val, label, cls }) => (
                <button key={String(val)}
                  onClick={() => setForm(f => ({ ...f, is_available: val }))}
                  className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                    form.is_available === val
                      ? cls + ' bg-current/5'
                      : 'border-anthracite text-stone-500'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={labelCls}>Notes (optionnel)</label>
            <input type="text" className={fieldCls} value={form.notes}
              placeholder="Ex: Congé, rendez-vous..."
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>
          <Button variant="gold" loading={saving} onClick={handleSave} className="mt-2">
            Enregistrer
          </Button>
        </div>
      </Modal>
    </div>
  )
}
