'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Button } from './Button'
import { Logo } from './Logo'

const links = [
  { href: '/', label: 'Accueil' },
  { href: '/reservation', label: 'Réservation' },
  { href: '/agenda', label: 'Agenda' },
  { href: '/chauffeur', label: 'Chauffeur' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-black-deep/96 backdrop-blur-lg border-b border-anthracite shadow-dark'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <Logo size={40} crop className="group-hover:scale-105 transition-transform duration-300" />
            <div>
              <p className="text-stone-100 font-display font-bold text-sm leading-none tracking-wide">
                Ahmad Abdool Wahed
              </p>
              <p className="text-gold text-[10px] leading-none tracking-widest uppercase mt-1">
                Chauffeur VTC · French Riviera
              </p>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-stone-400 hover:text-gold text-sm font-medium transition-colors duration-200 tracking-wide"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Espace admin</Button>
            </Link>
            <Link href="/reservation">
              <Button variant="gold" size="sm">Réserver</Button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-stone-400 hover:text-stone-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-black-deep/98 backdrop-blur-lg border-b border-anthracite overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-stone-300 hover:text-gold text-base font-medium transition-colors py-1"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-3 pt-3 border-t border-anthracite">
                <Link href="/login" onClick={() => setMenuOpen(false)}>
                  <Button variant="ghost" size="md" className="w-full">Espace admin</Button>
                </Link>
                <Link href="/reservation" onClick={() => setMenuOpen(false)}>
                  <Button variant="gold" size="md" className="w-full">Réserver maintenant</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
