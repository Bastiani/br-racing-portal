'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Page from '@/components/pages/home/Page';
import { 
  getChampionshipById, 
  getRalliesByChampionship, 
  getChampionshipStandings 
} from '@/lib/championshipDB';
import { RsfChampionship, RsfRally } from '@/types/championship';
import Link from 'next/link';
import { 
  IconTrophy, 
  IconCalendar, 
  IconMapPin, 
  IconArrowLeft,
  IconMedal,
  IconFlag
} from '@tabler/icons-react';

interface ChampionshipStanding {
  championship_id: number;
  championship_name: string;
  current_position: number;
  username: string;
  real_name: string;
  nationality: string;
  total_points: number;
  rallies_completed: number;
  wins: number;
  podiums: number;
}

export default function ChampionshipDetails() {
  const params = useParams();
  const championshipId = parseInt(params.id as string);
  
  const [championship, setChampionship] = useState<RsfChampionship | null>(null);
  const [rallies, setRallies] = useState<RsfRally[]>([]);
  const [standings, setStandings] = useState<ChampionshipStanding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadChampionshipData = async () => {
      try {
        const [championshipData, ralliesData, standingsData] = await Promise.all([
          getChampionshipById(championshipId),
          getRalliesByChampionship(championshipId),
          getChampionshipStandings(championshipId)
        ]);
        
        setChampionship(championshipData);
        setRallies(ralliesData);
        setStandings(standingsData);
      } catch (err) {
        setError('Erro ao carregar dados do campeonato');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (championshipId) {
      loadChampionshipData();
    }
  }, [championshipId]);

  if (loading) {
    return (
      <Page>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto"></div>
            <p className="mt-4">Carregando dados do campeonato...</p>
          </div>
        </div>
      </Page>
    );
  }

  if (error || !championship) {
    return (
      <Page>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-400">
            <p>{error || 'Campeonato não encontrado'}</p>
            <Link 
              href="/custom-championships" 
              className="inline-flex items-center mt-4 text-orange-400 hover:text-orange-300"
            >
              <IconArrowLeft size={16} className="mr-2" />
              Voltar aos campeonatos
            </Link>
          </div>
        </div>
      </Page>
    );
  }

  const getTrophyIcon = (position: number) => {
    if (position === 1) return '🥇';
    if (position === 2) return '🥈';
    if (position === 3) return '🥉';
    return position;
  };

  return (
    <Page>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/custom-championships" 
            className="inline-flex items-center text-orange-400 hover:text-orange-300 mb-4"
          >
            <IconArrowLeft size={16} className="mr-2" />
            Voltar aos campeonatos
          </Link>
          
          <div className="bg-gradient-to-r from-[#1B263B] to-[#0D1B2A] border border-white/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <IconTrophy className="text-orange-500 mr-4" size={48} />
                <div>
                  <h1 className="text-3xl font-bold text-white">{championship.name}</h1>
                  <p className="text-white/60">Temporada {championship.season}</p>
                </div>
              </div>
              <span className={`px-4 py-2 rounded-full font-medium ${
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
            
            {championship.start_date && (
              <div className="flex items-center text-white/60">
                <IconCalendar size={16} className="mr-2" />
                <span>
                  {new Date(championship.start_date).toLocaleDateString('pt-BR')}
                  {championship.end_date && ` - ${new Date(championship.end_date).toLocaleDateString('pt-BR')}`}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Rallies/Etapas */}
          <div className="bg-gradient-to-br from-[#1B263B] to-[#0D1B2A] border border-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <IconFlag className="mr-3 text-orange-500" size={24} />
              Rallies ({rallies.length})
            </h2>
            
            {rallies.length === 0 ? (
              <p className="text-white/60 text-center py-8">Nenhum rally encontrado</p>
            ) : (
              <div className="space-y-4">
                {rallies.map((rally) => (
                  <div key={rally.id} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-white">{rally.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${
                        rally.status === 'finished' 
                          ? 'bg-green-500/20 text-green-400'
                          : rally.status === 'ongoing'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : rally.status === 'scheduled'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {rally.status === 'finished' ? 'Finalizado' :
                         rally.status === 'ongoing' ? 'Em andamento' :
                         rally.status === 'scheduled' ? 'Agendado' : 'Cancelado'}
                      </span>
                    </div>
                    
                    {rally.location && (
                      <div className="flex items-center text-white/60 mb-2">
                        <IconMapPin size={14} className="mr-1" />
                        <span className="text-sm">{rally.location}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center text-white/60">
                      <IconCalendar size={14} className="mr-1" />
                      <span className="text-sm">
                        {new Date(rally.rally_date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Classificação */}
          <div className="bg-gradient-to-br from-[#1B263B] to-[#0D1B2A] border border-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <IconMedal className="mr-3 text-orange-500" size={24} />
              Classificação
            </h2>
            
            {standings.length === 0 ? (
              <p className="text-white/60 text-center py-8">Nenhuma classificação disponível</p>
            ) : (
              <div className="space-y-3">
                {standings.map((standing, index) => (
                  <div key={`${standing.championship_id}-${standing.current_position}`} 
                       className={`flex items-center justify-between p-3 rounded-lg ${
                         index < 3 ? 'bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30' : 'bg-white/5'
                       }`}>
                    <div className="flex items-center">
                      <div className="w-8 h-8 flex items-center justify-center mr-3 font-bold text-lg">
                        {getTrophyIcon(standing.current_position || index + 1)}
                      </div>
                      <div>
                        <p className="font-semibold text-white">
                          {standing.real_name || standing.username}
                        </p>
                        <p className="text-xs text-white/60">
                          {standing.rallies_completed} rallies • {standing.wins} vitórias • {standing.podiums} pódios
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-orange-400">{standing.total_points} pts</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Page>
  );
}