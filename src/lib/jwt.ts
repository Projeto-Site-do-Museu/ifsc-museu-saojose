import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '';
const JWT_EXPIRES_IN = '7d';
const JWT_ALGORITHM = 'HS256';

// Verificar se está usando a chave padrão em produção
if (process.env.NODE_ENV === 'production' && JWT_SECRET === '') {
  throw new Error(
    'JWT_SECRET deve ser definida em produção. Chave padrão não é segura.',
  );
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    algorithm: JWT_ALGORITHM,
    issuer: 'museu-sao-jose',
    audience: 'museu-admin',
  });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: [JWT_ALGORITHM],
      issuer: 'museu-sao-jose',
      audience: 'museu-admin',
    }) as JWTPayload;

    // Verificações adicionais de segurança
    if (!decoded.userId || !decoded.email || !decoded.role) {
      console.error('Token inválido: campos obrigatórios ausentes');
      return null;
    }

    return decoded;
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return null;
  }
}

export function getTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}
