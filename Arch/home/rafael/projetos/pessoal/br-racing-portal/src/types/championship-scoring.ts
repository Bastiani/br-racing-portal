export interface RsfResult {
  id?: string
  created_at?: string
  position?: number
  userid: number
  user_name?: string
  real_name?: string
  nationality?: string
  car?: string
  time3?: string
  super_rally?: string
  penalty?: string
  rsf_rally?: string
  points?: number
  rally_date?: string
}

export interface WrcPointsSystem {
  position: number
  points: number
}

export interface ChampionshipProcessingResult {
  success: boolean
  insertedCount: number
  errors?: string[]
}