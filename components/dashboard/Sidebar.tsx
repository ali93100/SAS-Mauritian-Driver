'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, CalendarDays, Users, BarChart3,
  LogOut, Settings, ChevronRight
} from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { useAuthStore } from '@/store/useAuthStore'
import { useRouter } from 'next/navigation'

const navItems = [
  { href: '/dashboard',              label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/dashboard/reservations', label: 'Réservations',    icon: CalendarDays },
  { href: '/dashboard/planning',     label: 'Planning',        icon: CalendarDays },
  { href: '/dashboard/clients',      label: 'Clients CRM',     icon: Users },
  { href: '/dashboard/stats',        label: 'Statistiques',    icon: BarChart3 },
  { href: '/dashboard/settings',     label: 'Paramètres',      icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { signOut } = useAuthStore()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  return (
    <aside className="w-64 min-h-screen bg-black-card border-r border-anthracite flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-anthracite">
        <div className="flex items-center gap-3">
          <Logo size={40} crop />
          <div>
            <p className="text-stone-100 font-display font-bold text-sm leading-none">Ahmad A.W.</p>
            <p className="text-gold text-[10px] tracking-wider mt-0.5">ADMIN PANEL</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-all duration-150 group ${
                    isActive
                      ? 'bg-gold/10 text-gold border border-gold/20'
                      : 'text-stone-400 hover:text-stone-100 hover:bg-anthracite/60'
                  }`}
                >
                  <item.icon size={15} className={isActive
                    ? 'text-gold'
                    : 'text-stone-600 group-hover:text-stone-300'} />
                  {item.label}
                  {isActive && <ChevronRight size={13} className="ml-auto text-gold" />}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Sign out */}
      <div className="p-4 border-t border-anthracite">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
            text-stone-500 hover:text-red-400 hover:bg-red-500/8 transition-all w-full"
        >
          <LogOut size={15} />
          Déconnexion
        </button>
      </div>
    </aside>
  )
}
