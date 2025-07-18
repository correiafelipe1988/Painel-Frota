"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RestrictedAccessMessage } from "@/components/auth/RestrictedAccessMessage";
import { hasRoutePermission } from '@/lib/auth/permissions';
import { useAuth } from '@/context/AuthContext';
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText, Plus, Search, Filter, Download, Upload, Car, FileCheck, MapPin, DollarSign, MessageSquare } from "lucide-react";
import type { VehicleRegistry } from "@/lib/types";
import { VehicleForm } from "@/components/vehicle-registry/vehicle-form";
import { useToast } from "@/hooks/use-toast";
import { subscribeToVehicleRegistry, addVehicle, updateVehicle } from "@/lib/firebase/vehicleRegistryService";


export default function CadastroVeiculosPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState<VehicleRegistry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleRegistry | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("lista");

  // Carregar veículos do Firebase
  useEffect(() => {
    const unsubscribe = subscribeToVehicleRegistry((vehiclesFromDB) => {
      setVehicles(vehiclesFromDB);
    });
    return () => unsubscribe();
  }, []);

  // Filtrar veículos baseado no termo de busca
  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.modelo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Função para obter a cor do badge baseada no status
  const getStatusBadgeVariant = (status?: string) => {
    switch (status) {
      case 'disponivel':
        return 'success';
      case 'locada':
        return 'info';
      case 'parada':
        return 'warning';
      case 'sinistro':
      case 'sucata':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  // Função para obter o texto do status
  const getStatusText = (status?: string) => {
    switch (status) {
      case 'disponivel':
        return 'Disponível';
      case 'locada':
        return 'Locada';
      case 'parada':
        return 'Parada';
      case 'sinistro':
        return 'Sinistro';
      case 'sucata':
        return 'Sucata';
      default:
        return 'N/A';
    }
  };

  // Função para salvar novo veículo
  const handleAddVehicle = async (data: any) => {
    if (!user?.uid) return;
    
    setIsLoading(true);
    try {
      await addVehicle(data, user.uid);
      toast({
        title: "Sucesso",
        description: "Veículo cadastrado com sucesso!"
      });
      setShowAddForm(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao cadastrar veículo",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Função para editar veículo
  const handleEditVehicle = async (data: any) => {
    if (!user?.uid || !selectedVehicle) return;
    
    setIsLoading(true);
    try {
      await updateVehicle(selectedVehicle.id, data, user.uid);
      toast({
        title: "Sucesso",
        description: "Veículo atualizado com sucesso!"
      });
      setShowEditForm(false);
      setSelectedVehicle(null);
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao atualizar veículo",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Função para abrir formulário de edição
  const handleEditClick = (vehicle: VehicleRegistry) => {
    setSelectedVehicle(vehicle);
    setShowEditForm(true);
  };

  if (!hasRoutePermission(user?.uid, '/cadastro-veiculos')) {
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
        <PageHeader
          title="Cadastro de Veículos"
          description="Controle completo da frota com documentação e histórico detalhado"
          icon={FileText}
          iconContainerClassName="bg-blue-500"
        />

        <div className="space-y-6">
          {/* Barra de ações */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por placa, marca ou modelo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Importar
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Button onClick={() => setShowAddForm(true)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Novo Veículo
              </Button>
            </div>
          </div>

          {/* Resumo em cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total de Veículos</p>
                    <p className="text-2xl font-bold">{vehicles.length}</p>
                  </div>
                  <Car className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Disponíveis</p>
                    <p className="text-2xl font-bold text-green-600">
                      {vehicles.filter(v => v.disponibilidade === 'disponivel').length}
                    </p>
                  </div>
                  <FileCheck className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Locadas</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {vehicles.filter(v => v.disponibilidade === 'locada').length}
                    </p>
                  </div>
                  <MapPin className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Problemas</p>
                    <p className="text-2xl font-bold text-red-600">
                      {vehicles.filter(v => v.disponibilidade === 'sinistro' || v.disponibilidade === 'sucata').length}
                    </p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabela de veículos */}
          <Card>
            <CardHeader>
              <CardTitle>Veículos Cadastrados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Placa</th>
                      <th className="text-left py-2">Marca/Modelo</th>
                      <th className="text-left py-2">Ano</th>
                      <th className="text-left py-2">Tipo</th>
                      <th className="text-left py-2">Status</th>
                      <th className="text-left py-2">Localização</th>
                      <th className="text-left py-2">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVehicles.map((vehicle) => (
                      <tr key={vehicle.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 font-medium">{vehicle.placa}</td>
                        <td className="py-3">{vehicle.marca} {vehicle.modelo}</td>
                        <td className="py-3">{vehicle.anoModelo}</td>
                        <td className="py-3">{vehicle.tipo}</td>
                        <td className="py-3">
                          <Badge variant={getStatusBadgeVariant(vehicle.disponibilidade)}>
                            {getStatusText(vehicle.disponibilidade)}
                          </Badge>
                        </td>
                        <td className="py-3">{vehicle.cidade}, {vehicle.estado}</td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditClick(vehicle)}
                            >
                              Editar
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedVehicle(vehicle)}
                            >
                              Detalhes
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {filteredVehicles.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Nenhum veículo encontrado
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Diálogo para adicionar veículo */}
          <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Adicionar Novo Veículo</DialogTitle>
              </DialogHeader>
              <VehicleForm
                onSubmit={handleAddVehicle}
                onCancel={() => setShowAddForm(false)}
                isLoading={isLoading}
              />
            </DialogContent>
          </Dialog>

          {/* Diálogo para editar veículo */}
          <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Editar Veículo</DialogTitle>
              </DialogHeader>
              <VehicleForm
                vehicle={selectedVehicle || undefined}
                onSubmit={handleEditVehicle}
                onCancel={() => {
                  setShowEditForm(false);
                  setSelectedVehicle(null);
                }}
                isLoading={isLoading}
              />
            </DialogContent>
          </Dialog>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}