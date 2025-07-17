"use client";

import { useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { normalizeMotorcycleModel } from "@/lib/utils/modelNormalizer";
import type { Motorcycle } from "@/lib/types";

interface ModelAnalysisTableProps {
  motorcycles: Motorcycle[];
  compact?: boolean;
}

interface ModelData {
  model: string;
  total: number;
  alugadas: number;
  active: number;
  manutencao: number;
  naoTransferida: number;
  naoLocalizada: number;
  sinistro: number;
  franchisees: Set<string>;
}

const formatCurrency = (value: number) => 
  `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function ModelAnalysisTable({ motorcycles, compact = false }: ModelAnalysisTableProps) {
  const modelData = useMemo(() => {
    const models: { [key: string]: ModelData } = {};
    
    motorcycles.forEach(moto => {
      if (!moto.model) return;
      
      // Normalizar o nome do modelo para unificar variações
      const modelKey = normalizeMotorcycleModel(moto.model);
      if (!models[modelKey]) {
        models[modelKey] = {
          model: modelKey,
          total: 0,
          alugadas: 0,
          active: 0,
          manutencao: 0,
          naoTransferida: 0,
          naoLocalizada: 0,
          sinistro: 0,
          franchisees: new Set()
        };
      }
      
      const model = models[modelKey];
      model.total++;
      
      // Contar por status
      switch (moto.status) {
        case 'alugada':
          model.alugadas++;
          break;
        case 'active':
          model.active++;
          break;
        case 'manutencao':
          model.manutencao++;
          break;
        case 'nao_transferida':
          model.naoTransferida++;
          break;
        case 'nao_localizada':
          model.naoLocalizada++;
          break;
        case 'sinistro':
          model.sinistro++;
          break;
      }
      
      // Calcular receita
      if (moto.status === 'alugada' && moto.valorSemanal) {
        model.totalRevenue += moto.valorSemanal;
      }
      
      // Adicionar franqueado
      if (moto.franqueado) {
        model.franchisees.add(moto.franqueado.trim());
      }
    });
    
    // Calcular métricas finais
    Object.values(models).forEach(model => {
      const revenueGenerating = model.alugadas;
      model.averageTicket = revenueGenerating > 0 ? model.totalRevenue / revenueGenerating : 0;
      model.occupationRate = model.total > 0 ? (revenueGenerating / model.total) * 100 : 0;
    });
    
    return Object.values(models).sort((a, b) => b.total - a.total);
  }, [motorcycles]);

  if (compact) {
    return (
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {modelData.slice(0, 8).map((model, index) => (
          <div key={model.model} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full font-bold text-sm">
                {index + 1}
              </div>
              <div>
                <p className="font-medium text-sm">{model.model}</p>
                <p className="text-xs text-gray-500">
                  {model.total} motos • {model.franchisees.size} franqueados
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-blue-600 text-sm">
                {model.occupationRate.toFixed(1)}%
              </p>
              <p className="text-xs text-green-600">
                {formatCurrency(model.averageTicket)}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Modelo</TableHead>
            <TableHead className="text-center">Total</TableHead>
            <TableHead className="text-center">Alugadas</TableHead>
            <TableHead className="text-center">Disponíveis</TableHead>
            <TableHead className="text-center">Manutenção</TableHead>
            <TableHead className="text-center">Não Transferida</TableHead>
            <TableHead className="text-center">Não Localizada</TableHead>
            <TableHead className="text-center">Sinistro</TableHead>
            <TableHead className="text-center">Franqueados</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {modelData.map((model) => (
            <TableRow key={model.model}>
              <TableCell className="font-medium">{model.model}</TableCell>
              <TableCell className="text-center">
                <Badge variant="outline" className="font-semibold">
                  {model.total}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Badge className="bg-blue-100 text-blue-700">
                  {model.alugadas}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Badge className="bg-green-100 text-green-700">
                  {model.active}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Badge className="bg-purple-100 text-purple-700">
                  {model.manutencao}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Badge className="bg-orange-100 text-orange-700">
                  {model.naoTransferida}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Badge className="bg-red-100 text-red-700">
                  {model.naoLocalizada}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Badge className="bg-gray-100 text-gray-700">
                  {model.sinistro}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="secondary">
                  {model.franchisees.size}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
