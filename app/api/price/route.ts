export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { calculatePrice, estimateDistanceAndDuration } from '@/lib/pricing'

export async function POST(req: NextRequest) {
  try {
    const { departure, arrival, date, time } = await req.json()

    if (!departure || !arrival || !date || !time) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }

    const { distance, duration } = estimateDistanceAndDuration(departure, arrival)
    const calc = calculatePrice(distance, duration, date, time)

    return NextResponse.json({ calc })
  } catch {
    return NextResponse.json({ error: 'Erreur calcul' }, { status: 500 })
  }
}
