
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { MotorcycleStatus } from '@/lib/types';
import { Search, SlidersHorizontal, QrCode } from 'lucide-react';
import type { MotorcyclePageFilters } from '@/app/motorcycles/page';

interface MotorcycleFiltersProps {
  onFilterChange: (filters: MotorcyclePageFilters) => void;
  initialFilters: MotorcyclePageFilters;
}

const statusOptions: { value: MotorcycleStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos os Status' },
  { value: 'active', label: 'Ativa' },
  { value: 'alugada', label: 'Alugada' },
  { value: 'manutencao', label: 'Manutenção' },
  { value: 'sucata', label: 'Sucata' },
  { value: 'sinistro', label: 'Sinistro' },
  { value: 'furtada', label: 'Furtada' },
  { value: 'apropriacao_indebita', label: 'Apropriação Indébita' },
  { value: 'nao_transferida', label: 'Não Transferida' },
  { value: 'vendida', label: 'Vendida' },
  { value: 'nao_localizada', label: 'Não Localizada' },
];

// Model options matching the add motorcycle form
const modelOptions: { value: string; label: string }[] = [
  { value: 'all', label: 'Todos os Modelos' },
  { value: 'SHINERAY SHI 175 CARBURADA', label: 'SHINERAY SHI 175 CARBURADA' },
  { value: 'SHINERAY SHI 175 INJETADA', label: 'SHINERAY SHI 175 INJETADA' },
  { value: 'DAFRA NH190', label: 'DAFRA NH190' },
  { value: 'HAOJUE DK 150', label: 'HAOJUE DK 150' },
  { value: 'HAOJUE DK160', label: 'HAOJUE DK160' },
  { value: 'SHINERAY XY150', label: 'SHINERAY XY150' },
  { value: 'YAMAHA FACTOR 150', label: 'YAMAHA FACTOR 150' },
];

export function MotorcycleFilters({ onFilterChange, initialFilters }: MotorcycleFiltersProps) {
  const [searchTerm, setSearchTerm] = useState(initialFilters.searchTerm);
  const [status, setStatus] = useState<MotorcycleStatus | 'all'>(initialFilters.status);
  const [model, setModel] = useState<string | 'all'>(initialFilters.model);

  useEffect(() => {
    onFilterChange({ searchTerm, status, model });
  }, [searchTerm, status, model, onFilterChange]);

  const handleStatusChange = useCallback((value: string) => {
    setStatus(value as MotorcycleStatus | 'all');
  }, []); 

  const handleModelChange = useCallback((value: string) => {
    setModel(value);
  }, []);

  return (
    <div className="mb-6 p-6 border rounded-lg bg-card shadow-lg">
      <div className="flex items-center mb-4">
        <SlidersHorizontal className="h-5 w-5 mr-2 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Filtros</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div className="lg:col-span-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="search-filter"
            placeholder="Buscar por placa, modelo ou franqueado"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>

        <div>
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger id="status-filter" className="w-full">
              <SelectValue placeholder="Todos os Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select value={model} onValueChange={handleModelChange}>
            <SelectTrigger id="model-filter" className="w-full">
              <SelectValue placeholder="Todos os Modelos" />
            </SelectTrigger>
            <SelectContent>
              {modelOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" className="w-full lg:w-auto justify-center">
          <QrCode className="mr-2 h-4 w-4" />
          Escanear QR
        </Button>
      </div>
    </div>
  );
}
