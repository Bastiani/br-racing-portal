import { createClient } from "@/utils/supabase/client";
import { ChampionshipResult, CsvResult } from "@/types/championship";
import { processAndInsertChampionshipData } from "./scoring/championship-scoring";

const supabase = createClient();

// Função para buscar resultados de um campeonato específico
export async function getChampionshipResults(
  championshipId: string
): Promise<ChampionshipResult[]> {
  const { data, error } = await supabase
    .from("rsf-results-championship")
    .select(
      `
      *,
      rsf_rally:rsf-custom-championship(championship_name)
    `
    )
    .eq("rsf_rally", championshipId)
    .order("position");

  if (error) {
    console.error("Erro ao buscar resultados do campeonato:", error);
    throw error;
  }

  return data as unknown as ChampionshipResult[];
}

// Função para buscar histórico de pontos por piloto
export async function getDriverPointsHistory(
  userId: string,
  championshipId?: string
) {
  let query = supabase
    .from("rsf-results-championship")
    .select(
      `
      position,
      points,
      created_at,
      rsf_rally:rsf-custom-championship(championship_name, rally_id)
    `
    )
    .eq("userid", userId)
    .order("created_at");

  if (championshipId) {
    query = query.eq("rsf_rally", championshipId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Erro ao buscar histórico de pontos:", error);
    throw error;
  }

  return data;
}

// Função para importar resultados via CSV
export async function importChampionshipResults(
  csvData: CsvResult[],
  championshipId: string
) {
  try {
    const result = await processAndInsertChampionshipData(
      csvData,
      championshipId
    );
    console.log("Dados processados e inseridos:", result);
    return result;
  } catch (error) {
    console.error("Erro no processamento do CSV:", error);
    throw error;
  }
}

// Função para recalcular pontos de um campeonato
export async function recalculateChampionshipPoints(championshipId: string) {
  const { data, error } = await supabase.rpc(
    "recalculate_championship_standings",
    { championship_id: championshipId }
  );

  if (error) {
    console.error("Erro ao recalcular pontos:", error);
    throw error;
  }

  return data;
}
