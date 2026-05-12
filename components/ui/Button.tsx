'use client'

import { motion } from 'framer-motion'
import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'ghost' | 'outline' | 'dark' | 'coffee'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'gold', size = 'md', loading, children, disabled, ...props }, ref) => {
    const variants = {
      // Antique Brass — CTA principal
      gold:    'bg-gradient-gold text-black-deep font-semibold hover:shadow-gold-lg',
      // Coffee warm outline
      coffee:  'bg-coffee/15 text-gold border border-coffee/40 hover:bg-coffee/25',
      // Ghost — transparent with Jet border
      ghost:   'bg-transparent text-stone-200 hover:bg-anthracite/40 border border-anthracite',
      // Outline Antique Brass
      outline: 'bg-transparent text-gold border border-gold hover:bg-gold/10',
      // Dark — surface Jet
      dark:    'bg-anthracite text-stone-100 hover:bg-anthracite-light',
    }

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    }

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.15 }}
        disabled={disabled || loading}
        className={cn(
          'relative inline-flex items-center justify-center gap-2 rounded-lg font-medium',
          'transition-all duration-200 cursor-pointer select-none',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100',
          variants[variant],
          sizes[size],
          className
        )}
        {...(props as any)}
      >
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </span>
        )}
        <span className={loading ? 'opacity-0' : ''}>{children}</span>
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
