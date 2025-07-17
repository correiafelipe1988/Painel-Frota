"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Bike, TrendingUp, Award, AlertTriangle, BarChart3, PieChart } from "lucide-react";
import { subscribeToMotorcycles } from '@/lib/firebase/motorcycleService';
import type { Motorcycle, MotorcycleStatus } from '@/lib/types';
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FranchiseePerformanceChart } from "@/components/charts/franchisee-performance-chart";
import { FleetDistributionPieChart } from "@/components/charts/fleet-distribution-pie-chart";


interface FranchiseeFleetStatus {
  franqueadoName: string;
  counts: {
    alugada: number;
    active: number;
    manutencao: number;
    sucata: number;
    sinistro: number;
    nao_transferida: number;
    nao_localizada: number;
  };
  totalGeral: number;
  percentLocadas: number;
  percentManutencao: number;
  percentDisponivel: number;
  percentSucata: number;
  percentSinistro: number;
  percentNaoTransferida: number;
  percentNaoLocalizada: number;
}

// Função para calcular KPIs
const calculateKPIs = (data: FranchiseeFleetStatus[]) => {
  if (data.length === 0) {
    return {
      totalFranqueados: 0,
      totalMotos: 0,
      melhorFranqueado: null,
      taxaMediaOcupacao: 0,
      franqueadoMaisMotos: null
    };
  }

  const totalMotos = data.reduce((sum, item) => sum + item.totalGeral, 0);
  const totalAlugadas = data.reduce((sum, item) => sum + item.counts.alugada, 0);
  const taxaMediaOcupacao = totalMotos > 0 ? (totalAlugadas / totalMotos) * 100 : 0;
  
  const melhorFranqueado = data.reduce((prev, current) => 
    current.percentLocadas > prev.percentLocadas ? current : prev
  );
  
  const franqueadoMaisMotos = data.reduce((prev, current) => 
    current.totalGeral > prev.totalGeral ? current : prev
  );

  return {
    totalFranqueados: data.length,
    totalMotos,
    melhorFranqueado,
    taxaMediaOcupacao,
    franqueadoMaisMotos
  };
};

// Função para obter cor do badge baseada no status
const getStatusBadgeProps = (status: string, count: number) => {
  if (count === 0) return { variant: "outline" as const, text: "0" };
  
  switch (status) {
    case 'alugada':
      return { variant: "success" as const, text: count.toString() };
    case 'active':
      return { variant: "info" as const, text: count.toString() };
    case 'manutencao':
      return { variant: "warning" as const, text: count.toString() };
    case 'sinistro':
    case 'sucata':
    case 'nao_localizada':
      return { variant: "destructive" as const, text: count.toString() };
    default:
      return { variant: "secondary" as const, text: count.toString() };
  }
};

