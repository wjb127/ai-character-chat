import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-anon-key'

let supabase: ReturnType<typeof createClient>

try {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
} catch (error) {
  console.warn('Supabase client creation failed:', error)
  supabase = createClient('https://dummy.supabase.co', 'dummy-key')
}

export { supabase }