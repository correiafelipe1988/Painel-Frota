
"use client";

import { useState, useMemo, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Motorcycle, MotorcycleStatus } from "@/lib/types";
import { Button } from '@/components/ui/button';
import { MoreHorizontal, QrCode, Eye, Edit, Trash2, CheckCircle, XCircle, Bike, Wrench, Play, Pause } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import type { MotorcyclePageFilters } from '@/app/motorcycles/page';
import { differenceInCalendarDays, parseISO, isValid as dateIsValid } from 'date-fns';
import { calculateCorrectIdleDays } from '@/lib/firebase/motorcycleService';

const getStatusBadgeVariant = (status?: MotorcycleStatus) => {
  if (!status) return 'outline';
  switch (status) {
    case 'active': return 'default';
    case 'alugada': return 'default';
    case 'manutencao': return 'secondary';
    case 'sucata': return 'destructive';
    case 'sinistro': return 'destructive';
    case 'furtada': return 'destructive';
    case 'apropriacao_indebita': return 'destructive';
    case 'nao_transferida': return 'outline';
    case 'vendida': return 'default';
    case 'nao_localizada': return 'destructive';
    default: return 'outline';
  }
};

const getStatusBadgeClassName = (status?: MotorcycleStatus) => {
  if (!status) return 'bg-gray-200 text-gray-700 border-gray-400';
  switch (status) {
    case 'active': return 'bg-green-500 hover:bg-green-600 text-white border-green-500';
    case 'alugada': return 'bg-sky-500 hover:bg-sky-600 text-white border-sky-500';
    case 'manutencao': return 'bg-yellow-500 hover:bg-yellow-600 text-black border-yellow-500';
    case 'sucata': return 'bg-gray-600 hover:bg-gray-700 text-white border-gray-600';
    case 'sinistro': return 'bg-red-600 hover:bg-red-700 text-white border-red-600';
    case 'furtada': return 'bg-red-500 hover:bg-red-600 text-white border-red-500';
    case 'apropriacao_indebita': return 'bg-orange-600 hover:bg-orange-700 text-white border-orange-600';
    case 'nao_transferida': return 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600';
    case 'vendida': return 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600';
    case 'nao_localizada': return 'bg-gray-500 hover:bg-gray-600 text-white border-gray-500';
    default: return 'bg-gray-200 text-gray-700 border-gray-400';
  }
}


