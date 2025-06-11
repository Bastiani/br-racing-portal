'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Page from '@/components/pages/home/Page';
import { 
  getChampionshipById, 
  getRalliesByChampionship, 
  getChampionshipStandings,
  getStagesByRally,
  getStageResults
} from '@/lib/championshipDB';
import { RsfChampionship, RsfRally, RsfStage } from '@/types/championship';
import { formatDatabaseDate } from '@/lib/utils';
import Link from 'next/link';
import { 
  IconTrophy, 
  IconCalendar, 
  IconMapPin, 
  IconArrowLeft,
  IconMedal,
  IconFlag,
  IconChevronDown,
  IconChevronUp,
  IconClock,
  IconTarget
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

interface StageResultWithPilot {
  id: number;
  stage_id: number;
  pilot_id: number;
  car_id?: number;
  position: number;
  stage_time: string;
  penalty_time: string;
  super_rally: boolean;
  dnf: boolean;
  dsq: boolean;
  created_at: Date;
  rsf_pilots: {
    userid: number;
    username: string;
    real_name: string;
    nationality: string;
  };
  rsf_cars?: {
    model: string;
  };
}

export default function ChampionshipDetails() {
  const params = useParams();
  const championshipId = parseInt(params.id as string);
  
  const [championship, setChampionship] = useState<RsfChampionship | null>(null);
  const [rallies, setRallies] = useState<RsfRally[]>([]);
  const [standings, setStandings] = useState<ChampionshipStanding[]>([]);
  const [expandedRally, setExpandedRally] = useState<number | null>(null);
  const [rallyStages] = useState<{ [rallyId: number]: RsfStage[] }>({});
  const [selectedStage, setSelectedStage] = useState<number | null>(null);
  const [stageResults, setStageResults] = useState<StageResultWithPilot[]>([]);
  const [loadingStages, setLoadingStages] = useState(false);
  const [loadingResults, setLoadingResults] = useState(false);
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

  const handleRallyClick = async (rallyId: number) => {
    if (expandedRally === rallyId) {
      setExpandedRally(null);
      setSelectedStage(null);
      setStageResults([]);
      return;
    }

    setExpandedRally(rallyId);
    setSelectedStage(null);
    setStageResults([]);

    if (!rallyStages[rallyId]) {
      setLoadingStages(true);
      try {
        const stages = await getStagesByRally(rallyId);
        rallyStages[rallyId] = stages;
      } catch (err) {
        console.error('Erro ao carregar etapas:', err);
      } finally {
        setLoadingStages(false);
      }
    }
  };

  const handleStageClick = async (stageId: number) => {
    if (selectedStage === stageId) {
      setSelectedStage(null);
      setStageResults([]);
      return;
    }

    setSelectedStage(stageId);
    setLoadingResults(true);
    try {
      const results = await getStageResults(stageId);
      setStageResults(results);
    } catch (err) {
      console.error('Erro ao carregar resultados da etapa:', err);
    } finally {
      setLoadingResults(false);
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString || timeString === '00:00:00') return '-';
    return timeString;
  };

  const getStatusColor = (result: StageResultWithPilot) => {
    if (result.dsq) return 'text-red-400';
    if (result.dnf) return 'text-orange-400';
    if (result.super_rally) return 'text-yellow-400';
    return 'text-white';
  };

  const getStatusText = (result: StageResultWithPilot) => {
    if (result.dsq) return 'DSQ';
    if (result.dnf) return 'DNF';
    if (result.super_rally) return 'SR';
    return '';
  };

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
              href="/championships" 
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
            href="/championships" 
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
                  {formatDatabaseDate(championship.start_date)}
                  {championship.end_date && ` - ${formatDatabaseDate(championship.end_date)}`}
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
                  <div key={rally.id} className="bg-white/5 rounded-lg overflow-hidden">
                    <div 
                      className="p-4 hover:bg-white/10 transition-colors cursor-pointer"
                      onClick={() => handleRallyClick(rally.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <h3 className="font-semibold text-white mr-2">{rally.name}</h3>
                          {expandedRally === rally.id ? 
                            <IconChevronUp size={16} className="text-white/60" /> : 
                            <IconChevronDown size={16} className="text-white/60" />
                          }
                        </div>
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
                          {formatDatabaseDate(rally.rally_date)}
                        </span>
                      </div>
                    </div>

                    {/* Etapas do Rally */}
                    {expandedRally === rally.id && (
                      <div className="border-t border-white/10 p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-lg font-semibold text-white flex items-center">
                            <IconTarget size={18} className="mr-2 text-orange-400" />
                            Etapa
                          </h4>
                          <Link href={`https://rallysimfans.hu/rbr/rally_online.php?centerbox=rally_list_details.php&rally_id=${rally.rsf_rally}`} target="_blank" rel="noopener noreferrer" className="text-xs text-orange-400 hover:text-orange-300">RSF: {rally.rsf_rally}</Link>
                        </div>
                        
                        {loadingStages ? (
                          <div className="text-center py-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto"></div>
                          </div>
                        ) : rallyStages[rally.id]?.length === 0 ? (
                          <p className="text-white/60 text-sm">Nenhuma etapa encontrada</p>
                        ) : (
                          <div className="space-y-2">
                            {rallyStages[rally.id]?.map((stage) => (
                              <div key={stage.id}>
                                <div 
                                  className="bg-white/5 rounded p-3 hover:bg-white/10 transition-colors cursor-pointer"
                                  onClick={() => handleStageClick(stage.id)}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                      <span className="text-orange-400 font-semibold mr-2">
                                        Resultado
                                      </span>
                                      {/* <span className="text-white text-sm">{stage.stage_name}</span> */}
                                      {selectedStage === stage.id ? 
                                        <IconChevronUp size={14} className="ml-2 text-white/60" /> : 
                                        <IconChevronDown size={14} className="ml-2 text-white/60" />
                                      }
                                    </div>
                                    {stage.distance_km && (
                                      <span className="text-white/60 text-xs">
                                        {stage.distance_km} km
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Resultados da Etapa */}
                                {selectedStage === stage.id && (
                                  <div className="mt-2 bg-white/5 rounded p-3">
                                    <h5 className="text-white font-medium mb-3 flex items-center">
                                      <IconClock size={16} className="mr-2 text-orange-400" />
                                      Resultados
                                    </h5>
                                    
                                    {loadingResults ? (
                                      <div className="text-center py-4">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-auto"></div>
                                      </div>
                                    ) : stageResults.length === 0 ? (
                                      <p className="text-white/60 text-xs">Nenhum resultado encontrado</p>
                                    ) : (
                                      <div className="space-y-1 max-h-60 overflow-y-auto">
                                        {stageResults.map((result) => (
                                          <div key={result.id} className="flex items-center justify-between py-1 px-2 bg-white/5 rounded text-xs">
                                            <div className="flex items-center">
                                              <span className="w-6 text-orange-400 font-semibold">
                                                {result.position}º
                                              </span>
                                              <span className={`ml-2 ${getStatusColor(result)}`}>
                                                {result.rsf_pilots.real_name || result.rsf_pilots.username}
                                              </span>
                                              {getStatusText(result) && (
                                                <span className={`ml-2 px-1 rounded text-xs ${getStatusColor(result)}`}>
                                                  {getStatusText(result)}
                                                </span>
                                              )}
                                            </div>
                                            <div className="flex items-center space-x-2">
                                              {result.rsf_cars && (
                                                <span className="text-white/60">
                                                  {result.rsf_cars.model}
                                                </span>
                                              )}
                                              <span className="text-white font-mono">
                                                {formatTime(result.stage_time)}
                                              </span>
                                              {result.penalty_time !== '00:00:00' && (
                                                <span className="text-red-400 font-mono">
                                                  +{formatTime(result.penalty_time)}
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
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