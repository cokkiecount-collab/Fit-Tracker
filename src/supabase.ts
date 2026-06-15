import { createClient } from "@supabase/supabase-js"

const supabaseUrl =
  "https://iigrijvgjlvupmxrdxoc.supabase.co"

const supabaseAnonKey =
  "sb_publishable_edzRfR1EeIao7PpLZS6G3g_2IPVCHox"

export const supabase =
  createClient(
    supabaseUrl,
    supabaseAnonKey
  )