import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { supabaseUrl, supabaseAnonKey } from './supabase-server'

export const createSupabaseServer = async () => {
    // Check for environment variables at runtime, not import time
    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Missing Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY)')
    }
    
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