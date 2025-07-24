"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Car, FileCheck, MapPin, DollarSign, MessageSquare, Save, X } from "lucide-react";
import type { VehicleRegistry } from "@/lib/types";

// Schema de validação
const vehicleFormSchema = z.object({
  // 1. Identificação do Veículo
  placa: z.string().min(1, "Placa é obrigatória").max(7, "Formato inválido").regex(/^[A-Z]{3}[0-9]{4}$/, "Formato deve ser ABC1234"),
  chassi: z.string().optional(),
  renavam: z.string().optional(),
  marca: z.string().optional(),
  modelo: z.string().optional(),
  anoFabricacao: z.number().min(1900).max(new Date().getFullYear()).optional(),
  anoModelo: z.number().min(1900).max(new Date().getFullYear()).optional(),
  tipo: z.enum(["Work", "Cargo", "Urbana", "Sport", "Outro"]).optional(),
  corPredominante: z.string().optional(),
  tipoCombustivel: z.enum(["flex", "gasolina", "etanol", "diesel", "eletrico"]).optional(),
  
  // 2. Situação Documental e Legal
  statusPropriedade: z.enum(["propria", "gerenciada", "vendida", "distratada"]).optional(),
  cnpjProprietario: z.string().optional(),
  tpvEmitida: z.boolean().optional(),
  dataUltimaTransferencia: z.string().optional(),
  licenciamentoEmDia: z.boolean().optional(),
  seguroAtivo: z.boolean().optional(),
  multasPendentes: z.boolean().optional(),
  valorMultasPendentes: z.number().min(0).optional(),
  ipvaEmAberto: z.boolean().optional(),
  valorIpvaEmAberto: z.number().min(0).optional(),
  rastreadorAtivo: z.boolean().optional(),
  chassiComBaixa: z.boolean().optional(),
  
  // 3. Localização e Operação
  cidade: z.string().optional(),
  estado: z.string().optional(),
  localArmazenamento: z.string().optional(),
  funcionarioResponsavel: z.string().optional(),
  disponibilidade: z.enum(["locada", "disponivel", "parada", "sinistro", "sucata"]).optional(),
  locatarioAtual: z.string().optional(),
  locatarioCpf: z.string().optional(),
  csResponsavel: z.string().optional(),
  
  
  // 5. Observações e Anexos
  observacoesOperacionais: z.string().optional(),
  linkDocumentos: z.string().url().optional().or(z.literal("")),
  boletimOcorrencia: z.boolean().optional(),
  dataUltimaVistoria: z.string().optional(),
  
  // Extras
  codigoSistemaInterno: z.string().optional(),
  codigoAsaas: z.string().optional(),
  tagRastreamento: z.string().optional(),
});

type VehicleFormData = z.infer<typeof vehicleFormSchema>;

interface VehicleFormProps {
  vehicle?: VehicleRegistry;
  onSubmit: (data: VehicleFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function VehicleForm({ vehicle, onSubmit, onCancel, isLoading }: VehicleFormProps) {
  const [activeTab, setActiveTab] = useState("identificacao");
  
  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: vehicle ? {
      placa: vehicle.placa || "",
      chassi: vehicle.chassi || "",
      renavam: vehicle.renavam || "",
      marca: vehicle.marca || "",
      modelo: vehicle.modelo || "",
      anoFabricacao: vehicle.anoFabricacao,
      anoModelo: vehicle.anoModelo,
      tipo: vehicle.tipo,
      corPredominante: vehicle.corPredominante || "",
      tipoCombustivel: vehicle.tipoCombustivel,
      statusPropriedade: vehicle.statusPropriedade,
      cnpjProprietario: vehicle.cnpjProprietario || "",
      tpvEmitida: vehicle.tpvEmitida || false,
      dataUltimaTransferencia: vehicle.dataUltimaTransferencia || "",
      licenciamentoEmDia: vehicle.licenciamentoEmDia || false,
      seguroAtivo: vehicle.seguroAtivo || false,
      multasPendentes: vehicle.multasPendentes || false,
      valorMultasPendentes: vehicle.valorMultasPendentes || 0,
      ipvaEmAberto: vehicle.ipvaEmAberto || false,
      valorIpvaEmAberto: vehicle.valorIpvaEmAberto || 0,
      rastreadorAtivo: vehicle.rastreadorAtivo || false,
      chassiComBaixa: vehicle.chassiComBaixa || false,
      cidade: vehicle.cidade || "",
      estado: vehicle.estado || "",
      localArmazenamento: vehicle.localArmazenamento || "",
      funcionarioResponsavel: vehicle.funcionarioResponsavel || "",
      disponibilidade: vehicle.disponibilidade,
      locatarioAtual: vehicle.locatarioAtual || "",
      locatarioCpf: vehicle.locatarioCpf || "",
      csResponsavel: vehicle.csResponsavel || "",
      observacoesOperacionais: vehicle.observacoesOperacionais || "",
      linkDocumentos: vehicle.linkDocumentos || "",
      boletimOcorrencia: vehicle.boletimOcorrencia || false,
      dataUltimaVistoria: vehicle.dataUltimaVistoria || "",
      codigoSistemaInterno: vehicle.codigoSistemaInterno || "",
      codigoAsaas: vehicle.codigoAsaas || "",
      tagRastreamento: vehicle.tagRastreamento || "",
    } : {
      placa: "",
      chassi: "",
      renavam: "",
      marca: "",
      modelo: "",
      corPredominante: "",
      cnpjProprietario: "",
      dataUltimaTransferencia: "",
      tpvEmitida: false,
      licenciamentoEmDia: false,
      seguroAtivo: false,
      multasPendentes: false,
      valorMultasPendentes: 0,
      ipvaEmAberto: false,
      valorIpvaEmAberto: 0,
      rastreadorAtivo: false,
      chassiComBaixa: false,
      cidade: "",
      estado: "",
      localArmazenamento: "",
      funcionarioResponsavel: "",
      locatarioAtual: "",
      locatarioCpf: "",
      csResponsavel: "",
      observacoesOperacionais: "",
      linkDocumentos: "",
      boletimOcorrencia: false,
      dataUltimaVistoria: "",
      codigoSistemaInterno: "",
      codigoAsaas: "",
      tagRastreamento: "",
    },
  });

