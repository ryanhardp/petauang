import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Ini "tukang pos" kita buat ngirim/narik data ke Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)