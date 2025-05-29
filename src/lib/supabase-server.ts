import { createClient as supabaseClient } from "@supabase/supabase-js";
// import type { NextApiRequest, NextApiResponse } from 'next';

import { RsfOnlineRally, RsfResult } from "@/types/supabase";
import { createClient } from "@/utils/supabase/client";
import { Pilot } from "@/app/components/PilotsTable";

interface RsfUser {
  id: string;
  name: string;
  victories: number;
  nationality: string;
  rsf_id: number;
  first: number;
  second: number;
  third: number;
}

// Inicializa o cliente Supabase para uso no lado do servidor
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabaseAuth = createClient();
const supabase = supabaseClient(supabaseUrl, supabaseAnonKey);

// Função para buscar todos os rallies
export async function getAllRallies() {
  const { data, error } = await supabase
    .from("rsf-online-rally")
    .select("*")
    .order("rally_name");

  if (error) {
    console.error("Erro ao buscar rallies:", error);
    throw error;
  }

  return data as RsfOnlineRally[];
}

// Função para buscar um rally por ID
export async function getRallyById(id: string) {
  const { data, error } = await supabase
    .from("rsf-online-rally")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Erro ao buscar rally com ID ${id}:`, error);
    throw error;
  }

  return data as RsfOnlineRally;
}

// Função para buscar rallies com filtros
export async function getRalliesWithFilters({
  limit,
  orderBy,
  filter,
}: {
  limit?: number;
  orderBy?: {
    column: keyof RsfOnlineRally;
    ascending?: boolean;
  };
  filter?: {
    column: keyof RsfOnlineRally;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any;
  };
}) {
  let query = supabase.from("rsf-online-rally").select("*");

  // Aplica ordenação se especificada
  if (orderBy) {
    query = query.order(orderBy.column, {
      ascending: orderBy.ascending ?? true,
    });
  }

  // Aplica filtro se especificado
  if (filter) {
    query = query.eq(filter.column, filter.value);
  }

  // Aplica limite se especificado
  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Erro ao buscar rallies com filtros:", error);
    throw error;
  }

  return data as RsfOnlineRally[];
}

// Função para buscar resultados de um rally específico
export async function getRallyResults(rallyId: string) {
  const { data, error } = await supabase
    .from("rsf-results")
    .select(
      `
      position,
      userid,
      user_name,
      real_name,
      nationality,
      car,
      time3,
      super_rally,
      penalty,
      id,
      rsf_rally
    `
    )
    .eq("rsf_rally", rallyId)
    .order("position");

  if (error) {
    console.error(`Erro ao buscar resultados do rally ${rallyId}:`, error);
    throw error;
  }

  return data as RsfResult[];
}

// Função para buscar todos os resultados de pilotos brasileiros
export async function getBrazilianResults(): Promise<RsfResult[]> {
  const { data, error } = await supabase
    .from("rsf-results")
    .select(
      `
      userid,
      user_name,
      real_name,
      nationality,
      position
    `
    )
    .eq("nationality", "BR");

  if (error) {
    console.error("Erro ao buscar resultados de pilotos brasileiros:", error);
    throw error;
  }

  // Usar um Map para manter apenas o resultado mais recente de cada usuário
  const uniqueResults = new Map<number, RsfResult>();
  (data as RsfResult[]).forEach((result) => {
    if (!uniqueResults.has(result.userid)) {
      uniqueResults.set(result.userid, result);
    }
  });

  return Array.from(uniqueResults.values());
}

// Função para criar um novo usuário na tabela rsf-users
export async function createRsfUser(
  userData: Omit<RsfUser, "id">
  // req: NextApiRequest,
  // res: NextApiResponse
) {
  const {
    data: { user },
    error: authError,
  } = await supabaseAuth.auth.getUser();

  if (authError || !user) {
    throw new Error("Usuário não autenticado");
  }

  // Procede com a criação do usuário apenas se estiver autenticado
  const { data, error } = await supabaseAuth
    .from("rsf-users")
    .insert([userData])
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar usuário:", error);
    throw error;
  }

  return data as RsfUser;
}

// Busca todos os pilotos com suas posições de pódio
export async function getAllPilots(): Promise<Pilot[]> {
  const { data, error } = await supabase
    .from("rsf-users")
    .select("id, name, first, second, third")
    .order("name", { ascending: true });

  if (error) throw error;

  return data as Pilot[]; // ou configure o Supabase com types automáticos.
}

// Função para buscar todos os pódios de um piloto específico
export async function getDriverPodiums(userId: number, position?: number) {
  const { data, error } = await supabase
    .from("rsf-results")
    .select(
      `
      position,
      userid,
      user_name,
      real_name,
      nationality,
      car,
      time3,
      super_rally,
      penalty,
      id,
      rsf_rally
    `
    )
    .eq("userid", userId)
    .in("position", position ? [position] : [1, 2, 3])
    .order("position");

  if (error) {
    console.error(`Erro ao buscar pódios do piloto ${userId}:`, error);
    throw error;
  }

  return data as RsfResult[];
}
// Função para atualizar as estatísticas de pódios de um piloto
export async function updateDriverPodiumStats(userId: number) {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabaseAuth.auth.getUser();

    if (authError || !user) {
      throw new Error("Usuário não autenticado");
    }

    // Busca a quantidade de primeiros lugares
    const firstPlaces = await getDriverPodiums(userId, 1);
    // Busca a quantidade de segundos lugares
    const secondPlaces = await getDriverPodiums(userId, 2);
    // Busca a quantidade de terceiros lugares
    const thirdPlaces = await getDriverPodiums(userId, 3);

    // Atualiza a tabela rsf-users com as quantidades
    const { data, error } = await supabaseAuth
      .from("rsf-users")
      .update({
        first: firstPlaces.length,
        second: secondPlaces.length,
        third: thirdPlaces.length,
      })
      .eq("rsf_id", userId)
      .select();

    if (error) {
      console.error(
        `Erro ao atualizar estatísticas do piloto ${userId}:`,
        error
      );
      throw error;
    }

    return data as RsfUser[];
  } catch (error) {
    console.error(`Erro ao processar estatísticas do piloto ${userId}:`, error);
    throw error;
  }
}
