'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { isAuthorizedAdmin } from '@/lib/auth/permissions';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, AlertTriangle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Será redirecionado para login
  }

  // Verificar se o usuário tem permissão de admin
  if (!isAuthorizedAdmin(user.uid)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8 space-y-6">
            <div className="p-4 rounded-full bg-destructive/10">
              <AlertTriangle className="h-12 w-12 text-destructive" />
            </div>
            
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">
                Acesso Restrito
              </h2>
              <p className="text-muted-foreground">
                Sua conta não possui permissão para acessar esta área do sistema.
              </p>
              <p className="text-sm text-muted-foreground">
                Entre em contato com o administrador para solicitar acesso.
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full">
              <div className="text-xs text-muted-foreground text-center p-3 bg-muted rounded-lg">
                <p className="font-medium">Usuário atual:</p>
                <p className="font-mono">{user.email}</p>
                <p className="font-mono text-xs mt-1">ID: {user.uid}</p>
              </div>
              
              <Button 
                onClick={() => signOut()} 
                variant="outline" 
                className="w-full"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Fazer Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}