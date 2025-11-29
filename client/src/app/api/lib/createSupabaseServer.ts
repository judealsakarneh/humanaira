import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { supabaseUrl, supabaseAnonKey } from './supabase-server'

export const createSupabaseServer = async () => {
    const cookieStore = await cookies()
    return createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                get: (name: string) => {
                    const value = cookieStore.get(name)
                    return value?.value
                },
            },
        }
    )
}