import { cn } from '@/lib/utils'

interface LogoProps {
  size?: number
  className?: string
  crop?: boolean   // zoom centré pour petits formats (navbar/footer/sidebar)
}

// mix-blend-mode: screen sur fond sombre → le fond noir/gris du PNG devient transparent
// seul le monogramme Antique Brass reste visible
export function Logo({ size = 36, className, crop = false }: LogoProps) {
  return (
    <div
      className={cn('relative shrink-0 rounded-lg', crop && 'overflow-hidden', className)}
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/logo.png"
        alt="Mauritian Driver"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          mixBlendMode: 'screen',
          transform: crop ? 'scale(1.6)' : 'none',
          display: 'block',
        }}
      />
    </div>
  )
}
