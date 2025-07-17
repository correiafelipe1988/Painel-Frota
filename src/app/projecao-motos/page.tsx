"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { AdminProtectedRoute } from "@/components/auth/AdminProtectedRoute"
import { MotorcycleProjectionChart } from "@/components/charts/motorcycle-projection-chart"
import { PageHeader } from "@/components/shared/page-header"

export default function ProjecaoMotosPage() {
  return (
    <AdminProtectedRoute>
      <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Projeção de Locações 2025"
          description="Análise e projeção de locações para atingir 300 locações até dezembro de 2025"
        />
        
        <MotorcycleProjectionChart />
      </div>
      </DashboardLayout>
    </AdminProtectedRoute>
  )
}
