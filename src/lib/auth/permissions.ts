// Sistema de permissões do aplicativo
// Por enquanto, apenas um usuário específico tem acesso completo

export const AUTHORIZED_ADMIN_UID = "8tCMf5ksCIQGck1bkkYkS4iQDZQ2";

// Verifica se o usuário tem permissão de administrador completo
export const isAuthorizedAdmin = (userUid: string | null | undefined): boolean => {
  if (!userUid) return false;
  return userUid === AUTHORIZED_ADMIN_UID;
};

// Lista de rotas que requerem permissão de admin
export const PROTECTED_ROUTES = [
  "/dashboard",
  "/franqueados", 
  "/motorcycles",
  "/projecao-motos",
  "/financeiro",
  "/frota",
  "/indicadores",
  "/predict-idle",
  "/rastreadores", 
  "/relatorios",
  "/resumo-franqueado",
  "/qr-scanner"
];

// Verifica se uma rota requer permissão especial
export const isProtectedRoute = (pathname: string): boolean => {
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route));
};

// Função para obter rotas permitidas para um usuário
export const getAllowedRoutes = (userUid: string | null | undefined) => {
  if (isAuthorizedAdmin(userUid)) {
    return PROTECTED_ROUTES;
  }
  
  // Novos usuários não têm acesso a nenhuma rota protegida
  return [];
};