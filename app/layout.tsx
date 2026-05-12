import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ahmad Abdool Wahed — Chauffeur VTC Premium · French Riviera',
  description: 'Ahmad Abdool Wahed, votre chauffeur privé haut de gamme sur la French Riviera. Ponctualité, discrétion et confort pour particuliers et entreprises.',
  keywords: 'VTC, chauffeur privé, French Riviera, Côte d\'Azur, Ahmad Abdool Wahed, transport premium',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Mauritian Driver',
  },
  openGraph: {
    title: 'Ahmad Abdool Wahed — Chauffeur VTC Premium',
    description: 'French Riviera · Ponctualité • Discrétion • Confort',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="dark">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        {/* Ranade — Fontshare / Indian Type Foundry */}
        <link
          href="https://api.fontshare.com/v2/css?f[]=ranade@300,400,500,600,700&display=swap"
          rel="stylesheet"
        />
        {/* Inter — corps de texte */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
      </head>
      <body className="bg-black-deep text-white antialiased">
        {children}
      </body>
    </html>
  )
}
