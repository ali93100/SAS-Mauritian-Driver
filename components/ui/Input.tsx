'use client'

import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-stone-300">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full bg-black-card border border-anthracite rounded-lg',
              'px-4 py-3 text-stone-100 placeholder:text-stone-600',
              'focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/25',
              'transition-all duration-200',
              icon && 'pl-10',
              error && 'border-red-500/60 focus:border-red-500 focus:ring-red-500/25',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
