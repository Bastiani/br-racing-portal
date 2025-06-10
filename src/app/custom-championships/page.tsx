'use client';

import { useEffect, useState } from 'react';
import Page from '@/components/pages/home/Page';
import { getAllChampionships } from '@/lib/championshipDB';
import { RsfChampionship } from '@/types/championship';
import Link from 'next/link';
import { IconTrophy, IconCalendar, IconFlag } from '@tabler/icons-react';

export default function CustomChampionships() {
  const [championships, setChampionships] = useState<RsfChampionship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadChampionships = async () => {
      try {
        const data = await getAllChampionships();
        // Limitar a 3 campeonatos como solicitado
        setChampionships(data.slice(0, 3));
      } catch (err) {
        setError('Erro ao carregar campeonatos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadChampionships();
  }, []);

  if (loading) {
    return (
      <Page>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto"></div>
            <p className="mt-4">Carregando campeonatos...</p>
          </div>
        </div>
      </Page>
    );
  }

  if (error) {
    return (
      <Page>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-400">
            <p>{error}</p>
          </div>
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Campeonatos Customizados
          </h1>
          <p className="text-xl text-white/80">
            Acompanhe os campeonatos de rally em andamento
          </p>
        </div>

        {championships.length === 0 ? (
          <div className="text-center text-white/60">
            <IconTrophy size={64} className="mx-auto mb-4 opacity-50" />
            <p>Nenhum campeonato encontrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {championships.map((championship) => (
              <Link
                key={championship.id}
                href={`/custom-championships/${championship.id}`}
                className="group"
              >
                <div className="bg-gradient-to-br from-[#1B263B] to-[#0D1B2A] border border-white/10 rounded-lg p-6 hover:border-orange-500/50 transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-between mb-4">
                    <IconTrophy className="text-orange-500" size={32} />
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      championship.status === 'active' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : championship.status === 'finished'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {championship.status === 'active' ? 'Ativo' : 
                       championship.status === 'finished' ? 'Finalizado' : 'Cancelado'}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                    {championship.name}
                  </h3>
                  
                  <div className="flex items-center text-white/60 mb-4">
                    <IconCalendar size={16} className="mr-2" />
                    <span>Temporada {championship.season}</span>
                  </div>
                  
                  {championship.start_date && (
                    <div className="text-sm text-white/50">
                      Início: {new Date(championship.start_date).toLocaleDateString('pt-BR')}
                    </div>
                  )}
                  
                  <div className="mt-4 flex items-center text-orange-400 group-hover:text-orange-300 transition-colors">
                    <span className="text-sm font-medium">Ver detalhes</span>
                    <IconFlag size={16} className="ml-2" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Page>
  );
}