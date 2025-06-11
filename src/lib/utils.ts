import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formata uma data do banco de dados para exibição em português brasileiro
 * Corrige o problema de diferença de um dia causado pela interpretação UTC
 * @param date - String da data no formato YYYY-MM-DD ou objeto Date
 * @returns String formatada da data em português brasileiro
 */
export function formatDatabaseDate(date: string | Date): string {
  let localDate: Date;
  
  if (typeof date === 'string') {
    const [year, month, day] = date.split('-').map(Number)
    localDate = new Date(year, month - 1, day)
  } else {
    // Se for um objeto Date, criar uma nova data local para evitar problemas de timezone
    localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  }
  
  return localDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}
