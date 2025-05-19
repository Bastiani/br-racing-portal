"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiUser, FiLogOut, FiSettings } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';
import { createClient } from '@/utils/supabase/client';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userName, setUserName] = useState('Usuário');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUserInfo = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.full_name) {
        setUserName(user.user_metadata.full_name);
      } else if (user?.user_metadata?.name) {
        setUserName(user.user_metadata.name);
      } else if (user?.email) {
        setUserName(user.email.split('@')[0]);
      }
    };

    getUserInfo();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  return (
    <header className="bg-[var(--header-bg)] border-b border-[var(--card-border)] h-16 flex items-center justify-between px-4 sticky top-0 z-20">
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-[var(--midnight-green)] dark:text-[var(--tiffany-blue)]">Admin Dashboard</h1>
      </div>
      
      <div className="flex items-center gap-3">
        <ThemeToggle />
        
        <div className="relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 rounded-full bg-gray-100 dark:bg-gray-800 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[var(--dark-cyan)] flex items-center justify-center text-white font-bold">
              <FiUser className="w-4 h-4" />
            </div>
            <span className="pr-2">{userName}</span>
          </button>
          
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-md shadow-lg py-1 z-30">
              <Link href="/admin/profile" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                <FiUser className="w-4 h-4" />
                <span>Perfil</span>
              </Link>
              <Link href="/admin/settings" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                <FiSettings className="w-4 h-4" />
                <span>Configurações</span>
              </Link>
              <button 
                onClick={handleLogout} 
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
              >
                <FiLogOut className="w-4 h-4" />
                <span>Sair</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}