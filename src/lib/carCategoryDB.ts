import { createClient } from "@/utils/supabase/client";
import { createClient as createServerClient } from "@/utils/supabase/server";
import { RsfCarCategory } from "@/types/championship";

async function getSupabaseClient() {
  if (typeof window === 'undefined') {
    // Server-side: use server client
    return await createServerClient();
  } else {
    // Client-side: use browser client
    return createClient();
  }
}

export interface CarCategoryCreateInput {
  name: string;
  description?: string;
}

export interface CarCategoryUpdateInput {
  name?: string;
  description?: string;
}

// Função para buscar todas as categorias
export async function getCarCategories(): Promise<RsfCarCategory[]> {
  const supabase = await getSupabaseClient();
  
  const { data, error } = await supabase
    .from('rsf_car_categories')
    .select('*')
    .order('name');

  if (error) {
    throw new Error(`Erro ao buscar categorias: ${error.message}`);
  }

  return data || [];
}

// Função para buscar categoria por ID
export async function getCarCategoryById(id: number): Promise<RsfCarCategory | null> {
  const supabase = await getSupabaseClient();
  
  const { data, error } = await supabase
    .from('rsf_car_categories')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Categoria não encontrada
    }
    throw new Error(`Erro ao buscar categoria: ${error.message}`);
  }

  return data;
}

// Função para criar categoria
export async function createCarCategory(categoryData: CarCategoryCreateInput): Promise<RsfCarCategory> {
  const supabase = await getSupabaseClient();
  
  const { data, error } = await supabase
    .from('rsf_car_categories')
    .insert(categoryData)
    .select()
    .single();

  if (error) {
    throw new Error(`Erro ao criar categoria: ${error.message}`);
  }

  return data;
}

// Função para atualizar categoria
export async function updateCarCategory(id: number, categoryData: CarCategoryUpdateInput): Promise<RsfCarCategory> {
  const supabase = await getSupabaseClient();
  
  const { data, error } = await supabase
    .from('rsf_car_categories')
    .update(categoryData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Erro ao atualizar categoria: ${error.message}`);
  }

  return data;
}

// Função para deletar categoria
export async function deleteCarCategory(id: number): Promise<void> {
  const supabase = await getSupabaseClient();
  
  const { error } = await supabase
    .from('rsf_car_categories')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Erro ao deletar categoria: ${error.message}`);
  }
}

// Função para verificar se uma categoria está sendo usada
export async function isCarCategoryInUse(id: number): Promise<boolean> {
  const supabase = await getSupabaseClient();
  
  // Verifica se há carros usando esta categoria
  const { data: cars, error: carsError } = await supabase
    .from('rsf_cars')
    .select('id')
    .eq('category_id', id)
    .limit(1);

  if (carsError) {
    throw new Error(`Erro ao verificar uso da categoria: ${carsError.message}`);
  }

  if (cars && cars.length > 0) {
    return true;
  }

  // Verifica se há resultados de rally usando esta categoria
  const { data: rallyPoints, error: rallyError } = await supabase
    .from('rsf_rally_points')
    .select('id')
    .eq('category_id', id)
    .limit(1);

  if (rallyError) {
    throw new Error(`Erro ao verificar uso da categoria: ${rallyError.message}`);
  }

  return rallyPoints && rallyPoints.length > 0;
}