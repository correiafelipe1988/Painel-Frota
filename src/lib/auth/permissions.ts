// Sistema de permissões do aplicativo
// Lista de UIDs autorizados para acesso completo
export const AUTHORIZED_ADMIN_UIDS = [
  "8tCMf5ksCIQGck1bkkYkS4iQDZQ2", // Usuário original
  "mUnQ1UsIJBTjtwzcfGIF8Lg4jtz1", // Novo usuário autorizado
  "ItKTmShkOQM6B8QoZ9lrVcnZQpI2" // teste@gmail.com
];

// Usuários com permissões específicas
export const SPECIFIC_PERMISSIONS = {
  "uEG78oVNn6P25qem3Kjq4prl97A2": {
    routes: ["/dashboard", "/motorcycles", "/frota"],
    description: "Acesso limitado: Dashboard, Gestão de Motos e Frota"
  }
};

// Verifica se o usuário tem permissão de administrador completo
export const isAuthorizedAdmin = (userUid: string | null | undefined): boolean => {
  if (!userUid) return false;
  return AUTHORIZED_ADMIN_UIDS.includes(userUid);
};

// Verifica se o usuário tem permissão específica para uma rota
export const hasRoutePermission = (userUid: string | null | undefined, route: string): boolean => {
  if (!userUid) return false;
  
  // Admins completos têm acesso a tudo
  if (isAuthorizedAdmin(userUid)) return true;
  
  // Verifica permissões específicas
  const userPermissions = SPECIFIC_PERMISSIONS[userUid as keyof typeof SPECIFIC_PERMISSIONS];
  if (userPermissions) {
    return userPermissions.routes.some(allowedRoute => route.startsWith(allowedRoute));
  }
  
  return false;
};

// Lista de rotas que requerem permissão de admin
export const PROTECTED_ROUTES = [
  "/dashboard",
  "/franqueados", 
  "/motorcycles",
  "/projecao-motos",
  "/financeiro",
  "/frota",
  "/predict-idle"
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
  
  // Verifica permissões específicas
  const userPermissions = SPECIFIC_PERMISSIONS[userUid as keyof typeof SPECIFIC_PERMISSIONS];
  if (userPermissions) {
    return userPermissions.routes;
  }
  
  // Novos usuários não têm acesso a nenhuma rota protegida
  return [];
};