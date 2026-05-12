import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { DriverProfileCard } from '@/components/driver/DriverProfileCard'

export default function ChauffeurPage() {
  return (
    <main>
      <Navbar />
      <div className="min-h-screen pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-gold text-sm font-semibold tracking-widest uppercase mb-4">
              Votre chauffeur
            </p>
            <h1 className="text-4xl lg:text-5xl font-display font-bold text-white mb-4">
              Profil & Certifications
            </h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Faites connaissance avec votre chauffeur privé certifié VTC.
            </p>
          </div>

          <DriverProfileCard />
        </div>
      </div>
      <Footer />
    </main>
  )
}
