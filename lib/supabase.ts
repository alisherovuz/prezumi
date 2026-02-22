import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Lazy initialization - only create client when needed
let supabase: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (supabase) return supabase
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
  supabase = createClient(url, key, {
    auth: { persistSession: true, autoRefreshToken: true }
  })
  
  return supabase
}

export { supabase }
