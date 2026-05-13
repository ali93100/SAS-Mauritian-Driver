import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { User } from '@/types'
import { supabase } from '@/lib/supabase'

const LOCAL_EMAIL    = 'mauritiandriver@gmail.com'
const LOCAL_PASSWORD = 'Admin2024!'

const isSupabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your_supabase_project_url'

const LOCAL_USER: User = {
  id:         'local-admin',
  full_name:  'Ahmad Abdool Wahed',
  email:      LOCAL_EMAIL,
  role:       'admin',
  created_at: new Date().toISOString(),
}

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  _hydrated: boolean          // true une fois que Zustand a chargé depuis localStorage
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  setUser: (user: User | null) => void
  setHydrated: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      _hydrated: false,

      setHydrated: () => set({ _hydrated: true }),

      signIn: async (email: string, password: string) => {
        set({ isLoading: true })

        // Mode local
        if (!isSupabaseConfigured) {
          await new Promise(r => setTimeout(r, 600))
          if (email === LOCAL_EMAIL && password === LOCAL_PASSWORD) {
            set({ user: LOCAL_USER, isAuthenticated: true, isLoading: false })
            return { error: null }
          }
          set({ isLoading: false })
          return { error: 'Email ou mot de passe incorrect' }
        }

        // Mode Supabase
        try {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password })
          if (error) { set({ isLoading: false }); return { error: error.message } }
          if (data.user) {
            const { data: profile } = await supabase
              .from('users').select('*').eq('id', data.user.id).single()
            set({ user: profile, isAuthenticated: true, isLoading: false })
          }
          return { error: null }
        } catch {
          set({ isLoading: false })
          return { error: 'Erreur de connexion' }
        }
      },

      signOut: async () => {
        if (isSupabaseConfigured) await supabase.auth.signOut()
        set({ user: null, isAuthenticated: false })
      },

      setUser: (user) => set({ user, isAuthenticated: !!user }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
    }
  )
)
