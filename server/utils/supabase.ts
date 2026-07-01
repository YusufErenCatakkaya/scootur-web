import { createClient } from '@supabase/supabase-js'

let supabaseClient: any = null

export const useSupabase = () => {
  if (supabaseClient) return supabaseClient

  const config = useRuntimeConfig()
  
  if (!config.supabaseUrl || !config.supabaseKey) {
    throw new Error('Missing Supabase URL or Key')
  }

  // We disable global fetch cache to avoid stale reads from Supabase REST API on Nuxt
  supabaseClient = createClient(config.supabaseUrl, config.supabaseKey, {
    auth: {
      persistSession: false
    },
    global: {
      fetch: (...args) => fetch(...args)
    }
  })

  return supabaseClient
}
