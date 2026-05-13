'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { useAuthStore } from '@/store/useAuthStore'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, _hydrated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    // On attend que Zustand ait chargé depuis localStorage avant de vérifier
    if (!_hydrated) return
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login')
    }
  }, [_hydrated, isAuthenticated, user, router])

  // Spinner pendant la réhydratation
  if (!_hydrated) {
    return (
      <div className="min-h-screen bg-black-deep flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) return null

  return (
    <div className="flex min-h-screen bg-black-deep">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
