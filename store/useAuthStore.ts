import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types'
import { supabase } from '@/lib/supabase'

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  setUser: (user: User | null) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,

      signIn: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password })
          if (error) {
            set({ isLoading: false })
            return { error: error.message }
          }
          if (data.user) {
            const { data: profile } = await supabase
              .from('users')
              .select('*')
              .eq('id', data.user.id)
              .single()
            set({ user: profile, isAuthenticated: true, isLoading: false })
          }
          return { error: null }
        } catch {
          set({ isLoading: false })
          return { error: 'Erreur de connexion' }
        }
      },

      signOut: async () => {
        await supabase.auth.signOut()
        set({ user: null, isAuthenticated: false })
      },

      setUser: (user) => set({ user, isAuthenticated: !!user }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
)
