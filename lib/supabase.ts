import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null
let _serviceClient: SupabaseClient | null = null

export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    if (!_client) {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      if (!url || !key) throw new Error('Supabase credentials manquants. Configurez .env.local')
      _client = createClient(url, key)
    }
    const val = (_client as any)[prop]
    return typeof val === 'function' ? val.bind(_client) : val
  },
})

export const getServiceClient = (): SupabaseClient => {
  if (!_serviceClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    if (!url || !key) throw new Error('Supabase credentials manquants. Configurez .env.local')
    _serviceClient = createClient(url, key)
  }
  return _serviceClient
}