export default function FranqueadosPage() {
  const [allMotorcycles, setAllMotorcycles] = useState<Motorcycle[]>([]);
  const [processedData, setProcessedData] = useState<FranchiseeFleetStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [selectedFranchisee, setSelectedFranchisee] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [franchisees, setFranchisees] = useState<string[]>([]);
  
  // KPIs calculados
  const kpis = calculateKPIs(processedData);
  
  // Dados para gráficos
  const chartData = processedData.map(item => ({
    name: item.franqueadoName,
    alugadas: item.counts.alugada,
    disponiveis: item.counts.active,
    manutencao: item.counts.manutencao,
    percentLocadas: item.percentLocadas
  }));
  
  const pieChartData = [
    { name: 'Alugadas', value: processedData.reduce((sum, item) => sum + item.counts.alugada, 0), fill: 'hsl(var(--chart-1))' },
    { name: 'Disponíveis', value: processedData.reduce((sum, item) => sum + item.counts.active, 0), fill: 'hsl(var(--chart-2))' },
    { name: 'Manutenção', value: processedData.reduce((sum, item) => sum + item.counts.manutencao, 0), fill: 'hsl(var(--chart-3))' },
    { name: 'Sucata', value: processedData.reduce((sum, item) => sum + item.counts.sucata, 0), fill: 'hsl(var(--chart-4))' },
    { name: 'Sinistro', value: processedData.reduce((sum, item) => sum + item.counts.sinistro, 0), fill: 'hsl(var(--chart-5))' }
  ].filter(item => item.value > 0);


  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = subscribeToMotorcycles((motosFromDB) => {
      if (Array.isArray(motosFromDB)) {
        const updatedMotorcycles = motosFromDB.map(moto =>
          moto.status === undefined ? { ...moto, status: 'alugada' as MotorcycleStatus } : moto
        );
        setAllMotorcycles(updatedMotorcycles);
         const uniqueFranchisees = Array.from(
          new Set(updatedMotorcycles.map(moto => moto.franqueado?.trim()).filter((franqueado): franqueado is string => !!franqueado))
        ).sort();
        setFranchisees(uniqueFranchisees);

      } else {
        console.warn("Data from subscribeToMotorcycles (franqueados page) was not an array:", motosFromDB);
        setAllMotorcycles([]);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isLoading) {
      setProcessedData([]);
      return;
    }

    // Filter logic
    const filteredMotorcycles = allMotorcycles.filter(moto => {
        const isFranchiseeMatch = selectedFranchisee === 'all' || moto.franqueado?.trim() === selectedFranchisee;
        
        // Date filtering logic
        const motoDate = moto.data_ultima_mov ? new Date(moto.data_ultima_mov) : null;
        let isDateMatch = true;
        if(startDate && endDate && motoDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            // Adjust dates to ignore time
            start.setHours(0,0,0,0);
            end.setHours(23,59,59,999);
            motoDate.setHours(0,0,0,0);
            isDateMatch = motoDate >= start && motoDate <= end;
        } else if (startDate && motoDate) {
            const start = new Date(startDate);
            start.setHours(0,0,0,0);
            motoDate.setHours(0,0,0,0);
            isDateMatch = motoDate >= start;
        } else if (endDate && motoDate) {
            const end = new Date(endDate);
            end.setHours(23,59,59,999);
            motoDate.setHours(0,0,0,0);
            isDateMatch = motoDate <= end;
        }

        return isFranchiseeMatch && isDateMatch;
    });


    // Aplicar regra de placas únicas: considerar apenas a última atualização por placa
    const uniqueMotorcyclesByPlaca: { [placa: string]: Motorcycle } = {};
    filteredMotorcycles.forEach(moto => {
      if (!moto.placa) return;
      const existingMoto = uniqueMotorcyclesByPlaca[moto.placa];
      if (!existingMoto ||
          (moto.data_ultima_mov && existingMoto.data_ultima_mov && new Date(moto.data_ultima_mov) > new Date(existingMoto.data_ultima_mov)) ||
          (moto.data_ultima_mov && !existingMoto.data_ultima_mov)) {
        uniqueMotorcyclesByPlaca[moto.placa] = moto;
      }
    });
    const representativeMotorcycles = Object.values(uniqueMotorcyclesByPlaca);

    const franchiseeStats: Record<string, {
      counts: { [K in MotorcycleStatus]: number } & { indefinido: number };
      totalGeral: number;
    }> = {};

    representativeMotorcycles.forEach(moto => {
      const frNameTrimmed = moto.franqueado?.trim();

      if (!frNameTrimmed || frNameTrimmed === "Não Especificado" || frNameTrimmed === "") {
        return;
      }
      
      const frName = frNameTrimmed;

      if (!franchiseeStats[frName]) {
        franchiseeStats[frName] = {
          counts: {
            active: 0,
            alugada: 0,
            manutencao: 0,
            sucata: 0,
            sinistro: 0,
            furtada: 0,
            apropriacao_indebita: 0,
            nao_transferida: 0,
            vendida: 0,
            nao_localizada: 0,
            indefinido: 0,
          },
          totalGeral: 0,
        };
      }

      const status = moto.status;
      if (status && (status === 'active' || status === 'alugada' || status === 'manutencao' || status === 'sucata' || status === 'sinistro' || status === 'furtada' || status === 'apropriacao_indebita' || status === 'nao_transferida' || status === 'vendida' || status === 'nao_localizada')) {
        franchiseeStats[frName].counts[status]++;
      } else {
        franchiseeStats[frName].counts.indefinido++;
      }
      franchiseeStats[frName].totalGeral++;
    });

    const dataForTable: FranchiseeFleetStatus[] = Object.entries(franchiseeStats).map(([name, stats]) => {
      const totalLocadasCount = stats.counts.alugada;
      const percentLocadas = stats.totalGeral > 0 ? (totalLocadasCount / stats.totalGeral) * 100 : 0;
      const percentManutencao = stats.totalGeral > 0 ? (stats.counts.manutencao / stats.totalGeral) * 100 : 0;
      const percentDisponivel = stats.totalGeral > 0 ? (stats.counts.active / stats.totalGeral) * 100 : 0;
      
      return {
        franqueadoName: name,
        counts: {
          alugada: stats.counts.alugada,
          active: stats.counts.active,
          manutencao: stats.counts.manutencao,
          sucata: stats.counts.sucata,
          sinistro: stats.counts.sinistro,
          nao_transferida: stats.counts.nao_transferida,
          nao_localizada: stats.counts.nao_localizada,
        },
        totalGeral: stats.totalGeral,
        percentLocadas,
        percentManutencao,
        percentDisponivel,
        percentSucata: stats.totalGeral > 0 ? (stats.counts.sucata / stats.totalGeral) * 100 : 0,
        percentSinistro: stats.totalGeral > 0 ? (stats.counts.sinistro / stats.totalGeral) * 100 : 0,
        percentNaoTransferida: stats.totalGeral > 0 ? (stats.counts.nao_transferida / stats.totalGeral) * 100 : 0,
        percentNaoLocalizada: stats.totalGeral > 0 ? (stats.counts.nao_localizada / stats.totalGeral) * 100 : 0,
      };
    }).sort((a, b) => a.franqueadoName.localeCompare(b.franqueadoName));

    setProcessedData(dataForTable);
  }, [allMotorcycles, isLoading, selectedFranchisee, startDate, endDate]);
  
  // Função para renderizar barra de progresso com cor
  const renderProgressBar = (percentage: number, variant: 'success' | 'warning' | 'destructive' | 'info' = 'info') => {
    const colorClasses = {
      success: 'bg-green-500',
      warning: 'bg-yellow-500', 
      destructive: 'bg-red-500',
      info: 'bg-blue-500'
    };
    
    return (
      <div className="flex items-center gap-2">
        <div className="w-16 text-xs text-right">{percentage.toFixed(1)}%</div>
        <Progress 
          value={percentage} 
          className="w-20 h-2"
        />
      </div>
    );
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Análise de Franqueados"
        description="Performance e distribuição da frota por franqueado."
        icon={Users}
        iconContainerClassName="bg-primary"
      />
      
      {/* Cards de KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Franqueados</p>
              <p className="text-2xl font-bold text-blue-500">{kpis.totalFranqueados}</p>
              <p className="text-xs text-muted-foreground">ativos</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500">
              <Users className="h-6 w-6 text-white" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total de Motos</p>
              <p className="text-2xl font-bold text-green-500">{kpis.totalMotos}</p>
              <p className="text-xs text-muted-foreground">na frota</p>
            </div>
            <div className="p-3 rounded-lg bg-green-500">
              <Bike className="h-6 w-6 text-white" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Taxa Média</p>
              <p className="text-2xl font-bold text-yellow-600">{kpis.taxaMediaOcupacao.toFixed(1)}%</p>
              <p className="text-xs text-muted-foreground">ocupação</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-500">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Top Performer</p>
              <p className="text-lg font-bold text-purple-500 truncate">
                {kpis.melhorFranqueado?.franqueadoName.substring(0, 12) || 'N/A'}
              </p>
              <p className="text-xs text-muted-foreground">
                {kpis.melhorFranqueado?.percentLocadas.toFixed(1)}% ocupação
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-500">
              <Award className="h-6 w-6 text-white" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="franchisee-select">Franqueado</Label>
            <Select onValueChange={setSelectedFranchisee} value={selectedFranchisee}>
              <SelectTrigger id="franchisee-select">
                <SelectValue placeholder="Selecione o Franqueado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Franqueados</SelectItem>
                {franchisees.map(franqueado => (
                  <SelectItem key={franqueado} value={franqueado}>{franqueado}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="start-date">Data de Início</Label>
            <Input
              type="date"
              id="start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="end-date">Data de Fim</Label>
            <Input
              type="date"
              id="end-date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </Card>

      <Tabs defaultValue="table" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="table" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Tabela Detalhada
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="distribution" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Distribuição
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="table" className="mt-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <Bike className="h-6 w-6 text-primary" />
                Status da Frota por Franqueado
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-lg min-h-[300px] bg-muted/50">
                  <Users className="h-24 w-24 text-muted-foreground mb-4 animate-pulse" />
                  <p className="text-muted-foreground text-center">
                    Carregando dados dos franqueados...
                  </p>
                </div>
              ) : processedData.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-lg min-h-[300px] bg-muted/50">
                  <Users className="h-24 w-24 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center">
                    Nenhum dado encontrado para os filtros selecionados.
                    <br />
                    Ajuste os filtros ou verifique os dados cadastrados.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-left">Franqueado</TableHead>
                        <TableHead className="text-center">Alugada</TableHead>
                        <TableHead className="text-center">Disponível</TableHead>
                        <TableHead className="text-center">Manutenção</TableHead>
                        <TableHead className="text-center">Sucata</TableHead>
                        <TableHead className="text-center">Sinistro</TableHead>
                        <TableHead className="text-center">N. Transfer.</TableHead>
                        <TableHead className="text-center">N. Localiz.</TableHead>
                        <TableHead className="text-center font-semibold">Total</TableHead>
                        <TableHead className="text-center">% Ocupação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {processedData.map((item) => (
                        <TableRow key={item.franqueadoName} className="hover:bg-muted/50">
                          <TableCell className="text-left font-medium">
                            <div className="flex items-center gap-2">
                              {item.franqueadoName}
                              {item.percentLocadas >= 80 && <Award className="h-4 w-4 text-yellow-500" />}
                              {item.percentLocadas < 30 && <AlertTriangle className="h-4 w-4 text-red-500" />}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge {...getStatusBadgeProps('alugada', item.counts.alugada)} />
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge {...getStatusBadgeProps('active', item.counts.active)} />
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge {...getStatusBadgeProps('manutencao', item.counts.manutencao)} />
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge {...getStatusBadgeProps('sucata', item.counts.sucata)} />
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge {...getStatusBadgeProps('sinistro', item.counts.sinistro)} />
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge {...getStatusBadgeProps('nao_transferida', item.counts.nao_transferida)} />
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge {...getStatusBadgeProps('nao_localizada', item.counts.nao_localizada)} />
                          </TableCell>
                          <TableCell className="text-center font-bold">{item.totalGeral}</TableCell>
                          <TableCell className="text-center">
                            {renderProgressBar(item.percentLocadas, 
                              item.percentLocadas >= 70 ? 'success' : 
                              item.percentLocadas >= 40 ? 'warning' : 'destructive'
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="mt-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <BarChart3 className="h-6 w-6 text-primary" />
                Performance dos Franqueados (Top 10)
              </CardTitle>
              <CardDescription>
                Comparação do desempenho baseado em motos alugadas, disponíveis e em manutenção.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {processedData.length > 0 ? (
                <FranchiseePerformanceChart data={chartData} />
              ) : (
                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-lg min-h-[300px] bg-muted/50">
                  <BarChart3 className="h-24 w-24 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center">Nenhum dado disponível para exibir gráfico.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="distribution" className="mt-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <PieChart className="h-6 w-6 text-primary" />
                Distribuição Total da Frota
              </CardTitle>
              <CardDescription>
                Visão geral da distribuição de todas as motos por status.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pieChartData.length > 0 ? (
                <FleetDistributionPieChart data={pieChartData} />
              ) : (
                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-lg min-h-[300px] bg-muted/50">
                  <PieChart className="h-24 w-24 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center">Nenhum dado disponível para exibir gráfico.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}