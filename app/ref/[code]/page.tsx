'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Car } from 'lucide-react'

export default function ReferralPage({ params }: { params: { code: string } }) {
  const router = useRouter()

  useEffect(() => {
    // Store referral code and redirect to booking
    if (typeof window !== 'undefined') {
      localStorage.setItem('referral_code', params.code)
    }
    setTimeout(() => router.push('/reservation'), 2000)
  }, [params.code, router])

  return (
    <main className="min-h-screen bg-black-deep flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 bg-gradient-gold rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-gold animate-pulse-gold">
        <Car size={28} className="text-black-deep" />
      </div>
      <h1 className="text-white font-bold text-2xl mb-2">Bienvenue !</h1>
      <p className="text-gray-400 mb-2">
        Code parrainage <span className="text-gold font-mono font-semibold">{params.code}</span> appliqué
      </p>
      <p className="text-gold font-medium">-10% sur votre première course !</p>
      <p className="text-gray-600 text-sm mt-6">Redirection vers la réservation...</p>
    </main>
  )
}
