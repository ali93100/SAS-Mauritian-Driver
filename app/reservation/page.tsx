import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { BookingForm } from '@/components/reservation/BookingForm'

export default function ReservationPage() {
  return (
    <main>
      <Navbar />
      <div className="min-h-screen pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-gold text-sm font-semibold tracking-widest uppercase mb-4">
              Réservation
            </p>
            <h1 className="text-4xl lg:text-5xl font-display font-bold text-white mb-4">
              Réservez votre course
            </h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Estimation instantanée du prix. Confirmation rapide par le chauffeur.
            </p>
          </div>

          <BookingForm />
        </div>
      </div>
      <Footer />
    </main>
  )
}
