import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { Hero } from '@/components/landing/Hero'
import { AboutSection } from '@/components/landing/AboutSection'
import { Features } from '@/components/landing/Features'
import { PricingSection } from '@/components/landing/PricingSection'

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <AboutSection />
      <Features />
      <PricingSection />
      <Footer />
    </main>
  )
}
