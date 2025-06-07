import { CsvResult, WrcPointsSystem } from "@/types/championship";
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
  console.log("=====>>> Buscando sistema de pontuação WRC...");
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
 * Processa dados CSV e calcula pontos para pilotos brasileiros
 * @param csvResults Array de resultados do CSV
 * @param rallyId ID do rally
 * @returns Promise com resultados processados
 */
export async function processChampionshipResults(
  csvResults: CsvResult[],
  rallyId: string
): Promise<CsvResult[]> {
  try {
    // 1. Filtrar e ajustar posições dos pilotos brasileiros
    const brazilianResults = filterAndAdjustBrazilianResults(csvResults);

    // 2. Buscar sistema de pontuação WRC
    const pointsSystem = await getWrcPointsSystem();

    // 3. Calcular pontos para cada resultado
    const resultsWithPoints = brazilianResults.map((result) => ({
      ...result,
      points: calculatePoints(result.position || 0, pointsSystem),
      rsf_rally: rallyId,
    }));

    return resultsWithPoints;
  } catch (error) {
    console.error("Erro ao processar resultados do campeonato:", error);
    throw error;
  }
}

/**
 * Insere resultados processados na tabela rsf-results-championship
 * @param results Array de resultados processados
 * @returns Promise com resultados da inserção
 */
export async function insertChampionshipResults(results: CsvResult[]) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("rsf-results-championship")
      .insert(results)
      .select();

    if (error) {
      throw new Error(`Erro ao inserir resultados: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Erro ao inserir resultados do campeonato:", error);
    throw error;
  }
}

export async function verifyAndIncludeUsers(results: CsvResult[]) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Usuário não autenticado");
  }
  results.forEach(async (result) => {
    const { data: userExists } = await supabase
      .from("rsf-users")
      .select("rsf_id")
      .eq("rsf_id", result.userid)
      .single();

    if (!userExists) {
      const { error } = await supabase.from("rsf-users").insert({
        rsf_id: result.userid,
        name: result.real_name || result.user_name,
        nationality: result.nationality,
        victories: 0,
        first: 0,
        second: 0,
        third: 0,
      });
      if (error) {
        throw new Error(`Erro ao inserir usuário: ${error.message}`);
      }
    }
  });
}

/**
 * Função principal que processa CSV e insere dados com pontos calculados
 * @param csvResults Array de resultados do CSV
 * @param rallyId ID do rally
 * @returns Promise com resultados inseridos
 */
export async function processAndInsertChampionshipData(
  csvResults: CsvResult[],
  rallyId: string
) {
  try {
    // Processar resultados (filtrar BR, ajustar posições, calcular pontos)
    const processedResults = await processChampionshipResults(
      csvResults,
      rallyId
    );

    await verifyAndIncludeUsers(processedResults);

    // Inserir na tabela
    const insertedResults = await insertChampionshipResults(processedResults);

    console.log(
      `${insertedResults?.length || 0} resultados inseridos com sucesso`
    );
    return insertedResults;
  } catch (error) {
    console.error("Erro no processamento completo:", error);
    throw error;
  }
}
