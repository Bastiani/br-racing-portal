"use client";

import { useEffect, useState } from 'react';
import { FiUser, FiMail, FiPhone, FiBriefcase, FiSave, FiBell, FiGlobe } from 'react-icons/fi';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import { Card } from '@/components/Card';
import { InputField } from '@/components/InputField';
import { Button } from '@/components/Button';
import { CheckboxField } from '@/components/CheckboxField';

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
      
      <Card variant="profile">
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
            <InputField 
              label="ID da Conta"
              icon={FiUser}
              value={user?.id || '-'}
              readOnly
              variant="profile"
            />
            <InputField 
              label="Email"
              type="email"
              icon={FiMail}
              value={user?.email || '-'}
              readOnly
              variant="profile"
            />
            <InputField 
              label="Telefone"
              icon={FiPhone}
              defaultValue="(11) 98765-4321"
              variant="profile"
            />
            <InputField 
              label="Cargo"
              icon={FiBriefcase}
              defaultValue="Desenvolvedor"
              variant="profile"
            />
          </div>
          
          <div className="mt-6">
            <h4 className="text-md font-medium mb-2">Dados do Provedor OAuth</h4>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-auto text-sm">
              {JSON.stringify(user?.user_metadata || {}, null, 2)}
            </pre>
          </div>
          
          <div className="mt-6">
            <Button variant="profile" icon={FiSave}>
              Salvar Alterações
            </Button>
          </div>
        </div>
      </Card>
      
      <Card variant="profile" className="mt-6">
        <h3 className="text-lg font-medium mb-4">Preferências</h3>
        
        <div className="space-y-4">
          <CheckboxField 
            id="email-notifications"
            label="Receber notificações por email"
            icon={FiBell}
            defaultChecked
            variant="profile"
          />
          
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
          <Button variant="profile" icon={FiSave}>
            Salvar Preferências
          </Button>
        </div>
      </Card>
    </div>
  );
}