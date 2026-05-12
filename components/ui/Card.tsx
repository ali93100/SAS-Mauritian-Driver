'use client'

import { motion } from 'framer-motion'
import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  gold?: boolean
}

export function Card({ className, hover = false, gold = false, children, onClick, ...rest }: CardProps) {
  const baseClass = cn(
    'bg-black-card border rounded-xl p-6',
    gold ? 'border-gold/20 shadow-gold' : 'border-anthracite shadow-card',
    className
  )

  if (hover) {
    return (
      <motion.div
        className={baseClass}
        whileHover={{ y: -2, scale: 1.005 }}
        transition={{ duration: 0.2 }}
        onClick={onClick}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div className={baseClass} onClick={onClick} {...rest}>
      {children}
    </div>
  )
}
