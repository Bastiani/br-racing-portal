import { createClient } from "@/utils/supabase/client";
import {
  RsfPilot,
  RsfChampionship,
  RsfRally,
  RsfStage,
  RsfStageResult,
  RsfRallyResult,
  RsfChampionshipStanding,
  ChampionshipCreateInput,
  RallyCreateInput,
  StageResultInput
} from "@/types/championship";

const supabase = createClient();

// Função para criar ou buscar piloto
export async function createOrGetPilot(userid: number, username: string, realName?: string, nationality: string = 'BR'): Promise<RsfPilot> {
  // Primeiro tenta buscar o piloto existente
  const { data: existingPilot } = await supabase
    .from('rsf_pilots')
    .select('*')
    .eq('userid', userid)
    .single();

  if (existingPilot) {
    return existingPilot;
  }

  // Se não existe, cria um novo
  const { data, error } = await supabase
    .from('rsf_pilots')
    .insert({
      userid,
      username,
      real_name: realName,
      nationality
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Erro ao criar piloto: ${error.message}`);
  }

  return data;
}

// Função para criar campeonato
export async function createChampionship(championshipData: ChampionshipCreateInput): Promise<RsfChampionship> {
  const { data, error } = await supabase
    .from('rsf_championships')
    .insert(championshipData)
    .select()
    .single();

  if (error) {
    throw new Error(`Erro ao criar campeonato: ${error.message}`);
  }

  return data;
}

// Função para criar rally
export async function createRally(rallyData: RallyCreateInput): Promise<RsfRally> {
  const { data, error } = await supabase
    .from('rsf_rallies')
    .insert(rallyData)
    .select()
    .single();

  if (error) {
    throw new Error(`Erro ao criar rally: ${error.message}`);
  }

  return data;
}

// Função para criar etapa
export async function createStage(rallyId: number, stageName: string, stageNumber: number, distanceKm?: number, stageType: 'special' | 'super_special' | 'power_stage' = 'special'): Promise<RsfStage> {
  const { data, error } = await supabase
    .from('rsf_stages')
    .insert({
      rally_id: rallyId,
      stage_name: stageName,
      stage_number: stageNumber,
      distance_km: distanceKm,
      stage_type: stageType
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Erro ao criar etapa: ${error.message}`);
  }

  return data;
}

