import {
  ChampionshipProcessingResult,
  CsvResult,
  WrcPointsSystem,
} from "@/types/championship";
import { createClient } from "@/utils/supabase/server";

/**
 * Filtra resultados por nacionalidade brasileira e recalcula posições
 * @param results Array de resultados do rally
 * @returns Array filtrado e com posições ajustadas
 */
export function filterAndAdjustBrazilianResults(
  results: CsvResult[]
): CsvResult[] {
  // Filtrar apenas pilotos brasileiros
  const brazilianResults = results.filter(
    (result) => result.nationality?.toUpperCase() === "BR"
  );

  // Ordenar por posição original para manter a ordem correta
  brazilianResults.sort((a, b) => (a.position || 0) - (b.position || 0));

  // Reajustar posições sequencialmente
  return brazilianResults.map((result, index) => ({
    ...result,
    position: index + 1,
  }));
}

/**
 * Busca o sistema de pontuação WRC
 * @returns Promise com array do sistema de pontuação
 */
export async function getWrcPointsSystem(): Promise<WrcPointsSystem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("wrc-points-system")
    .select("position, points")
    .order("position");

  if (error) {
    throw new Error(`Erro ao buscar sistema de pontuação: ${error.message}`);
  }

  return data || [];
}

/**
 * Calcula pontos baseado na posição e sistema WRC
 * @param position Posição do piloto
 * @param pointsSystem Sistema de pontuação WRC
 * @returns Pontos calculados
 */
export function calculatePoints(
  position: number,
  pointsSystem: WrcPointsSystem[]
): number {
  const pointEntry = pointsSystem.find((entry) => entry.position === position);
  return pointEntry ? pointEntry.points : 0;
}

/**
 * Função principal que processa CSV e insere dados com pontos calculados
 * @param csvResults Array de resultados do CSV
 * @param championshipId ID do rally
 * @returns Promise com resultados inseridos
 */
export async function processAndInsertChampionshipData(
  csvData: CsvResult[],
  championshipId: string
): Promise<ChampionshipProcessingResult> {
  let insertedCount = 0;
  const errors: string[] = [];

  const supabase = await createClient();

  try {
    // 1. Buscar sistema de pontos
    const pointsSystem = await getWrcPointsSystem();

    // 2. Processar e inserir cada resultado
    for (const result of csvData) {
      try {
        const points = calculatePoints(result.position || 0, pointsSystem);

        const { error } = await supabase
          .from("rsf-results-championship")
          .insert({
            position: result.position,
            userid: result.userid,
            user_name: result.user_name,
            real_name: result.real_name,
            nationality: result.nationality,
            car: result.car,
            time3: result.time3,
            super_rally: result.super_rally,
            penalty: result.penalty,
            points: points,
            rsf_rally: championshipId,
            rsf_rally_id: result.rsf_rally_id,
          });

        if (error) {
          errors.push(
            `Erro ao inserir resultado para ${result.user_name}: ${error.message}`
          );
        } else {
          insertedCount++;
        }
      } catch (err) {
        errors.push(`Erro ao processar ${result.user_name}: ${err}`);
      }
    }

    // 3. Após inserir todos os resultados, atualizar standings
    if (insertedCount > 0) {
      const standingsUpdated = await updateChampionshipStandings(
        championshipId
      );
      if (!standingsUpdated) {
        errors.push("Erro ao atualizar classificação do campeonato");
      }
    }

    return {
      success: errors.length === 0,
      insertedCount,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error) {
    return {
      success: false,
      insertedCount: 0,
      errors: [`Erro geral no processamento: ${error}`],
    };
  }
}

// Função para calcular pontos totais de um piloto em um campeonato
export async function calculateDriverTotalPoints(
  userId: string,
  championshipId: string
): Promise<number> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rsf-results-championship")
    .select("points")
    .eq("userid", userId)
    .eq("rsf_rally", championshipId);

  if (error) {
    console.error("Erro ao calcular pontos totais:", error);
    return 0;
  }

  return data?.reduce((total, result) => total + (result.points || 0), 0) || 0;
}

// Função para atualizar standings do campeonato
export async function updateChampionshipStandings(
  championshipId: string
): Promise<boolean> {
  try {
    const supabase = await createClient();
    // 1. Buscar todos os pilotos que participaram do campeonato
    const { data: participants, error: participantsError } = await supabase
      .from("rsf-results-championship")
      .select(
        `
        userid,
        "rsf-users"!inner(id, name, rsf_id)
      `
      )
      .eq("rsf_rally", championshipId);

    if (participantsError) {
      throw participantsError;
    }

    // 2. Calcular pontos totais para cada piloto
    const standingsData = [];
    const uniqueParticipants = Array.from(
      new Set(participants?.map((p) => p?.userid ?? ""))
    ).map((userid) => participants?.find((p) => p.userid === userid));

    for (const participant of uniqueParticipants || []) {
      if (!participant) continue;

      const totalPoints = await calculateDriverTotalPoints(
        participant?.userid?.toString() || "",
        championshipId
      );
      console.log("==============>>>> participant ", participant);
      standingsData.push({
        rsf_user_id: participant["rsf-users"]?.id,
        championship_id: championshipId,
        total_points: totalPoints,
        user_name: participant["rsf-users"]?.name,
      });
    }

    // 3. Ordenar por pontos (decrescente) e nome (crescente)
    standingsData.sort((a, b) => {
      if (b.total_points !== a.total_points) {
        return b.total_points - a.total_points;
      }
      return a.user_name.localeCompare(b.user_name);
    });

    // 4. Adicionar posições
    const standingsWithPositions = standingsData.map((standing, index) => ({
      ...standing,
      position_in_championship: index + 1,
    }));

    // 5. Limpar standings existentes do campeonato
    await supabase
      .from("rsf-championship-standings")
      .delete()
      .eq("championship_id", championshipId);

    // 6. Inserir novos standings
    if (standingsWithPositions.length > 0) {
      const { error: insertError } = await supabase
        .from("rsf-championship-standings")
        .insert(standingsWithPositions);

      if (insertError) {
        throw insertError;
      }
    }

    return true;
  } catch (error) {
    console.error("Erro ao atualizar standings:", error);
    return false;
  }
}

// Função auxiliar para recalcular standings manualmente
export async function recalculateChampionshipStandings(
  championshipId: string
): Promise<boolean> {
  return await updateChampionshipStandings(championshipId);
}
