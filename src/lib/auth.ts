import type { JWTPayload } from './jwt';

export function isTokenValid(token: string): boolean {
  if (!token || token.length < 10) {
    return false;
  }

  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }

    const payload = JSON.parse(atob(parts[1])) as JWTPayload;

    // Verificar se o token não expirou
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return false;
    }

    // Verificar se tem os campos obrigatórios
    if (!payload.userId || !payload.email || !payload.role) {
      return false;
    }

    // Verificar se o role é admin
    if (payload.role !== 'admin') {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao validar token:', error);
    return false;
  }
}

export function getTokenPayload(token: string): JWTPayload | null {
  if (!isTokenValid(token)) {
    return null;
  }

  try {
    const parts = token.split('.');
    return JSON.parse(atob(parts[1])) as JWTPayload;
  } catch {
    return null;
  }
}

export function isTokenExpiringSoon(
  token: string,
  minutesBeforeExpiry = 5,
): boolean {
  const payload = getTokenPayload(token);
  if (!payload || !payload.exp) {
    return true;
  }

  const expirationTime = payload.exp * 1000;
  const warningTime = expirationTime - minutesBeforeExpiry * 60 * 1000;

  return Date.now() > warningTime;
}

export function removeInvalidToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('adminToken');
  }
}
