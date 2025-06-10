import { createClient } from "@/utils/supabase/server";
import { ChampionshipResult, CsvResult } from "@/types/championship";
import {
  processAndInsertChampionshipData,
  recalculateChampionshipStandings,
} from "../scoring/championship-scoring";

// Função para buscar resultados de um campeonato específico
export async function getChampionshipResults(
  championshipId: string
): Promise<ChampionshipResult[]> {
  const supabase = await createClient();
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

// Função para buscar classificação do campeonato
export async function getChampionshipStandings(championshipId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rsf-championship-standings")
    .select(
      `
      *,
      rsf-users!inner(name, nationality)
    `
    )
    .eq("championship_id", championshipId)
    .order("position_in_championship");

  if (error) {
    console.error("Erro ao buscar classificação do campeonato:", error);
    throw error;
  }

  return data;
}

// Função para buscar histórico de pontos por piloto
export async function getDriverPointsHistory(
  userId: string,
  championshipId?: string
) {
  const supabase = await createClient();
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

// Função para recalcular standings de um campeonato
export async function recalculateChampionshipTotalPoints(
  championshipId: string
) {
  try {
    const success = await recalculateChampionshipStandings(championshipId);

    if (!success) {
      throw new Error("Falha ao recalcular pontos totais");
    }

    return { success: true };
  } catch (error) {
    throw new Error(`Erro ao recalcular pontos totais: ${error}`);
  }
}

// Função para buscar campeonatos customizados
export async function getCustomChampionships() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rsf-custom-championship")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar campeonatos:", error);
    throw error;
  }

  return data;
}

// Função para buscar um campeonato customizado específico
export async function getCustomChampionshipById(championshipId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rsf-custom-championship")
    .select("*")
    .eq("id", championshipId)
    .single();

  if (error) {
    console.error("Erro ao buscar campeonato:", error);
    throw error;
  }

  return data;
}