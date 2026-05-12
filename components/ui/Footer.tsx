import Link from 'next/link'
import { Car, Phone, Mail, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-black-deep border-t border-anthracite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-gold rounded-lg flex items-center justify-center shadow-gold">
                <Car size={20} className="text-black-deep" />
              </div>
              <div>
                <p className="text-white font-bold tracking-wide">AHMAD ABDOOL WAHED</p>
                <p className="text-gold text-xs tracking-widest uppercase">Chauffeur VTC · French Riviera</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Votre chauffeur privé de confiance sur la French Riviera.
              Ponctualité, discrétion et confort à chaque trajet.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-6 tracking-wide">Navigation</h3>
            <ul className="flex flex-col gap-3">
              {[
                { href: '/', label: 'Accueil' },
                { href: '/reservation', label: 'Réservation' },
                { href: '/agenda', label: 'Agenda' },
                { href: '/chauffeur', label: 'Profil Chauffeur' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-gold text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-6 tracking-wide">Contact direct</h3>
            <ul className="flex flex-col gap-4">
              <li className="flex items-center gap-3 text-sm">
                <Phone size={16} className="text-gold shrink-0" />
                <a href="tel:+33620037810" className="text-gray-400 hover:text-gold transition-colors">
                  +33 6 20 03 78 10
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail size={16} className="text-gold shrink-0" />
                <a href="mailto:mauritiandriver@gmail.com" className="text-gray-400 hover:text-gold transition-colors">
                  mauritiandriver@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <MapPin size={16} className="text-gold shrink-0" />
                <span>French Riviera — Côte d&apos;Azur</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-anthracite flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} Ahmad Abdool Wahed · SAS Mauritian Driver. Tous droits réservés.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse-gold" />
            <span className="text-gray-600 text-xs">Disponible 7j/7 · 24h/24</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
