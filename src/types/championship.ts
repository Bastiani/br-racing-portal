// Tipos TypeScript baseados no schema championship.sql

// Tabela de pilotos
export interface RsfPilot {
  id: number;
  userid: number;
  username: string;
  real_name?: string;
  nationality: string;
  created_at: Date;
}

// Tabela de categorias de carros
export interface RsfCarCategory {
  id: number;
  name: string;
  description?: string;
  created_at: Date;
}

// Tabela de veículos/carros
export interface RsfCar {
  id: number;
  model: string;
  category: string;
  created_at: Date;
  category_id?: number;
}

// Tabela de campeonatos
export interface RsfChampionship {
  id: number;
  name: string;
  season: number;
  status: "active" | "finished" | "cancelled";
  start_date?: Date;
  end_date?: Date;
  image_url?: string;
  created_at: Date;
}

// Tabela de rallies
export interface RsfRally {
  id: number;
  championship_id: number;
  name: string;
  location?: string;
  rally_date: Date;
  rsf_rally: string; // UUID
  status: "scheduled" | "ongoing" | "finished" | "cancelled";
  created_at: Date;
}

// Tabela de etapas
export interface RsfStage {
  id: number;
  rally_id: number;
  stage_name: string;
  stage_number: number;
  distance_km?: number;
  stage_type: "special" | "super_special" | "power_stage";
  created_at: Date;
}

// Tabela de resultados por etapa
export interface RsfStageResult {
  id: number;
  stage_id: number;
  pilot_id: number;
  car_id?: number;
  position: number;
  stage_time: string; // INTERVAL como string
  penalty_time: string; // INTERVAL como string
  super_rally: boolean;
  dnf: boolean;
  dsq: boolean;
  created_at: Date;
}

// Tabela de resultados gerais do rally
export interface RsfRallyResult {
  id: number;
  rally_id: number;
  pilot_id: number;
  overall_position: number;
  total_time: string; // INTERVAL como string
  points_earned: number;
  created_at: Date;
}

// Tabela de classificação do campeonato
export interface RsfChampionshipStanding {
  id: number;
  championship_id: number;
  pilot_id: number;
  total_points: number;
  rallies_completed: number;
  wins: number;
  podiums: number;
  current_position?: number;
  last_updated: Date;
}

// Sistema de pontuação WRC
export interface WrcPointsSystem {
  position: number;
  points: number;
}

// View de classificação atual do campeonato
export interface VRsfChampionshipCurrentStanding {
  championship_id: number;
  championship_name: string;
  current_position?: number;
  username: string;
  real_name?: string;
  nationality: string;
  total_points: number;
  rallies_completed: number;
  wins: number;
  podiums: number;
}

// Tipos auxiliares para operações
export interface ChampionshipCreateInput {
  name: string;
  season: number;
  status?: 'active' | 'finished' | 'cancelled';
  start_date?: Date;
  end_date?: Date;
  image_url?: string;
}

export interface RallyCreateInput {
  championship_id: number;
  name: string;
  location?: string;
  rally_date: Date;
  rsf_rally: string;
  status?: "scheduled" | "ongoing" | "finished" | "cancelled";
}

export interface StageResultInput {
  stage_id: number;
  pilot_id: number;
  car_id?: number;
  position: number;
  stage_time: string;
  penalty_time?: string;
  super_rally?: boolean;
  dnf?: boolean;
  dsq?: boolean;
}
