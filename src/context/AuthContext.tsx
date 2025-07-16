"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const [hasStoredAuth, setHasStoredAuth] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Verificar localStorage primeiro para evitar redirecionamento desnecessário
    const checkInitialAuth = () => {
      if (typeof window !== 'undefined') {
        const savedUser = localStorage.getItem('firebase_user');
        if (savedUser) {
          try {
            const userData = JSON.parse(savedUser);
            console.log('Found saved user in localStorage:', userData.email);
            // Para aplicações estáticas, aguardar mais tempo para o Firebase Auth
            setInitialCheckDone(true);
            return true;
          } catch (error) {
            console.warn('Error parsing saved user:', error);
            localStorage.removeItem('firebase_user');
          }
        }
      }
      setInitialCheckDone(true);
      return false;
    };

    const hasStoredUser = checkInitialAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Verificar se o componente ainda está montado para evitar atualizações desnecessárias
      if (!isMounted) return;
      
      console.log('Auth state changed:', user ? `User logged in: ${user.email}` : 'User logged out');
      setUser(user);
      setLoading(false);
      setInitialCheckDone(true);
      
      // Salvar/remover usuário do localStorage de forma mais eficiente
      if (typeof window !== 'undefined') {
        if (user) {
          const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            timestamp: Date.now() // Adicionar timestamp para debug
          };
          try {
            localStorage.setItem('firebase_user', JSON.stringify(userData));
            console.log('User data saved to localStorage:', userData.email);
          } catch (error) {
            console.warn('Failed to save user data to localStorage:', error);
          }
        } else {
          try {
            localStorage.removeItem('firebase_user');
            console.log('User data removed from localStorage');
          } catch (error) {
            console.warn('Failed to remove user data from localStorage:', error);
          }
        }
      }
    }, (error) => {
      if (!isMounted) return;
      console.error('Auth state change error:', error);
      setLoading(false);
      setInitialCheckDone(true);
    });

    // Para aplicações estáticas, aguardar mais tempo antes de definir loading como false
    if (!hasStoredUser) {
      const timeout = setTimeout(() => {
        if (isMounted && !initialCheckDone) {
          console.log('Timeout reached, setting loading to false');
          setLoading(false);
          setInitialCheckDone(true);
        }
      }, 3000); // Aumentado para 3 segundos

      return () => {
        isMounted = false;
        unsubscribe();
        clearTimeout(timeout);
      };
    } else {
      // Se há usuário salvo, aguardar mais tempo para o Firebase Auth restaurar
      const timeout = setTimeout(() => {
        if (isMounted && !user) {
          console.log('Stored user found but Firebase Auth not restored, setting loading to false');
          setLoading(false);
        }
      }, 4000); // 4 segundos para usuários salvos

      return () => {
        isMounted = false;
        unsubscribe();
        clearTimeout(timeout);
      };
    }

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [initialCheckDone, user]);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao Controle de Frota",
      });
    } catch (error: any) {
      let errorMessage = "Erro ao fazer login";
      
      switch (error.code) {
        case 'auth/api-key-not-valid':
          errorMessage = "Chave de API do Firebase inválida. Verifique a configuração.";
          break;
        case 'auth/user-not-found':
          errorMessage = "Usuário não encontrado";
          break;
        case 'auth/wrong-password':
          errorMessage = "Senha incorreta";
          break;
        case 'auth/invalid-email':
          errorMessage = "Email inválido";
          break;
        case 'auth/user-disabled':
          errorMessage = "Usuário desabilitado";
          break;
        case 'auth/too-many-requests':
          errorMessage = "Muitas tentativas. Tente novamente mais tarde";
          break;
        case 'auth/invalid-credential':
          errorMessage = "Credenciais inválidas";
          break;
        case 'auth/network-request-failed':
          errorMessage = "Erro de rede. Verifique sua conexão.";
          break;
        default:
          errorMessage = error.message || "Erro desconhecido";
      }
      
      toast({
        title: "Erro no login",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      
      toast({
        title: "Conta criada com sucesso!",
        description: "Bem-vindo ao Controle de Frota",
      });
    } catch (error: any) {
      let errorMessage = "Erro ao criar conta";
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = "Este email já está em uso";
          break;
        case 'auth/invalid-email':
          errorMessage = "Email inválido";
          break;
        case 'auth/weak-password':
          errorMessage = "A senha deve ter pelo menos 6 caracteres";
          break;
        default:
          errorMessage = error.message || "Erro desconhecido";
      }
      
      toast({
        title: "Erro ao criar conta",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logout realizado",
        description: "Até logo!",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao fazer logout",
        description: error.message || "Erro desconhecido",
        variant: "destructive",
      });
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}