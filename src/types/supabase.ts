export interface RsfOnlineRally {
  id: string;
  rally_name: string;
  rally_id: number;
  created_at: string;
}

export interface RsfResult {
  position?: number;
  userid: number;
  user_name: string;
  real_name: string;
  nationality: string;
  car?: string;
  time3?: string;
  super_rally?: string;
  penalty?: string;
  id?: string;
  rsf_rally?: { rally_name: string }[];
  rally_name?: string;
}
