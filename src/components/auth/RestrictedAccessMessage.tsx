"use client";

import { Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RestrictedAccessMessage() {
  const handleRequestAccess = () => {
    const emailSubject = "Solicitação de Acesso - Sistema de Controle de Frota";
    const emailBody = `Olá,

Gostaria de solicitar acesso completo ao sistema de controle de frota.

Informações do usuário:
- Email: ${localStorage.getItem('userEmail') || 'N/A'}
- Data da solicitação: ${new Date().toLocaleDateString('pt-BR')}

Atenciosamente,
[Seu Nome]`;

    const mailtoLink = `mailto:felipe.correia@locagoraba.com.br?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(mailtoLink, '_blank');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-8">
      <div className="text-center max-w-2xl">
        {/* Ícone Principal */}
        <div className="flex justify-center mb-12">
          <div className="relative">
            {/* Círculo principal */}
            <div className="w-32 h-32 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center border-4 border-red-200 dark:border-red-800">
              <Lock className="h-16 w-16 text-red-500 dark:text-red-400" />
            </div>
            {/* Círculo de proibição */}
            <div className="absolute inset-0 w-32 h-32 rounded-full border-4 border-red-500 dark:border-red-400">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-1 bg-red-500 dark:bg-red-400 rotate-45"></div>
            </div>
          </div>
        </div>
        
        {/* Título */}
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Acesso Restrito
        </h1>
        
        {/* Texto Principal */}
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
          Você não possui permissão para acessar esta área do sistema.
        </p>
        
        {/* Texto Secundário */}
        <p className="text-base text-gray-500 dark:text-gray-400 mb-10 leading-relaxed max-w-xl mx-auto">
          Esta seção contém informações sensíveis da frota que requerem autorização especial. 
          Entre em contato com o administrador do sistema para solicitar as permissões necessárias.
        </p>
        
        {/* Botão de Ação */}
        <div className="flex justify-center">
          <Button 
            onClick={handleRequestAccess}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-lg transition-colors"
            size="lg"
          >
            <Mail className="h-5 w-5 mr-3" />
            Solicitar Acesso
          </Button>
        </div>
        
        {/* Informação Adicional */}
        <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            <strong className="text-gray-900 dark:text-gray-200">Sua conta foi criada com sucesso!</strong><br />
            Agora você precisa aguardar a aprovação do administrador para acessar o sistema completo. 
            Você será notificado por email assim que o acesso for liberado.
          </p>
        </div>
      </div>
    </div>
  );
}