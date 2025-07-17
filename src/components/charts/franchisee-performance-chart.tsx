"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface FranchiseePerformanceData {
  name: string;
  alugadas: number;
  disponiveis: number;
  manutencao: number;
  percentLocadas: number;
}

interface FranchiseePerformanceChartProps {
  data: FranchiseePerformanceData[];
}

export function FranchiseePerformanceChart({ data }: FranchiseePerformanceChartProps) {
  // Ordenar por percentual de locadas (top 10)
  const sortedData = data
    .sort((a, b) => b.percentLocadas - a.percentLocadas)
    .slice(0, 10)
    .map(item => ({
      ...item,
      name: item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name
    }));

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart
        data={sortedData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 60,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          angle={-45}
          textAnchor="end"
          height={100}
          fontSize={12}
        />
        <YAxis />
        <Tooltip 
          formatter={(value, name) => {
            if (name === 'percentLocadas') {
              return [`${value}%`, 'Taxa de Ocupação'];
            }
            return [value, name === 'alugadas' ? 'Alugadas' : name === 'disponiveis' ? 'Disponíveis' : 'Manutenção'];
          }}
        />
        <Legend />
        <Bar dataKey="alugadas" fill="hsl(var(--chart-1))" name="Alugadas" />
        <Bar dataKey="disponiveis" fill="hsl(var(--chart-2))" name="Disponíveis" />
        <Bar dataKey="manutencao" fill="hsl(var(--chart-3))" name="Manutenção" />
      </BarChart>
    </ResponsiveContainer>
  );
}