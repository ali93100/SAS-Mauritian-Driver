'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Car, Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/useAuthStore'
import Link from 'next/link'

interface LoginForm {
  email: string
  password: string
}

export default function LoginPage() {
  const { signIn } = useAuthStore()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<LoginForm>()

  const onSubmit = async ({ email, password }: LoginForm) => {
    setError('')
    const { error } = await signIn(email, password)
    if (error) {
      setError('Email ou mot de passe incorrect')
    } else {
      router.push('/dashboard')
    }
  }

  const inputCls = 'w-full bg-black-soft border border-anthracite rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all text-sm'

  return (
    <main className="min-h-screen bg-black-deep flex flex-col items-center justify-center px-4">
      {/* Background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-gold rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-gold">
            <Car size={26} className="text-black-deep" />
          </div>
          <h1 className="text-white font-bold text-2xl">Espace Chauffeur</h1>
          <p className="text-gray-500 text-sm mt-1">SAS Mauritian Driver · Admin</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-black-card border border-anthracite rounded-2xl p-8 flex flex-col gap-5 shadow-dark-lg"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
            >
              <AlertCircle size={14} className="text-red-400 shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 z-10" />
            <input
              {...register('email', { required: true })}
              type="email"
              placeholder="Email"
              autoComplete="email"
              className={inputCls}
            />
          </div>

          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 z-10" />
            <input
              {...register('password', { required: true })}
              type={showPassword ? 'text' : 'password'}
              placeholder="Mot de passe"
              autoComplete="current-password"
              className={inputCls + ' pr-11'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <Button
            type="submit"
            variant="gold"
            size="lg"
            loading={isSubmitting}
            className="w-full mt-2"
          >
            Se connecter
          </Button>
        </form>

        <div className="text-center mt-6">
          <Link href="/" className="text-gray-500 text-sm hover:text-gray-300 transition-colors">
            ← Retour au site
          </Link>
        </div>
      </motion.div>
    </main>
  )
}
