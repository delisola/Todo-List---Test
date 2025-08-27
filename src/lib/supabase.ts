import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jjhubazmcetfajsxvabb.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_Kp7FoDMrdYa2vbcylOE5Tw_5RrDidqT'

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 