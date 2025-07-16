export type MotorcycleStatus = 'active' | 'alugada' | 'manutencao' | 'sucata' | 'sinistro' | 'furtada' | 'apropriacao_indebita' | 'nao_transferida' | 'vendida' | 'nao_localizada';
export type MotorcycleType = 'nova' | 'usada';

export interface Motorcycle {
  id: string;
  placa?: string;
  model?: string;
  status?: MotorcycleStatus;
  type?: MotorcycleType;
  franqueado?: string;
  data_criacao?: string; // ISO 8601 format: "YYYY-MM-DDTHH:mm:ss.sssZ"
  data_ultima_mov?: string; // ISO 8601 format: "YYYY-MM-DDTHH:mm:ss.sssZ"
  tempo_ocioso_dias?: number;
  qrCodeUrl?: string;
  uf?: string; // Unidade Federativa
  cidade?: string; // Cidade
  localCompra?: string; // Local de Compra / Distrato
  contagemPausada?: boolean;
  dias_ociosos_congelados?: number; // Dias ociosos no momento que entrou em manutenção
  valorSemanal?: number; // Valor semanal da moto
  caucao?: number; // Valor da caução
}

export type Kpi = {
  title: string;
  value: string;
  icon: React.ElementType;
  description: string;
  color?: string;
  iconBgColor?: string;
  iconColor?: string;
  titleClassName?: string;
  valueClassName?: string;
  descriptionClassName?: string;
};

export type ChartDataPoint = {
  month: string;
  count?: number;
  revenue?: number;
};

export interface NavItem {
  href: string;
  label: string;
  subLabel?: string;
  labelTooltip?: string;
  icon: React.ElementType;
}

export interface StatusRapidoItem {
  label: string;
  subLabel: string;
  count: number;
  bgColor: string;
  textColor: string;
  badgeTextColor: string;
  statusKey?: MotorcycleStatus;
  icon: React.ElementType;
}

export interface RastreadorData {
  id?: string;
  cnpj: string;
  empresa: string;
  franqueado: string;
  chassi: string;
  placa: string;
  rastreador: string;
  tipo: string;
  moto: string;
  mes: string;
  valor: string;
}
