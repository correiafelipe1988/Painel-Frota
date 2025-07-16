
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { MotorcycleStatus } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const translateMotorcycleStatus = (status?: MotorcycleStatus): string => {
  if (!status) return 'N/Definido';
  switch (status) {
    case 'active': return 'Ativa';
    case 'alugada': return 'Alugada';
    case 'manutencao': return 'Manutenção';
    case 'sucata': return 'Sucata';
    case 'sinistro': return 'Sinistro';
    case 'furtada': return 'Furtada';
    case 'apropriacao_indebita': return 'Apropriação Indébita';
    case 'nao_transferida': return 'Não Transferida';
    case 'vendida': return 'Vendida';
    case 'nao_localizada': return 'Não Localizada';
    default:
      const s = status as string;
      return s.charAt(0).toUpperCase() + s.slice(1);
  }
};

export const normalizeHeader = (header: string) => {
  return header.toLowerCase().trim().replace(/\s+/g, ' ').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};
