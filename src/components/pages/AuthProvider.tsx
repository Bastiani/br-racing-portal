"use client";

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type AuthProviderProps = {
  children: React.ReactNode;
};

export default function AuthProvider({ children }: AuthProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/auth/login');
        return;
      }
      
      // Verificar se o email é o autorizado
      if (session.user.email !== 'rafacdb@gmail.com') {
        await supabase.auth.signOut();
        router.push('/auth/unauthorized');
        return;
      }
      
      setIsLoading(false);
    };

    // Verificar a sessu00e3o atual
    checkSession();

    // Configurar listener para mudanu00e7as na autenticau00e7u00e3o
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        router.push('/auth/login');
      } else if (event === 'SIGNED_IN' && session) {
        // Verificar se o email é o autorizado quando fizer login
        if (session.user.email !== 'rafacdb@gmail.com') {
          await supabase.auth.signOut();
          router.push('/auth/unauthorized');
          return;
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}