  const handleSubmit = async (data: VehicleFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Erro ao salvar veículo:', error);
    }
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5" />
          {vehicle ? 'Editar Veículo' : 'Novo Veículo'}
        </CardTitle>
        <CardDescription>
          {vehicle ? 'Edite as informações do veículo' : 'Cadastre um novo veículo no sistema'}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="identificacao" className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  Identificação
                </TabsTrigger>
                <TabsTrigger value="documental" className="flex items-center gap-2">
                  <FileCheck className="h-4 w-4" />
                  Documental
                </TabsTrigger>
                <TabsTrigger value="localizacao" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Localização
                </TabsTrigger>
                <TabsTrigger value="observacoes" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Observações
                </TabsTrigger>
              </TabsList>

              {/* 1. Identificação do Veículo */}
              <TabsContent value="identificacao" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="placa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Placa *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="ABC1234" 
                            {...field} 
                            value={field.value || ''}
                            onChange={(e) => {
                              const value = e.target.value.replace('-', '').toUpperCase();
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="chassi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chassi</FormLabel>
                        <FormControl>
                          <Input placeholder="Número do chassi" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="renavam"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>RENAVAM</FormLabel>
                        <FormControl>
                          <Input placeholder="Número do RENAVAM" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="marca"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marca</FormLabel>
                        <FormControl>
                          <Input placeholder="Honda" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="modelo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Modelo</FormLabel>
                        <FormControl>
                          <Input placeholder="CG 160" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="anoFabricacao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ano de Fabricação</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="2023" 
                            {...field} 
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="anoModelo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ano do Modelo</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="2023" 
                            {...field} 
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="corPredominante"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cor Predominante</FormLabel>
                        <FormControl>
                          <Input placeholder="Azul" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              {/* 2. Situação Documental e Legal */}
              <TabsContent value="documental" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="statusPropriedade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status de Propriedade</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="propria">Própria</SelectItem>
                            <SelectItem value="gerenciada">Gerenciada</SelectItem>
                            <SelectItem value="vendida">Vendida</SelectItem>
                            <SelectItem value="distratada">Distrato em Andamento</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="cnpjProprietario"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CNPJ do Proprietário</FormLabel>
                        <FormControl>
                          <Input placeholder="00.000.000/0000-00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="dataUltimaTransferencia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data da Última Transferência</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="col-span-full">
                    <h4 className="font-medium mb-4">Situação dos Documentos</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="tpvEmitida"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">TPV Emitida</FormLabel>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="licenciamentoEmDia"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Licenciamento em Dia</FormLabel>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="seguroAtivo"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Seguro Ativo</FormLabel>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="multasPendentes"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Multas Pendentes</FormLabel>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="ipvaEmAberto"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">IPVA em Aberto</FormLabel>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="rastreadorAtivo"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Rastreador Ativo</FormLabel>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="valorMultasPendentes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor das Multas Pendentes</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="0,00" 
                              {...field} 
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="valorIpvaEmAberto"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor do IPVA em Aberto</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="0,00" 
                              {...field} 
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* 3. Localização e Operação */}
              <TabsContent value="localizacao" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="cidade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cidade</FormLabel>
                        <FormControl>
                          <Input placeholder="São Paulo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="estado"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <FormControl>
                          <Input placeholder="SP" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="localArmazenamento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Local de Armazenamento</FormLabel>
                        <FormControl>
                          <Input placeholder="Galpão Principal" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="funcionarioResponsavel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Funcionário Responsável</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome do funcionário" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="disponibilidade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Disponibilidade</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a disponibilidade" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="disponivel">Disponível</SelectItem>
                            <SelectItem value="locada">Locada</SelectItem>
                            <SelectItem value="parada">Parada</SelectItem>
                            <SelectItem value="sinistro">Sinistro</SelectItem>
                            <SelectItem value="sucata">Sucata</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="csResponsavel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CS Responsável</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome do CS" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="locatarioAtual"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Locatário Atual</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome do locatário" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="locatarioCpf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CPF do Locatário</FormLabel>
                        <FormControl>
                          <Input placeholder="000.000.000-00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>


              {/* 4. Observações e Anexos */}
              <TabsContent value="observacoes" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="observacoesOperacionais"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observações Operacionais</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Motor fundido, vistoria pendente, etc." 
                            className="resize-none"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="linkDocumentos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Link para Documentos</FormLabel>
                        <FormControl>
                          <Input placeholder="https://drive.google.com/..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="dataUltimaVistoria"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data da Última Vistoria</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="boletimOcorrencia"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Boletim de Ocorrência</FormLabel>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-4">Códigos e Identificadores</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="codigoSistemaInterno"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Código do Sistema Interno</FormLabel>
                          <FormControl>
                            <Input placeholder="SIST-001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="codigoAsaas"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Código Asaas</FormLabel>
                          <FormControl>
                            <Input placeholder="ASAAS-001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="tagRastreamento"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tag de Rastreamento</FormLabel>
                          <FormControl>
                            <Input placeholder="TAG-001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Botões de ação */}
            <div className="flex justify-end space-x-4 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}