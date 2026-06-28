import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://iazzpplcgrwuvzoxuoya.supabase.co'
const SUPABASE_KEY = 'sb_publishable_4OCCleMYcGJ8anTDDYVd3w_W6N_Ws2P'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
