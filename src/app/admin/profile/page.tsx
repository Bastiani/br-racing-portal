"use client";

import { useEffect, useState } from 'react';
import { FiUser, FiMail, FiPhone, FiBriefcase, FiSave, FiBell, FiGlobe } from 'react-icons/fi';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';

// type UserProfile = {
//   created_at: string;
// };

export default function ProfilePage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadUserProfile() {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;
        setUser(data.user);
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
      } finally {
        setLoading(false);
      }
    }

    loadUserProfile();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Perfil do Usuário</h1>
      
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white">
            {user?.user_metadata?.avatar_url ? (
              <Image 
                src={user.user_metadata.avatar_url} 
                alt="Avatar" 
                width={80}
                height={80}
                className="rounded-full object-cover"
                priority
              />
            ) : (
              <FiUser size={32} />
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold">
              {user?.user_metadata?.full_name || 
               user?.user_metadata?.name || 
               user?.email?.split('@')[0] || 
               'Usuário'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
            <p className="text-sm text-gray-500">
              Conta vinculada: {user?.app_metadata?.provider || 'OAuth'}
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
          <h3 className="text-lg font-medium mb-4">Informações da Conta</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                <FiUser className="inline mr-2 text-blue-500" />
                ID da Conta
              </label>
              <input 
                type="text" 
                className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-md px-3 py-2" 
                value={user?.id || '-'}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                <FiMail className="inline mr-2 text-blue-500" />
                Email
              </label>
              <input 
                type="email" 
                className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-md px-3 py-2" 
                value={user?.email || '-'}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                <FiPhone className="text-blue-500 w-4 h-4" />
                <span>Telefone</span>
              </label>
              <input 
                type="text"
                className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-md px-3 py-2" 
                defaultValue="(11) 98765-4321"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                <FiBriefcase className="text-blue-500 w-4 h-4" />
                <span>Cargo</span>
              </label>
              <input 
                type="text"
                className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-md px-3 py-2" 
                defaultValue="Desenvolvedor"
              />
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="text-md font-medium mb-2">Dados do Provedor OAuth</h4>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-auto text-sm">
              {JSON.stringify(user?.user_metadata || {}, null, 2)}
            </pre>
          </div>
          
          <div className="mt-6">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2">
              <FiSave className="w-4 h-4" />
              <span>Salvar Alterações</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md overflow-hidden mt-6">
        <div className="p-6">
          <h3 className="text-lg font-medium mb-4">Preferências</h3>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="email-notifications" 
                className="h-4 w-4 text-blue-500 border-gray-300 rounded" 
                defaultChecked
              />
              <label htmlFor="email-notifications" className="ml-2 block text-sm flex items-center gap-2">
                <FiBell className="text-blue-500 w-4 h-4" />
                <span>Receber notificações por email</span>
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                <FiGlobe className="text-blue-500 w-4 h-4" />
                <span>Idioma</span>
              </label>
              <select className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-md px-3 py-2">
                <option>Português (Brasil)</option>
                <option>English (US)</option>
                <option>Español</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2">
              <FiSave className="w-4 h-4" />
              <span>Salvar Preferências</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}