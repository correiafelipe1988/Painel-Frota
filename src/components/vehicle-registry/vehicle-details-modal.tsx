"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Car, FileCheck, MapPin, DollarSign, MessageSquare, Calendar, User, Building } from "lucide-react";
import type { VehicleRegistry } from "@/lib/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface VehicleDetailsModalProps {
  vehicle: VehicleRegistry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VehicleDetailsModal({ vehicle, open, onOpenChange }: VehicleDetailsModalProps) {
  if (!vehicle) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return format(date, "dd/MM/yyyy", { locale: ptBR });
    } catch {
      return "Data inválida";
    }
  };

  const formatCurrency = (value?: number) => {
    if (!value) return "R$ 0,00";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getStatusBadge = (status?: string) => {
    const variants: Record<string, any> = {
      disponivel: { variant: "success", text: "Disponível" },
      locada: { variant: "info", text: "Locada" },
      parada: { variant: "warning", text: "Parada" },
      sinistro: { variant: "destructive", text: "Sinistro" },
      sucata: { variant: "destructive", text: "Sucata" },
    };
    
    const config = variants[status || ""] || { variant: "secondary", text: "N/A" };
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const getBooleanBadge = (value?: boolean | null, labels = { true: "Sim", false: "Não", null: "Em processo" }) => {
    if (value === null) return <Badge variant="warning">{labels.null}</Badge>;
    if (value === true) return <Badge variant="success">{labels.true}</Badge>;
    if (value === false) return <Badge variant="destructive">{labels.false}</Badge>;
    return <Badge variant="secondary">N/A</Badge>;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Detalhes do Veículo - {vehicle.placa}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 1. Identificação do Veículo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Car className="h-5 w-5" />
                Identificação do Veículo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Placa</p>
                  <p className="text-lg font-semibold">{vehicle.placa}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Chassi</p>
                  <p>{vehicle.chassi || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">RENAVAM</p>
                  <p>{vehicle.renavam || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Marca</p>
                  <p>{vehicle.marca || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Modelo</p>
                  <p>{vehicle.modelo || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ano Fabricação</p>
                  <p>{vehicle.anoFabricacao || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ano Modelo</p>
                  <p>{vehicle.anoModelo || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tipo</p>
                  <p>{vehicle.tipo || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cor Predominante</p>
                  <p>{vehicle.corPredominante || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Combustível</p>
                  <p>{vehicle.tipoCombustivel || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. Situação Documental e Legal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileCheck className="h-5 w-5" />
                Situação Documental e Legal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status de Propriedade</p>
                  <p>{vehicle.statusPropriedade || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">CNPJ Proprietário</p>
                  <p>{vehicle.cnpjProprietario || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Data Última Transferência</p>
                  <p>{formatDate(vehicle.dataUltimaTransferencia)}</p>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <h4 className="font-medium mb-3">Situação dos Documentos</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">TPV Emitida</p>
                  {getBooleanBadge(vehicle.tpvEmitida)}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Licenciamento em Dia</p>
                  {getBooleanBadge(vehicle.licenciamentoEmDia)}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Seguro Ativo</p>
                  {getBooleanBadge(vehicle.seguroAtivo, { true: "Sim", false: "Não", null: "Cancelado" })}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Multas Pendentes</p>
                  {getBooleanBadge(vehicle.multasPendentes)}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">IPVA em Aberto</p>
                  {getBooleanBadge(vehicle.ipvaEmAberto)}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Rastreador Ativo</p>
                  {getBooleanBadge(vehicle.rastreadorAtivo)}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Chassi com Baixa</p>
                  {getBooleanBadge(vehicle.chassiComBaixa, { true: "Sim", false: "Não", null: "Em processo" })}
                </div>
              </div>
              
              {(vehicle.valorMultasPendentes || vehicle.valorIpvaEmAberto) && (
                <>
                  <Separator className="my-4" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vehicle.valorMultasPendentes && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Valor Multas Pendentes</p>
                        <p className="text-lg font-semibold text-red-600">
                          {formatCurrency(vehicle.valorMultasPendentes)}
                        </p>
                      </div>
                    )}
                    {vehicle.valorIpvaEmAberto && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Valor IPVA em Aberto</p>
                        <p className="text-lg font-semibold text-red-600">
                          {formatCurrency(vehicle.valorIpvaEmAberto)}
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* 3. Localização e Operação */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5" />
                Localização e Operação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cidade</p>
                  <p>{vehicle.cidade || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Estado</p>
                  <p>{vehicle.estado || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Local de Armazenamento</p>
                  <p>{vehicle.localArmazenamento || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Funcionário Responsável</p>
                  <p>{vehicle.funcionarioResponsavel || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Disponibilidade</p>
                  {getStatusBadge(vehicle.disponibilidade)}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">CS Responsável</p>
                  <p>{vehicle.csResponsavel || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Locatário Atual</p>
                  <p>{vehicle.locatarioAtual || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">CPF do Locatário</p>
                  <p>{vehicle.locatarioCpf || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>


          {/* 4. Observações e Anexos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquare className="h-5 w-5" />
                Observações e Anexos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Observações Operacionais</p>
                  <div className="bg-muted p-3 rounded-lg">
                    <p>{vehicle.observacoesOperacionais || "Nenhuma observação registrada."}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Data da Última Vistoria</p>
                    <p>{formatDate(vehicle.dataUltimaVistoria)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Boletim de Ocorrência</p>
                    {getBooleanBadge(vehicle.boletimOcorrencia, { true: "Sim", false: "Não", null: "Em andamento" })}
                  </div>
                </div>
                
                {vehicle.linkDocumentos && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Link para Documentos</p>
                    <Button variant="outline" size="sm" asChild>
                      <a href={vehicle.linkDocumentos} target="_blank" rel="noopener noreferrer">
                        Acessar Documentos
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Códigos e Identificadores */}
          {(vehicle.codigoSistemaInterno || vehicle.codigoAsaas || vehicle.tagRastreamento) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building className="h-5 w-5" />
                  Códigos e Identificadores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Código Sistema Interno</p>
                    <p>{vehicle.codigoSistemaInterno || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Código Asaas</p>
                    <p>{vehicle.codigoAsaas || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tag de Rastreamento</p>
                    <p>{vehicle.tagRastreamento || "N/A"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Metadados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5" />
                Informações do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Data de Criação</p>
                  <p>{formatDate(vehicle.dataCriacao)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Última Atualização</p>
                  <p>{formatDate(vehicle.dataUltimaAtualizacao)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Criado por</p>
                  <p>{vehicle.criadoPor || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Atualizado por</p>
                  <p>{vehicle.atualizadoPor || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}