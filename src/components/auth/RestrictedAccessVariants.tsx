"use client";

import { Lock, Mail, ArrowRight, Shield, UserX, AlertCircle, Key, Settings, User, Phone, MessageCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

// Função helper para email
const handleRequestAccess = () => {
  const emailSubject = "Solicitação de Acesso - Sistema de Controle de Frota";
  const emailBody = `Olá,

Gostaria de solicitar acesso completo ao sistema de controle de frota.

Informações do usuário:
- Email: ${localStorage.getItem('userEmail') || 'N/A'}
- Data da solicitação: ${new Date().toLocaleDateString('pt-BR')}

Atenciosamente,
[Seu Nome]`;

  const mailtoLink = `mailto:admin@example.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  window.open(mailtoLink, '_blank');
};

// OPÇÃO 1: Atual (Minimalista com Card)
export function RestrictedAccessOption1() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] p-8">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary/10 rounded-full">
              <Lock className="h-12 w-12 text-primary" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-3 text-foreground">
            Acesso Restrito
          </h2>
          
          <p className="text-muted-foreground mb-4 leading-relaxed">
            Esta área requer permissões especiais de administrador para visualizar dados da frota.
          </p>
          
          <p className="text-sm text-muted-foreground mb-6">
            Sua conta foi criada com sucesso, mas você precisa de aprovação para acessar o sistema completo.
          </p>
          
          <div className="space-y-3">
            <Button 
              onClick={handleRequestAccess}
              className="w-full flex items-center justify-center gap-2"
            >
              <Mail className="h-4 w-4" />
              Solicitar Acesso
              <ArrowRight className="h-4 w-4" />
            </Button>
            
            <p className="text-xs text-muted-foreground">
              Entre em contato com o administrador do sistema para obter as permissões necessárias.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// OPÇÃO 2: Alert Banner (Mais Compacto)
export function RestrictedAccessOption2() {
  return (
    <div className="p-6">
      <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
        <AlertCircle className="h-5 w-5 text-amber-600" />
        <AlertDescription className="text-amber-800 dark:text-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <strong className="font-semibold">Acesso Restrito</strong>
              <p className="mt-1">Esta área requer permissões especiais de administrador. Sua conta precisa ser aprovada para acessar o sistema completo.</p>
            </div>
            <Button 
              onClick={handleRequestAccess}
              variant="outline" 
              size="sm"
              className="ml-4 border-amber-300 text-amber-700 hover:bg-amber-100"
            >
              <Mail className="h-4 w-4 mr-2" />
              Solicitar Acesso
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}

// OPÇÃO 3: Design Moderno com Gradiente
export function RestrictedAccessOption3() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] p-8">
      <div className="w-full max-w-lg">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-950/20 p-8 shadow-xl">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-16 w-16 rounded-full bg-blue-500/20"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-12 w-12 rounded-full bg-indigo-500/20"></div>
          
          <div className="relative text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-blue-500 rounded-full shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
              Área Protegida
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Esta seção contém informações sensíveis da frota que requerem permissões especiais de administrador.
            </p>
            
            <div className="space-y-4">
              <Button 
                onClick={handleRequestAccess}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Mail className="h-4 w-4 mr-2" />
                Solicitar Permissão de Acesso
              </Button>
              
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <User className="h-4 w-4" />
                <span>Conta criada com sucesso</span>
                <Badge variant="secondary">Aguardando aprovação</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// OPÇÃO 4: Estilo Dashboard com Ícones
export function RestrictedAccessOption4() {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg border shadow-sm p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                <UserX className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-2">Permissões Insuficientes</h2>
            <p className="text-muted-foreground">
              Você não possui as permissões necessárias para acessar esta área do sistema.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card className="text-center">
              <CardContent className="p-4">
                <Key className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                <h3 className="font-medium mb-1">Conta Criada</h3>
                <p className="text-sm text-muted-foreground">Sua conta foi registrada com sucesso</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-4">
                <Settings className="h-6 w-6 text-amber-500 mx-auto mb-2" />
                <h3 className="font-medium mb-1">Aguardando Aprovação</h3>
                <p className="text-sm text-muted-foreground">Administrador precisa aprovar o acesso</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-4">
                <Shield className="h-6 w-6 text-green-500 mx-auto mb-2" />
                <h3 className="font-medium mb-1">Acesso Completo</h3>
                <p className="text-sm text-muted-foreground">Após aprovação, acesse tudo</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={handleRequestAccess} className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Solicitar Acesso por Email
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Contatar Suporte
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// OPÇÃO 5: Estilo Minimalista com Lista
export function RestrictedAccessOption5() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] p-8">
      <div className="w-full max-w-md text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
            <Lock className="h-8 w-8 text-gray-600 dark:text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Acesso Restrito</h2>
          <p className="text-muted-foreground mb-6">
            Esta área requer permissões especiais de administrador.
          </p>
        </div>
        
        <div className="space-y-3 mb-6 text-left">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="font-medium">Conta Criada</p>
              <p className="text-sm text-muted-foreground">Sua conta foi registrada com sucesso</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="font-medium">Aguardando Aprovação</p>
              <p className="text-sm text-muted-foreground">Administrador precisa aprovar seu acesso</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-gray-300 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="font-medium text-muted-foreground">Acesso Completo</p>
              <p className="text-sm text-muted-foreground">Disponível após aprovação</p>
            </div>
          </div>
        </div>
        
        <Button onClick={handleRequestAccess} className="w-full">
          <MessageCircle className="h-4 w-4 mr-2" />
          Solicitar Aprovação
        </Button>
      </div>
    </div>
  );
}

// OPÇÃO 6: Estilo Full Screen com Background
export function RestrictedAccessOption6() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <Lock className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <ExternalLink className="h-3 w-3 text-white" />
                </div>
              </div>
            </div>
            
            <h1 className="text-3xl font-bold mb-3">Acesso Restrito</h1>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Esta área do sistema requer permissões especiais de administrador para visualizar dados sensíveis da frota.
            </p>
            
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Sua conta foi criada com sucesso!</strong><br />
                Agora você precisa aguardar a aprovação do administrador para acessar o sistema completo.
              </p>
            </div>
            
            <div className="space-y-3">
              <Button 
                onClick={handleRequestAccess}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                size="lg"
              >
                <Mail className="h-5 w-5 mr-2" />
                Solicitar Acesso Completo
              </Button>
              
              <p className="text-xs text-gray-500">
                Você receberá uma notificação quando o acesso for aprovado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}