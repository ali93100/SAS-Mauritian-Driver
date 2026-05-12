export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { generateReferralCode } from '@/lib/qrcode'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { full_name, email, phone, user_id, referral_code: usedCode } = body

    if (!full_name || !email) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }

    const supabase = getServiceClient()

    // Generate unique referral code
    const tempId = user_id || crypto.randomUUID()
    const referral_code = generateReferralCode(tempId)
    const qr_code = `${process.env.NEXT_PUBLIC_APP_URL}/ref/${referral_code}`

    let referred_by = null
    let new_client_discount = 0

    // Apply referral discount if code provided
    if (usedCode) {
      const { data: referrer } = await supabase
        .from('clients')
        .select('id')
        .eq('referral_code', usedCode)
        .single()

      if (referrer) {
        referred_by = referrer.id
        new_client_discount = 10
      }
    }

    const { data: client, error } = await supabase.from('clients').insert({
      user_id,
      full_name,
      email,
      phone,
      qr_code,
      referral_code,
      referred_by,
      discount_percent: new_client_discount,
    }).select().single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Create loyalty record
    await supabase.from('loyalty').insert({ client_id: client.id })

    // Apply bonus to referrer
    if (referred_by) {
      await supabase.from('referrals').insert({
        referrer_id: referred_by,
        referred_id: client.id,
        discount_applied: true,
        bonus_applied: true,
      })
      await supabase.from('loyalty')
        .update({ bonus_rides: 1 })
        .eq('client_id', referred_by)
    }

    return NextResponse.json({ client })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
