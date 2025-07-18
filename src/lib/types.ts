export type MotorcycleStatus = 'active' | 'alugada' | 'manutencao' | 'sucata' | 'sinistro' | 'furtada' | 'apropriacao_indebita' | 'nao_transferida' | 'vendida' | 'nao_localizada';
export type MotorcycleType = 'nova' | 'usada';

// Tipos para o módulo de Cadastro de Veículos
export type VehicleStatus = 'locada' | 'disponivel' | 'parada' | 'sinistro' | 'sucata';
export type VehicleType = 'Work' | 'Cargo' | 'Urbana' | 'Sport' | 'Outro';
export type VehicleFuelType = 'flex' | 'gasolina' | 'etanol' | 'diesel' | 'eletrico';
export type VehicleOwnershipStatus = 'propria' | 'gerenciada' | 'vendida' | 'distratada';
export type VehicleOrigin = 'compra' | 'distrato' | 'transferencia';
export type VehicleDREStatus = 'ativa' | 'inativa' | 'ficticia';

export interface VehicleRegistry {
  id: string;
  
  // 1. Identificação do Veículo
  placa: string;
  chassi?: string;
  renavam?: string;
  marca?: string;
  modelo?: string;
  anoFabricacao?: number;
  anoModelo?: number;
  tipo?: VehicleType;
  corPredominante?: string;
  tipoCombustivel?: VehicleFuelType;
  
  // 2. Situação Documental e Legal
  statusPropriedade?: VehicleOwnershipStatus;
  cnpjProprietario?: string;
  tpvEmitida?: boolean;
  dataUltimaTransferencia?: string;
  licenciamentoEmDia?: boolean;
  seguroAtivo?: boolean | null; // null para "cancelado"
  multasPendentes?: boolean;
  valorMultasPendentes?: number;
  ipvaEmAberto?: boolean;
  valorIpvaEmAberto?: number;
  rastreadorAtivo?: boolean;
  chassiComBaixa?: boolean | null; // null para "em processo"
  
  // 3. Localização e Operação
  cidade?: string;
  estado?: string;
  localArmazenamento?: string;
  funcionarioResponsavel?: string;
  disponibilidade?: VehicleStatus;
  locatarioAtual?: string;
  locatarioCpf?: string;
  csResponsavel?: string;
  
  // 4. Dados Financeiros e Históricos
  dataAquisicao?: string;
  origem?: VehicleOrigin;
  valorAquisicao?: number;
  receitaTotalGerada?: number;
  valorTotalMultasPagas?: number;
  gastosManutencaoAcumulados?: number;
  statusDre?: VehicleDREStatus;
  
  // 5. Observações e Anexos
  observacoesOperacionais?: string;
  linkDocumentos?: string;
  boletimOcorrencia?: boolean | null; // null para "em andamento"
  dataUltimaVistoria?: string;
  
  // Extras
  codigoSistemaInterno?: string;
  codigoAsaas?: string;
  tagRastreamento?: string;
  
  // Metadados
  dataCriacao?: string;
  dataUltimaAtualizacao?: string;
  criadoPor?: string;
  atualizadoPor?: string;
}

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
