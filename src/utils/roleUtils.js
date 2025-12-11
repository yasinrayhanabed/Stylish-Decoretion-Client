// Role-based utility functions

export const ROLES = {
  ADMIN: 'admin',
  DECORATOR: 'decorator', 
  USER: 'user'
};

export const hasRole = (user, requiredRole) => {
  if (!user || !user.role) return false;
  return user.role.toLowerCase() === requiredRole.toLowerCase();
};

export const hasAnyRole = (user, requiredRoles = []) => {
  if (!user || !user.role) return false;
  return requiredRoles.some(role => 
    user.role.toLowerCase() === role.toLowerCase()
  );
};

export const isAdmin = (user) => hasRole(user, ROLES.ADMIN);
export const isDecorator = (user) => hasRole(user, ROLES.DECORATOR);
export const isUser = (user) => hasRole(user, ROLES.USER);

export const canAccessAdminRoutes = (user) => isAdmin(user);
export const canAccessDecoratorRoutes = (user) => hasAnyRole(user, [ROLES.ADMIN, ROLES.DECORATOR]);
export const canAccessUserRoutes = (user) => !!user; // Any authenticated user