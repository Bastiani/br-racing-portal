import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const redirectTo = requestUrl.searchParams.get('redirectTo') || '/admin';
  
  if (code) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    
    // Trocar o código de autorização por uma sessão
    await supabase.auth.exchangeCodeForSession(code);
  }
  
  // Redirecionar para a página solicitada ou para o admin por padrão
  return NextResponse.redirect(new URL(redirectTo, request.url));
}