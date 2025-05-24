import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const returnTo = requestUrl.searchParams.get('returnTo') || '/admin'

  if (code) {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    
    try {
      const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Error exchanging code for session:', error.message)
        return NextResponse.redirect(
          `${requestUrl.origin}/auth/login?error=${encodeURIComponent(error.message)}`
        )
      }

      if (!session) {
        console.error('No session returned after code exchange')
        return NextResponse.redirect(
          `${requestUrl.origin}/auth/login?error=Could not create session`
        )
      }

      // After successful authentication, redirect to the returnTo path
      return NextResponse.redirect(`${requestUrl.origin}${returnTo}`)
    } catch (error) {
      console.error('Unexpected error during code exchange:', error)
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/login?error=Unexpected error during authentication`
      )
    }
  }

  // Return the user to the login page with an error if no code is present
  return NextResponse.redirect(
    `${requestUrl.origin}/auth/login?error=No code present in callback`
  )
}