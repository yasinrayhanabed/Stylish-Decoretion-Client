import { jwtDecode } from 'jwt-decode';

/**
 * JWT Token Verification Utilities
 */

export const verifyToken = (token) => {
  if (!token) {
    return { isValid: false, error: 'No token provided' };
  }

  try {
    const decoded = jwtDecode(token);
    
    // Check if token is expired
    if (decoded.exp * 1000 < Date.now()) {
      return { isValid: false, error: 'Token expired' };
    }

    return { 
      isValid: true, 
      decoded,
      user: {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        name: decoded.name
      }
    };
  } catch (error) {
    return { isValid: false, error: 'Invalid token format' };
  }
};

export const getTokenFromStorage = () => {
  return localStorage.getItem('token');
};

export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export const getUserFromToken = (token) => {
  const verification = verifyToken(token);
  return verification.isValid ? verification.user : null;
};

export const hasRole = (token, requiredRole) => {
  const user = getUserFromToken(token);
  return user && user.role === requiredRole;
};

export const hasAnyRole = (token, roles) => {
  const user = getUserFromToken(token);
  return user && roles.includes(user.role);
};