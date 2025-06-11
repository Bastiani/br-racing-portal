export interface RsfUser {
  id: string;
  name: string;
  victories: number;
  nationality: string;
  rsf_id: number;
  first: number;
  second: number;
  third: number;
}

// ===== RALLY & CHAMPIONSHIP TYPES =====

export interface RsfOnlineRally {
  id: string;
  rally_name: string;
  rally_id: number;
  created_at: string;
}

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
  rsf_rally?: string | { rally_name: string }[];
  rally_name?: string;
  points?: number;
  rally_date?: string;
}

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
  rsf_rally_id?: number | null;
}

// ===== CONSTANTS =====

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

// ===== UI COMPONENT TYPES =====

export interface ItemCardProps {
  url: string;
  nome: string;
  descricao: string;
  imagem: string;
  icone?: React.ReactNode;
}

export interface PageProps {
  children: React.ReactNode;
  className?: string;
  withHeader?: boolean;
  withFooter?: boolean;
}

// ===== FORM & INPUT TYPES =====

import { IconType } from "react-icons";

export interface InputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: IconType;
  error?: string;
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  icon?: IconType;
}

// Remove the empty CardProps interface completely since it's equivalent to its supertype
// export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

// ===== INTERNAL COMPONENT TYPES =====

export interface SectionHeaderProps {
  title: string;
  icon: IconType;
}

export interface CheckboxFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

// ===== HOOK TYPES =====

export interface UseRsfOnlineRallyOptions {
  enabled?: boolean;
  refetchInterval?: number;
}

// ===== DATABASE TYPES =====

export interface RsfUser {
  id: string;
  name: string;
  nationality: string;
}

// ===== FORM SPECIFIC TYPES =====

export interface RallyFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any;
  isLoading?: boolean;
}

export interface RallyResultsProps {
  rallyId: string;
  results: RsfResult[];
}

export interface FourFanListProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  isLoading: boolean;
}

// ===== TABLE TYPES =====

export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
}

export interface BaseTableProps {
  columns: Column[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  isLoading?: boolean;
}
