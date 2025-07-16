"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, LabelList } from "recharts";

interface StateDistributionData {
  state: string;
  count: number;
  percentage: number;
}

interface FleetDistributionByStateChartProps {
  data: StateDistributionData[];
}

export function FleetDistributionByStateChart({ data }: FleetDistributionByStateChartProps) {
  const formatCount = (value: number) => value > 0 ? value.toString() : '';

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} margin={{ top: 30, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="state" 
          stroke="#888888" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
        />
        <YAxis 
          stroke="#888888" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
          tickFormatter={(value) => `${value}`} 
        />
        <Tooltip
          cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }}
          contentStyle={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
            border: '1px solid #ccc', 
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
          formatter={(value: number, name: string) => [
            `${value} motos (${data.find(d => d.count === value)?.percentage.toFixed(1)}%)`,
            'Quantidade'
          ]}
        />
        <Bar 
          dataKey="count" 
          name="Motos por UF" 
          fill="hsl(221.2 83.2% 53.3%)" 
          radius={[4, 4, 0, 0]}
        >
          <LabelList 
            dataKey="count" 
            position="top" 
            style={{ fontSize: '12px', fill: 'hsl(221.2 83.2% 53.3%)', fontWeight: 'bold' }} 
            formatter={formatCount}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}