const translateStatus = (status?: MotorcycleStatus): string => {
  if (!status) return 'N/Definido';
  switch (status) {
    case 'active': return 'Disponível';
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

interface MotorcycleListProps {
  filters: MotorcyclePageFilters;
  motorcycles: Motorcycle[];
  onUpdateStatus: (motorcycleId: string, newStatus: MotorcycleStatus) => void;
  onDeleteMotorcycle: (motorcycleId: string) => void;
  onEditMotorcycle: (motorcycle: Motorcycle) => void;
  onPauseIdleCount: (motorcycle: Motorcycle) => void;
}

export function MotorcycleList({ filters, motorcycles, onUpdateStatus, onDeleteMotorcycle, onEditMotorcycle, onPauseIdleCount }: MotorcycleListProps) {
  const [clientMounted, setClientMounted] = useState(false);
  useEffect(() => {
    setClientMounted(true);
  }, []);

  const filteredMotorcycles = useMemo(() => {
    return motorcycles.filter(moto => {
      const statusMatch = filters.status === 'all' || moto.status === filters.status;
      const modelMatch = filters.model === 'all' || (moto.model || '').toLowerCase().includes(filters.model.toLowerCase());
      const searchTermMatch = filters.searchTerm === '' ||
        (moto.placa || '').toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        (moto.franqueado || '').toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        (moto.model || '').toLowerCase().includes(filters.searchTerm.toLowerCase());

      return statusMatch && modelMatch && searchTermMatch;
    });
  }, [filters, motorcycles]);

  if (!clientMounted) {
    return (
      <div className="mt-4 text-center text-muted-foreground">
        Carregando dados das motocicletas...
      </div>
    );
  }

  return (
    <div className="bg-card p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          {`Motocicletas (${filteredMotorcycles.length} encontradas)`}
        </h3>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Placa</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Franqueado</TableHead>
              <TableHead>UF</TableHead>
              <TableHead>Cidade</TableHead>
              <TableHead>Local de Compra/Distrato</TableHead>
              <TableHead>Últ. Movimento</TableHead>
              <TableHead>Ociosa (Dias)</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMotorcycles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center text-muted-foreground h-24">
                  Nenhuma motocicleta corresponde aos filtros atuais.
                </TableCell>
              </TableRow>
            ) : (
              filteredMotorcycles.map((moto) => {
                // Usar a nova função que considera o histórico de movimentações
                const daysIdle = calculateCorrectIdleDays(motorcycles, moto);

                return (
                  <TableRow key={moto.id}>
                    <TableCell className="font-medium">{moto.placa}</TableCell>
                    <TableCell>{moto.model || 'N/Definido'}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(moto.status)} className={getStatusBadgeClassName(moto.status)}>
                        {translateStatus(moto.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="capitalize">{moto.type ? (moto.type === 'nova' ? 'Nova' : 'Usada') : 'N/Definido'}</TableCell>
                    <TableCell>{moto.franqueado || 'N/Definido'}</TableCell>
                    <TableCell>{moto.uf || 'N/A'}</TableCell>
                    <TableCell>{moto.cidade || 'N/A'}</TableCell>
                    <TableCell>{moto.localCompra || 'N/A'}</TableCell>
                    <TableCell>{moto.data_ultima_mov ? new Date(moto.data_ultima_mov + 'T00:00:00Z').toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'N/A'}</TableCell>
                    <TableCell>
                      {daysIdle === 'Pausado' ? <Badge variant="secondary">Pausado</Badge> : daysIdle}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => console.log('Ver Detalhes:', moto)}>
                            <Eye className="mr-2 h-4 w-4" /> Ver Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEditMotorcycle(moto)}>
                            <Edit className="mr-2 h-4 w-4" /> Editar
                          </DropdownMenuItem>
                          
                          {moto.status === 'manutencao' || moto.status === 'active' ? (
                            <DropdownMenuItem onClick={() => onPauseIdleCount(moto)}>
                              {moto.contagemPausada ? (
                                <Play className="mr-2 h-4 w-4 text-green-500" />
                              ) : (
                                <Pause className="mr-2 h-4 w-4 text-yellow-500" />
                              )}
                              {moto.contagemPausada ? 'Retomar Contagem' : 'Parar Contagem'}
                            </DropdownMenuItem>
                          ) : null}

                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onUpdateStatus(moto.id, 'alugada')}>
                            <Bike className="mr-2 h-4 w-4 text-sky-500" /> Alugada
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onUpdateStatus(moto.id, 'active')}>
                            <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Disponível
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onUpdateStatus(moto.id, 'manutencao')}>
                            <Wrench className="mr-2 h-4 w-4 text-yellow-500" /> Manutenção
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onUpdateStatus(moto.id, 'sucata')}>
                            <XCircle className="mr-2 h-4 w-4 text-gray-600" /> Sucata
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onUpdateStatus(moto.id, 'sinistro')}>
                            <XCircle className="mr-2 h-4 w-4 text-red-600" /> Sinistro
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onUpdateStatus(moto.id, 'furtada')}>
                            <XCircle className="mr-2 h-4 w-4 text-red-500" /> Furtada
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onUpdateStatus(moto.id, 'apropriacao_indebita')}>
                            <XCircle className="mr-2 h-4 w-4 text-orange-600" /> Apropriação Indébita
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onUpdateStatus(moto.id, 'nao_transferida')}>
                            <XCircle className="mr-2 h-4 w-4 text-purple-600" /> Não Transferida
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onUpdateStatus(moto.id, 'vendida')}>
                            <CheckCircle className="mr-2 h-4 w-4 text-blue-600" /> Vendida
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onUpdateStatus(moto.id, 'nao_localizada')}>
                            <XCircle className="mr-2 h-4 w-4 text-gray-500" /> Não Localizada
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onDeleteMotorcycle(moto.id)}
                            className="text-destructive hover:!text-destructive focus:!text-destructive !bg-transparent hover:!bg-destructive/10 focus:!bg-destructive/10"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
