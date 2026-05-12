export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { calculatePrice, estimateDistanceAndDuration } from '@/lib/pricing'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { departure, arrival, date, time, passengers, luggage, type, notes, client_id } = body

    if (!departure || !arrival || !date || !time || !client_id) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }

    const { distance, duration } = estimateDistanceAndDuration(departure, arrival)
    const calc = calculatePrice(distance, duration, date, time)

    const supabase = getServiceClient()
    const { data, error } = await supabase.from('reservations').insert({
      client_id,
      departure,
      arrival,
      date,
      time,
      passengers: passengers || 1,
      luggage: luggage || 0,
      type: type || 'course_simple',
      notes,
      estimated_distance_km: distance,
      estimated_duration_min: duration,
      base_price: calc.subtotal,
      final_price: calc.total,
      night_surcharge: calc.is_night,
      sunday_surcharge: calc.is_sunday,
      status: 'pending',
    }).select().single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ reservation: data, price: calc })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const supabase = getServiceClient()

  let query = supabase
    .from('reservations')
    .select('*, client:clients(full_name, email, phone)')
    .order('created_at', { ascending: false })

  if (status && status !== 'all') query = query.eq('status', status)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ reservations: data })
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json()
    if (!id || !status) return NextResponse.json({ error: 'Données manquantes' }, { status: 400 })

    const supabase = getServiceClient()
    const { error } = await supabase.from('reservations').update({ status }).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    if (status === 'completed') {
      const { data: res } = await supabase.from('reservations').select('client_id, final_price').eq('id', id).single()
      if (res) {
        const invoiceNumber = `MD-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 99999)).padStart(5, '0')}`
        await supabase.from('invoices').insert({
          reservation_id: id,
          client_id: res.client_id,
          invoice_number: invoiceNumber,
          amount: res.final_price,
          tax_amount: 0,
          total_amount: res.final_price,
          issued_at: new Date().toISOString(),
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
