import { createServerClient } from '@supabase/ssr'

export async function createClient() {
  // Check if we're in a server environment
  if (typeof window === 'undefined') {
    // Server-side: use dynamic import for next/headers
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()

    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    )
  } else {
    // Client-side: throw error or return null
    throw new Error('createServerClient should only be called on the server side')
  }
}