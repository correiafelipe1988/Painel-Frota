"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Shield } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [hasStoredUser, setHasStoredUser] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Verificar se estamos no cliente e se há usuário salvo
  useEffect(() => {
    setIsClient(true);
    const storedUser = localStorage.getItem('firebase_user');
    setHasStoredUser(!!storedUser);
    
    if (storedUser) {
      console.log('Found stored user, showing content immediately');
    }
  }, []);

  // Para aplicações estáticas, NUNCA redirecionar automaticamente
  // Só mostrar conteúdo ou loading
  
  // Se não estamos no cliente ainda, mostrar loading
  if (!isClient) {
    return fallback || (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                Carregando aplicação...
              </h3>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Aguarde...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Se há usuário autenticado, mostrar conteúdo
  if (user) {
    return <>{children}</>;
  }

  // Se há usuário salvo no localStorage, mostrar conteúdo (confiar no localStorage)
  if (hasStoredUser) {
    return <>{children}</>;
  }

  // Se está carregando e não há usuário salvo, mostrar loading por um tempo limitado
  if (loading) {
    return fallback || (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                Verificando autenticação
              </h3>
              <p className="text-sm text-muted-foreground">
                Aguarde enquanto verificamos suas credenciais...
              </p>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Carregando...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Se não há usuário e não há usuário salvo, redirecionar para login
  // Mas fazer isso de forma suave
  useEffect(() => {
    if (isClient && !user && !hasStoredUser && !loading) {
      const currentPath = window.location.pathname + window.location.search;
      if (currentPath !== '/login' && currentPath !== '/signup') {
        localStorage.setItem('redirect_after_login', currentPath);
        console.log('No authentication found, redirecting to login...');
        router.replace('/login');
      }
    }
  }, [isClient, user, hasStoredUser, loading, router]);

  // Fallback enquanto redireciona
  return null;
}