'use client';

import { FiUsers, FiFileText, FiActivity, FiFlag, FiAward } from 'react-icons/fi';
import { getBrazilianResults, createRsfUser, updateDriverPodiumStats } from '@/lib/supabase-server';
import { useEffect, useState } from 'react';
import { RsfResult } from '@/types/supabase';

export default function AdminDashboard() {
  const [brazilianResults, setBrazilianResults] = useState<RsfResult[]>([]);
  const [isCreatingUsers, setIsCreatingUsers] = useState(false);
  const [isUpdatingStats, setIsUpdatingStats] = useState(false);
  const [creationStatus, setCreationStatus] = useState<string>('');
  const [updateStatus, setUpdateStatus] = useState<string>('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const results = await getBrazilianResults();
        setBrazilianResults(results);
      } catch (error) {
        console.error('Erro ao buscar resultados:', error);
      }
    };

    fetchResults();
  }, []);

  const handleCreateUsers = async () => {
    setIsCreatingUsers(true);
    setCreationStatus('Iniciando criação de usuários...');
    let created = 0;
    let errors = 0;

    try {
      for (const result of brazilianResults) {
        try {
          await createRsfUser({
            rsf_id: result.userid,
            name: result.real_name || result.user_name,
            nationality: result.nationality,
            victories: 0,
            first: 0,
            second: 0,
            third: 0,
          });
          created++;
          setCreationStatus(`Criados ${created} usuários de ${brazilianResults.length}...`);
        } catch (error) {
          console.error('Erro ao criar usuário:', error);
          errors++;
        }
      }

      setCreationStatus(`Concluído! ${created} usuários criados com sucesso. ${errors} erros.`);
    } catch {
      setCreationStatus('Erro ao criar usuários. Tente novamente.');
    } finally {
      setIsCreatingUsers(false);
    }
  };

  const handleUpdateStats = async () => {
    setIsUpdatingStats(true);
    setUpdateStatus('Iniciando atualização das estatísticas...');
    let updated = 0;
    let errors = 0;

    try {
      for (const result of brazilianResults) {
        try {
          await updateDriverPodiumStats(result.userid);
          updated++;
          setUpdateStatus(`Atualizados ${updated} usuários de ${brazilianResults.length}...`);
        } catch (error) {
          console.error('Erro ao atualizar estatísticas:', error);
          errors++;
        }
      }

      setUpdateStatus(`Concluído! ${updated} usuários atualizados com sucesso. ${errors} erros.`);
    } catch {
      setUpdateStatus('Erro ao atualizar estatísticas. Tente novamente.');
    } finally {
      setIsUpdatingStats(false);
    }
  };

  const stats = [
    { title: 'Usuários', value: '1,234', color: 'bg-[var(--dark-cyan)]', icon: <FiUsers className="w-5 h-5" /> },
    { title: 'Relatórios', value: '56', color: 'bg-[var(--gamboge)]', icon: <FiFileText className="w-5 h-5" /> },
    { title: 'Atividades', value: '832', color: 'bg-[var(--midnight-green)]', icon: <FiActivity className="w-5 h-5" /> },
    { title: 'Pilotos BR', value: brazilianResults.length.toString(), color: 'bg-green-600', icon: <FiFlag className="w-5 h-5" /> }
  ];

  const recentActivities = [
    { user: 'João Silva', action: 'criou um novo relatório', time: '2 horas atrás' },
    { user: 'Maria Oliveira', action: 'atualizou configurações', time: '5 horas atrás' },
    { user: 'Pedro Santos', action: 'adicionou um novo usuário', time: '1 dia atrás' },
    { user: 'Ana Costa', action: 'gerou relatório mensal', time: '2 dias atrás' }
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg shadow-md overflow-hidden">
            <div className={`${stat.color} h-2`}></div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{stat.title}</h3>
                <div className="text-[var(--dark-cyan)]">{stat.icon}</div>
              </div>
              <p className="text-3xl font-bold mt-2">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Pilotos Brasileiros</h2>
              <div className="space-x-4">
                <button
                  onClick={handleUpdateStats}
                  disabled={isUpdatingStats}
                  className={`px-4 py-2 rounded-md text-white ${
                    isUpdatingStats 
                      ? 'bg-gray-500 cursor-not-allowed' 
                      : 'bg-[var(--gamboge)] hover:bg-[var(--gamboge)]/80'
                  }`}
                >
                  <div className="flex items-center">
                    <FiAward className="w-4 h-4 mr-2" />
                    {isUpdatingStats ? 'Atualizando...' : 'Atualizar Pódios'}
                  </div>
                </button>
                <button
                  onClick={handleCreateUsers}
                  disabled={isCreatingUsers}
                  className={`px-4 py-2 rounded-md text-white ${
                    isCreatingUsers 
                      ? 'bg-gray-500 cursor-not-allowed' 
                      : 'bg-[var(--dark-cyan)] hover:bg-[var(--dark-cyan)]/80'
                  }`}
                >
                  {isCreatingUsers ? 'Criando usuários...' : 'Criar Usuários'}
                </button>
              </div>
            </div>
            {creationStatus && (
              <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                {creationStatus}
              </div>
            )}            {updateStatus && (
              <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                {updateStatus}
              </div>
            )}            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-[var(--card-border)]">
                    <th className="text-left py-3 px-4">Piloto</th>
                    <th className="text-left py-3 px-4">Nacionalidade</th>
                  </tr>
                </thead>
                <tbody>
                  {brazilianResults.map((result) => (
                    <tr key={result.id} className="border-b border-[var(--card-border)] hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-3 px-4">{result.real_name || result.user_name}</td>
                      <td className="py-3 px-4">{result.nationality}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Atividades Recentes</h2>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start pb-4 border-b border-[var(--card-border)] last:border-0 last:pb-0">
                  <div className="w-10 h-10 rounded-full bg-[var(--dark-cyan)] text-white flex items-center justify-center mr-3 flex-shrink-0">
                    {activity.user.charAt(0)}
                  </div>
                  <div>
                    <p>
                      <span className="font-medium">{activity.user}</span>
                      <span className="text-gray-600 dark:text-gray-400"> {activity.action}</span>
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}