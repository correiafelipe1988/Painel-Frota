"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RestrictedAccessMessage } from "@/components/auth/RestrictedAccessMessage";
import { isAuthorizedAdmin } from '@/lib/auth/permissions';
import { useAuth } from '@/context/AuthContext';
import { MotorcycleProjectionChart } from "@/components/charts/motorcycle-projection-chart"
import { PageHeader } from "@/components/shared/page-header"

export default function ProjecaoMotosPage() {
  const { user } = useAuth();
  if (!isAuthorizedAdmin(user?.uid)) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <RestrictedAccessMessage />
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Projeção de Locações 2025"
          description="Análise e projeção de locações para atingir 300 locações até dezembro de 2025"
        />
        
        <MotorcycleProjectionChart />
      </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
