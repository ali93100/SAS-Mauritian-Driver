import { cn } from '@/lib/utils'

type BadgeVariant = 'gold' | 'green' | 'red' | 'gray' | 'blue' | 'coffee'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  gold:   'bg-gold/15 text-gold border-gold/30',
  coffee: 'bg-coffee/20 text-gold-light border-coffee/40',
  green:  'bg-green-500/12 text-green-400 border-green-500/25',
  red:    'bg-red-500/12 text-red-400 border-red-500/25',
  gray:   'bg-anthracite/60 text-stone-400 border-anthracite-light/40',
  blue:   'bg-blue-500/12 text-blue-400 border-blue-500/25',
}

const statusMap: Record<string, BadgeVariant> = {
  pending:   'gold',
  confirmed: 'green',
  refused:   'red',
  completed: 'blue',
  cancelled: 'gray',
}

export function Badge({ variant = 'gray', children, className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
      variants[variant],
      className
    )}>
      {children}
    </span>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const variant = statusMap[status] || 'gray'
  const labels: Record<string, string> = {
    pending:   'En attente',
    confirmed: 'Confirmée',
    refused:   'Refusée',
    completed: 'Terminée',
    cancelled: 'Annulée',
  }
  return <Badge variant={variant}>{labels[status] || status}</Badge>
}
