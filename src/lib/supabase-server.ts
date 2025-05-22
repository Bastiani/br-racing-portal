import { createClient } from '@supabase/supabase-js';
import type { RsfOnlineRally } from '../types/supabase';

// Inicializa o cliente Supabase para uso no lado do servidor
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Função para buscar todos os rallies
export async function getAllRallies() {
  const { data, error } = await supabase
    .from('rsf-online-rally')
    .select('*')
    .order('rally_name');

  if (error) {
    console.error('Erro ao buscar rallies:', error);
    throw error;
  }

  return data as RsfOnlineRally[];
}

// Função para buscar um rally por ID
export async function getRallyById(id: string) {
  const { data, error } = await supabase
    .from('rsf-online-rally')
    .select('*')
    .eq('id', id)
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
  filter
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
  let query = supabase
    .from('rsf-online-rally')
    .select('*');
  
  // Aplica ordenação se especificada
  if (orderBy) {
    query = query.order(
      orderBy.column, 
      { ascending: orderBy.ascending ?? true }
    );
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
    console.error('Erro ao buscar rallies com filtros:', error);
    throw error;
  }
  
  return data as RsfOnlineRally[];
}