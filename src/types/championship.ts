export interface ChampionshipResult {
  id: string;
  position: number;
  userid: number;
  user_name: string;
  real_name: string;
  nationality: string;
  car?: string;
  time3?: string;
  super_rally?: string;
  penalty?: string;
  points: number;
  rsf_rally: string;
  created_at: string;
}

export interface ChampionshipStanding {
  id: number;
  rsf_user_id: string;
  rsf_results_championship_id: string;
  points: number;
  created_at: string;
  user?: {
    id: string;
    name: string;
    nationality: string;
    rsf_id: number;
  };
}

export interface ChampionshipSummary {
  user_id: string;
  user_name: string;
  total_points: number;
  position_rank: number;
  nationality?: string;
  victories?: number;
}

export interface WRCPointsTable {
  position: number;
  points: number;
}

export const WRC_POINTS_TABLE: WRCPointsTable[] = [
  { position: 1, points: 25 },
  { position: 2, points: 18 },
  { position: 3, points: 15 },
  { position: 4, points: 12 },
  { position: 5, points: 10 },
  { position: 6, points: 8 },
  { position: 7, points: 6 },
  { position: 8, points: 4 },
  { position: 9, points: 2 },
  { position: 10, points: 1 },
];

export interface RsfResult {
  id?: string;
  created_at?: string;
  position?: number;
  userid: number;
  user_name?: string;
  real_name?: string;
  nationality?: string;
  car?: string;
  time3?: string;
  super_rally?: string;
  penalty?: string;
  rsf_rally?: string;
  points?: number;
  rally_date?: string;
}

export interface WrcPointsSystem {
  position: number;
  points: number;
}

export interface ChampionshipProcessingResult {
  success: boolean;
  insertedCount: number;
  errors?: string[];
}

export interface CsvResult {
  position: number | null;
  userid: number | null;
  user_name: string;
  real_name: string;
  nationality: string;
  car: string;
  time3: string;
  super_rally: number;
  penalty: number;
  rsf_rally?: string;
}
