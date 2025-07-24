"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RestrictedAccessMessage } from "@/components/auth/RestrictedAccessMessage";
import { hasRoutePermission } from '@/lib/auth/permissions';
import { useAuth } from '@/context/AuthContext';
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { FileText, Plus, Search, Filter, Download, Upload, Car, FileCheck, MapPin, MessageSquare, AlertTriangle, CheckCircle, XCircle, Clock, Truck, Zap, Trash2, Bike, MoreHorizontal, Eye, Edit } from "lucide-react";
import type { VehicleRegistry } from "@/lib/types";
import { VehicleForm } from "@/components/vehicle-registry/vehicle-form";
import { VehicleDetailsModal } from "@/components/vehicle-registry/vehicle-details-modal";
import { useToast } from "@/hooks/use-toast";
import { subscribeToVehicleRegistry, addVehicle, updateVehicle, deleteVehicle } from "@/lib/firebase/vehicleRegistryService";


export default function CadastroVeiculosPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState<VehicleRegistry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleRegistry | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  // Função para obter ícone do tipo de veículo
  const getVehicleTypeIcon = (type?: string) => {
    switch (type) {
      case 'Cargo':
        return <Truck className="h-4 w-4 text-blue-600" />;
      case 'Sport':
        return <Zap className="h-4 w-4 text-red-600" />;
      default:
        return <Car className="h-4 w-4 text-gray-600" />;
    }
  };

  // Função para calcular tempo no status atual
  const getTimeInStatus = (vehicle: VehicleRegistry) => {
    if (!vehicle.dataUltimaAtualizacao) return '';
    
    const lastUpdate = new Date(vehicle.dataUltimaAtualizacao);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastUpdate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'há 1 dia';
    if (diffDays < 30) return `há ${diffDays} dias`;
    if (diffDays < 365) return `há ${Math.floor(diffDays / 30)} meses`;
    return `há ${Math.floor(diffDays / 365)} anos`;
  };

  // Função para obter status da documentação
  const getDocumentationStatus = (vehicle: VehicleRegistry) => {
    const issues = [];
    if (!vehicle.licenciamentoEmDia) issues.push('Licenciamento vencido');
    if (vehicle.multasPendentes) issues.push('Multas pendentes');
    if (vehicle.ipvaEmAberto) issues.push('IPVA em aberto');
    if (!vehicle.seguroAtivo) issues.push('Seguro inativo');
    
    const tooltipText = issues.length > 0 ? issues.join(', ') : 'Toda documentação em dia';
    
    if (issues.length === 0) {
      return { 
        status: 'ok', 
        icon: <CheckCircle className="h-4 w-4 text-green-600" />, 
        text: 'Em dia',
        tooltip: tooltipText
      };
    } else if (issues.length <= 2) {
      return { 
        status: 'warning', 
        icon: <AlertTriangle className="h-4 w-4 text-yellow-600" />, 
        text: `${issues.length} pendência${issues.length > 1 ? 's' : ''}`,
        tooltip: tooltipText
      };
    } else {
      return { 
        status: 'error', 
        icon: <XCircle className="h-4 w-4 text-red-600" />, 
        text: `${issues.length} problemas`,
        tooltip: tooltipText
      };
    }
  };

  // Função para formatar valor monetário
  const formatCurrency = (value?: number) => {
    if (!value) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
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

  // Função para abrir modal de detalhes
  const handleDetailsClick = (vehicle: VehicleRegistry) => {
    setSelectedVehicle(vehicle);
    setShowDetailsModal(true);
  };

  // Função para excluir veículo
  const handleDeleteVehicle = async (vehicle: VehicleRegistry) => {
    const confirmDelete = window.confirm(`Tem certeza que deseja excluir o veículo ${vehicle.placa?.replace('-', '')}?`);
    
    if (!confirmDelete || !user?.uid) return;
    
    setIsLoading(true);
    try {
      await deleteVehicle(vehicle.id);
      toast({
        title: "Sucesso",
        description: "Veículo excluído com sucesso!"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao excluir veículo",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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
        <TooltipProvider>
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
                  <Bike className="h-8 w-8 text-blue-500" />
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
                    <p className="text-sm text-muted-foreground">Alugadas</p>
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
                      <th className="text-left py-3 px-2">Veículo</th>
                      <th className="text-left py-3 px-2">Documentação</th>
                      <th className="text-left py-3 px-2">Status Operacional</th>
                      <th className="text-left py-3 px-2">Obs</th>
                      <th className="text-left py-3 px-2">Localização</th>
                      <th className="text-left py-3 px-2">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVehicles.map((vehicle) => {
                      const docStatus = getDocumentationStatus(vehicle);
                      const timeInStatus = getTimeInStatus(vehicle);
                      
                      return (
                        <tr 
                          key={vehicle.id} 
                          className={`border-b hover:bg-gray-50 ${
                            docStatus.status === 'error' ? 'bg-red-50' : 
                            docStatus.status === 'warning' ? 'bg-yellow-50' : ''
                          }`}
                        >
                          {/* Coluna Veículo */}
                          <td className="py-3 px-2">
                            <div className="flex items-start gap-2">
                              {getVehicleTypeIcon(vehicle.tipo)}
                              <div>
                                <div className="font-semibold text-lg">{vehicle.placa?.replace('-', '')}</div>
                                <div className="text-sm text-gray-600">
                                  {vehicle.marca} {vehicle.modelo}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {vehicle.anoModelo}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Coluna Documentação */}
                          <td className="py-3 px-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-2 cursor-help">
                                  {docStatus.icon}
                                  <div>
                                    <div className={`text-sm font-medium ${
                                      docStatus.status === 'ok' ? 'text-green-700' :
                                      docStatus.status === 'warning' ? 'text-yellow-700' :
                                      'text-red-700'
                                    }`}>
                                      {docStatus.text}
                                    </div>
                                    {vehicle.multasPendentes && vehicle.valorMultasPendentes && (
                                      <div className="text-xs text-red-600">
                                        Multas: {formatCurrency(vehicle.valorMultasPendentes)}
                                      </div>
                                    )}
                                    {vehicle.ipvaEmAberto && vehicle.valorIpvaEmAberto && (
                                      <div className="text-xs text-red-600">
                                        IPVA: {formatCurrency(vehicle.valorIpvaEmAberto)}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{docStatus.tooltip}</p>
                              </TooltipContent>
                            </Tooltip>
                          </td>

                          {/* Coluna Status Operacional */}
                          <td className="py-3 px-2">
                            <div>
                              <Badge variant={getStatusBadgeVariant(vehicle.disponibilidade)}>
                                {getStatusText(vehicle.disponibilidade)}
                              </Badge>
                              {timeInStatus && (
                                <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {timeInStatus}
                                </div>
                              )}
                              {vehicle.locatarioAtual && (
                                <div className="text-xs text-blue-600 mt-1">
                                  {vehicle.locatarioAtual}
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Coluna Obs */}
                          <td className="py-3 px-2">
                            <div>
                              {vehicle.observacoesOperacionais ? (
                                <div className="text-sm text-gray-700 max-w-[200px] truncate" title={vehicle.observacoesOperacionais}>
                                  {vehicle.observacoesOperacionais}
                                </div>
                              ) : (
                                <div className="text-xs text-gray-400">
                                  Sem observações
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Coluna Localização */}
                          <td className="py-3 px-2">
                            <div>
                              <div className="text-sm font-medium">
                                {vehicle.cidade}, {vehicle.estado}
                              </div>
                              {vehicle.localArmazenamento && (
                                <div className="text-xs text-gray-500">
                                  {vehicle.localArmazenamento}
                                </div>
                              )}
                              {vehicle.funcionarioResponsavel && (
                                <div className="text-xs text-blue-600">
                                  Resp: {vehicle.funcionarioResponsavel}
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Coluna Ações */}
                          <td className="py-3 px-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" disabled={isLoading}>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleDetailsClick(vehicle)}>
                                  <Eye className="mr-2 h-4 w-4" /> Ver Detalhes
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditClick(vehicle)}>
                                  <Edit className="mr-2 h-4 w-4" /> Editar
                                </DropdownMenuItem>
                                
                                <DropdownMenuSeparator />
                                
                                <DropdownMenuItem
                                  onClick={() => handleDeleteVehicle(vehicle)}
                                  className="text-destructive hover:!text-destructive focus:!text-destructive !bg-transparent hover:!bg-destructive/10 focus:!bg-destructive/10"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" /> Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      );
                    })}
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

          {/* Modal de detalhes do veículo */}
          <VehicleDetailsModal
            vehicle={selectedVehicle}
            open={showDetailsModal}
            onOpenChange={(open) => {
              setShowDetailsModal(open);
              if (!open) setSelectedVehicle(null);
            }}
          />
          </div>
        </TooltipProvider>
      </DashboardLayout>
    </ProtectedRoute>
  );
}