import { cookies } from 'next/headers'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export function createSupabaseServer() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const store = await cookies()
          return store.get(name)?.value
        },
        async set(name: string, value: string, options: CookieOptions) {
          const store = await cookies()
          store.set({ name, value, ...options, path: options?.path ?? '/' })
        },
        async remove(name: string, options: CookieOptions) {
          const store = await cookies()
          store.set({
            name,
            value: '',
            ...options,
            path: options?.path ?? '/',
            maxAge: 0,
            expires: new Date(0),
          })
        },
      },
    }
  )
}