// Função para inserir resultado de etapa
export async function insertStageResult(resultData: StageResultInput): Promise<RsfStageResult> {
  const { data, error } = await supabase
    .from('rsf_stage_results')
    .insert({
      stage_id: resultData.stage_id,
      pilot_id: resultData.pilot_id,
      car_id: resultData.car_id,
      position: resultData.position,
      stage_time: resultData.stage_time,
      penalty_time: resultData.penalty_time || '00:00:00',
      super_rally: resultData.super_rally || false,
      dnf: resultData.dnf || false,
      dsq: resultData.dsq || false
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Erro ao inserir resultado da etapa: ${error.message}`);
  }

  return data;
}

// Função para calcular pontos WRC
export async function getWrcPoints(position: number): Promise<number> {
  const { data, error } = await supabase
    .from('rsf_wrc_points_system')
    .select('points')
    .eq('position', position)
    .single();

  if (error || !data) {
    return 0; // Se não encontrar pontuação para a posição, retorna 0
  }

  return data.points;
}

// Função para calcular e inserir resultado geral do rally
export async function calculateAndInsertRallyResult(rallyId: number, pilotId: number): Promise<RsfRallyResult> {
  // Buscar todos os resultados de etapas do piloto neste rally
  const { data: stageResults, error: stageError } = await supabase
    .from('rsf_stage_results')
    .select(`
      stage_time,
      penalty_time,
      position,
      dnf,
      dsq,
      rsf_stages!inner(rally_id)
    `)
    .eq('pilot_id', pilotId)
    .eq('rsf_stages.rally_id', rallyId);

  if (stageError) {
    throw new Error(`Erro ao buscar resultados das etapas: ${stageError.message}`);
  }

  // Verificar se o piloto foi desqualificado ou não terminou
  const hasDnf = stageResults?.some(result => result.dnf);
  const hasDsq = stageResults?.some(result => result.dsq);

  if (hasDnf || hasDsq) {
    // Se DNF ou DSQ, não pontua
    const { data, error } = await supabase
      .from('rsf_rally_points')
      .insert({
        rally_id: rallyId,
        pilot_id: pilotId,
        overall_position: 999, // Posição alta para DNF/DSQ
        total_time: '99:59:59',
        points_earned: 0
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao inserir resultado do rally: ${error.message}`);
    }

    return data;
  }

  // Calcular tempo total (soma dos tempos de etapa + penalidades)
  let totalSeconds = 0;
  stageResults?.forEach(result => {
    // Converter INTERVAL para segundos (assumindo formato HH:MM:SS)
    const stageTime = result.stage_time.split(':');
    const penaltyTime = result.penalty_time.split(':');
    
    totalSeconds += parseInt(stageTime[0]) * 3600 + parseInt(stageTime[1]) * 60 + parseInt(stageTime[2]);
    totalSeconds += parseInt(penaltyTime[0]) * 3600 + parseInt(penaltyTime[1]) * 60 + parseInt(penaltyTime[2]);
  });

  // Converter de volta para formato INTERVAL
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const totalTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Buscar posição geral (precisa calcular depois de todos os pilotos)
  // Por enquanto, vamos inserir com posição 0 e atualizar depois
  const { data, error } = await supabase
    .from('rsf_rally_points')
    .insert({
      rally_id: rallyId,
      pilot_id: pilotId,
      overall_position: 0, // Será atualizado depois
      total_time: totalTime,
      points_earned: 0 // Será calculado depois
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Erro ao inserir resultado do rally: ${error.message}`);
  }

  return data;
}

// Função para atualizar posições e pontos do rally
export async function updateRallyPositionsAndPoints(rallyId: number): Promise<void> {
  // Buscar todos os resultados do rally ordenados por tempo
  const { data: results, error } = await supabase
    .from('rsf_rally_points')
    .select('*')
    .eq('rally_id', rallyId)
    .order('total_time');

  if (error) {
    throw new Error(`Erro ao buscar resultados do rally: ${error.message}`);
  }

  // Atualizar posições e calcular pontos
  for (let i = 0; i < results.length; i++) {
    const position = i + 1;
    const points = await getWrcPoints(position);

    const { error: updateError } = await supabase
      .from('rsf_rally_points')
      .update({
        overall_position: position,
        points_earned: points
      })
      .eq('id', results[i].id);

    if (updateError) {
      throw new Error(`Erro ao atualizar posição e pontos: ${updateError.message}`);
    }
  }
}

// Função para atualizar classificação do campeonato
export async function updateChampionshipStandings(championshipId: number): Promise<void> {
  // Buscar todos os pontos dos rallies do campeonato
  const { data: rallyPoints, error } = await supabase
    .from('rsf_rally_points')
    .select(`
      pilot_id,
      points_earned,
      overall_position,
      rsf_rallies!inner(championship_id)
    `)
    .eq('rsf_rallies.championship_id', championshipId);

  if (error) {
    throw new Error(`Erro ao buscar pontos dos rallies: ${error.message}`);
  }

  // Agrupar por piloto
  const pilotStats = new Map<number, {
    totalPoints: number;
    ralliesCompleted: number;
    wins: number;
    podiums: number;
  }>();

  rallyPoints?.forEach(result => {
    const pilotId = result.pilot_id;
    const current = pilotStats.get(pilotId) || {
      totalPoints: 0,
      ralliesCompleted: 0,
      wins: 0,
      podiums: 0
    };

    current.totalPoints += result.points_earned;
    current.ralliesCompleted += 1;
    if (result.overall_position === 1) current.wins += 1;
    if (result.overall_position <= 3) current.podiums += 1;

    pilotStats.set(pilotId, current);
  });

  // Atualizar ou inserir na tabela de classificação
  for (const [pilotId, stats] of pilotStats) {
    const { error: upsertError } = await supabase
      .from('rsf_championship_standings')
      .upsert({
        championship_id: championshipId,
        pilot_id: pilotId,
        total_points: stats.totalPoints,
        rallies_completed: stats.ralliesCompleted,
        wins: stats.wins,
        podiums: stats.podiums,
        last_updated: new Date().toISOString()
      });

    if (upsertError) {
      throw new Error(`Erro ao atualizar classificação: ${upsertError.message}`);
    }
  }

  // Atualizar posições atuais
  const { data: standings, error: standingsError } = await supabase
    .from('rsf_championship_standings')
    .select('*')
    .eq('championship_id', championshipId)
    .order('total_points', { ascending: false })
    .order('wins', { ascending: false })
    .order('podiums', { ascending: false });

  if (standingsError) {
    throw new Error(`Erro ao buscar classificação: ${standingsError.message}`);
  }

  // Atualizar posições
  for (let i = 0; i < standings.length; i++) {
    const { error: positionError } = await supabase
      .from('rsf_championship_standings')
      .update({ current_position: i + 1 })
      .eq('id', standings[i].id);

    if (positionError) {
      throw new Error(`Erro ao atualizar posição: ${positionError.message}`);
    }
  }
}

// Função para buscar classificação do campeonato
export async function getChampionshipStandings(championshipId: number): Promise<any[]> {
  const { data, error } = await supabase
    .from('v_rsf_championship_current_standings')
    .select('*')
    .eq('championship_id', championshipId)
    .order('current_position');

  if (error) {
    throw new Error(`Erro ao buscar classificação: ${error.message}`);
  }

  return data || [];
}

// Função para processar CSV de resultados
export async function processStageResultsCSV(
  csvData: any[],
  rallyId: number,
  stageName: string,
  stageNumber: number
): Promise<{ success: boolean; message: string; errors?: string[] }> {
  const supabase = createClient();
  const errors: string[] = [];

  try {
    // Criar a etapa
    const stage = await createStage(rallyId, stageName, stageNumber);
    
    if (!stage) {
      return { success: false, message: 'Erro ao criar etapa' };
    }

    console.log(`Processando ${csvData.length} linhas do CSV`);

    // Processar cada linha do CSV
    for (let i = 0; i < csvData.length; i++) {
      const row = csvData[i];
      
      try {
        // Os dados já vêm parseados da função parseCSV
        const userid = row.userid;
        const username = row.user_name;
        const position = row.position;
        const time = row.time3;
        
        // Validar campos obrigatórios
        if (!userid || isNaN(userid)) {
          errors.push(`Linha ${i + 2}: userid '${userid}' não é um número válido`);
          continue;
        }
        
        if (!username) {
          errors.push(`Linha ${i + 2}: Campo user_name não encontrado ou vazio`);
          continue;
        }
        
        if (!position || isNaN(position)) {
          errors.push(`Linha ${i + 2}: position '${position}' não é um número válido`);
          continue;
        }
        
        if (!time) {
          errors.push(`Linha ${i + 2}: Campo time3 não encontrado ou vazio`);
          continue;
        }

        // Criar ou obter piloto usando a função existente
        const pilot = await createOrGetPilot(userid, username, row.real_name, row.nationality);

        // Inserir resultado da etapa (sem pontos - pontos são calculados no resultado geral do rally)
        const { error } = await supabase
          .from('rsf_stage_results')
          .insert({
            stage_id: stage.id,
            pilot_id: pilot.userid,
            position: position,
            stage_time: time,
            penalty_time: '00:00:00'
          });

        if (error) {
          errors.push(`Linha ${i + 2}: Erro ao inserir resultado - ${error.message}`);
        }
      } catch (rowError) {
        errors.push(`Linha ${i + 2}: Erro inesperado - ${rowError}`);
      }
    }

    if (errors.length > 0) {
      console.warn('Erros encontrados durante o processamento:', errors);
      return { 
        success: false, 
        message: `Processamento concluído com ${errors.length} erro(s)`, 
        errors 
      };
    }

    return { success: true, message: 'CSV processado com sucesso' };
  } catch (error) {
    console.error('Erro ao processar CSV:', error);
    return { success: false, message: `Erro ao processar CSV: ${error}` };
  }
}

// Função para buscar todos os campeonatos
export async function getAllChampionships(): Promise<RsfChampionship[]> {
  const { data, error } = await supabase
    .from('rsf_championships')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Erro ao buscar campeonatos: ${error.message}`);
  }

  return data || [];
}

// Função para buscar rallies de um campeonato
export async function getRalliesByChampionship(championshipId: number): Promise<RsfRally[]> {
  const { data, error } = await supabase
    .from('rsf_rallies')
    .select('*')
    .eq('championship_id', championshipId)
    .order('rally_date', { ascending: false });

  if (error) {
    throw new Error(`Erro ao buscar rallies: ${error.message}`);
  }

  return data || [];
}

// Função para buscar um campeonato por ID
export async function getChampionshipById(id: number): Promise<RsfChampionship | null> {
  const { data, error } = await supabase
    .from('rsf_championships')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw new Error(`Erro ao buscar campeonato: ${error.message}`);
  }

  return data;
}

// Função para buscar um rally por ID
export async function getRallyById(id: number): Promise<RsfRally | null> {
  const { data, error } = await supabase
    .from('rsf_rallies')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw new Error(`Erro ao buscar rally: ${error.message}`);
  }

  return data;
}
