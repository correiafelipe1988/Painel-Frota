'use client';

import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { BarChart3, CalendarDays, CheckCircle2, Bike, ArrowRight, Wrench } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function HomePage() {
  const { user, loading } = useAuth();
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTimestamp = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
      }));
    };
    updateTimestamp();
    const intervalId = setInterval(updateTimestamp, 1000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <BarChart3 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground font-headline">Dashboard Controle de Frota</h1>
              <p className="text-muted-foreground">Visão geral da frota de motos</p>
            </div>
          </div>
          {currentTime && (
            <p className="text-sm text-muted-foreground flex items-center">
              <CalendarDays className="h-4 w-4 mr-1.5" />
              Atualizado em {currentTime}
            </p>
          )}
        </div>

        {/* Cards de Status do Dia */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
          <Card className="border-l-4 border-l-blue-500 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Motos Alugadas</p>
                <p className="text-2xl font-bold text-blue-500">0</p>
                <p className="text-xs text-muted-foreground">unidades</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-500">
                <Bike className="h-6 w-6 text-white" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Motos Disponíveis</p>
                <p className="text-2xl font-bold text-green-500">0</p>
                <p className="text-xs text-muted-foreground">unidades</p>
              </div>
              <div className="p-3 rounded-lg bg-green-500">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Não Transferidas</p>
                <p className="text-2xl font-bold text-yellow-600">0</p>
                <p className="text-xs text-muted-foreground">unidades</p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-500">
                <ArrowRight className="h-6 w-6 text-white" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Não Localizadas</p>
                <p className="text-2xl font-bold text-red-500">0</p>
                <p className="text-xs text-muted-foreground">unidades</p>
              </div>
              <div className="p-3 rounded-lg bg-red-500">
                <Wrench className="h-6 w-6 text-white" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center p-8 mt-8">
          <h2 className="text-xl font-semibold mb-4">Dashboard Funcionando!</h2>
          <p className="text-muted-foreground">
            Sistema de autenticação implementado com sucesso.
          </p>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
