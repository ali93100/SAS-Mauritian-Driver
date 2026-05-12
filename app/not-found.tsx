import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Car } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black-deep flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 bg-gradient-gold rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-gold">
        <Car size={28} className="text-black-deep" />
      </div>
      <h1 className="text-gold font-bold text-6xl mb-4">404</h1>
      <h2 className="text-white font-semibold text-2xl mb-4">Page introuvable</h2>
      <p className="text-gray-500 mb-8 max-w-sm">
        Cette page n'existe pas. Revenez à l'accueil pour continuer votre navigation.
      </p>
      <Link href="/">
        <Button variant="gold" size="lg">Retour à l'accueil</Button>
      </Link>
    </main>
  )
}
