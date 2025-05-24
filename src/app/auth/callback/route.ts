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
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Erro ao trocar código por sessão:', error.message);
      // Redirecionar para a página de login com uma mensagem de erro para ser exibida
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('error', 'auth_exchange_failed');
      // Você pode querer passar uma mensagem mais amigável ou um código de erro específico
      loginUrl.searchParams.set('message', 'Falha ao autenticar com o provedor OAuth.'); 
      return NextResponse.redirect(loginUrl);
    }
  }
  
  // Redirecionar para a página solicitada ou para o admin por padrão
  // Se exchangeCodeForSession foi bem-sucedido e os cookies foram definidos corretamente,
  // a próxima requisição para 'redirectTo' deverá ter a sessão.
  return NextResponse.redirect(new URL(redirectTo, request.url));
}
