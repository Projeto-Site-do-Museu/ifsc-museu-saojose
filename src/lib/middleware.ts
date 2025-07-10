import { type NextRequest, NextResponse } from 'next/server';
import { type JWTPayload, getTokenFromHeader, verifyToken } from './jwt';

export function withAuth<T = unknown>(
  handler: (
    req: NextRequest,
    user: JWTPayload,
    context?: T,
  ) => Promise<NextResponse>,
) {
  return async (req: NextRequest, context?: T) => {
    const authHeader = req.headers.get('Authorization');
    const token = getTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        { error: 'Token de acesso requerido' },
        { status: 401 },
      );
    }

    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json(
        { error: 'Token inválido ou expirado' },
        { status: 401 },
      );
    }

    if (user.exp && user.exp * 1000 < Date.now() + 60000) {
      return NextResponse.json(
        {
          error: 'Token próximo do vencimento. Por favor, faça login novamente',
        },
        { status: 401 },
      );
    }

    return handler(req, user, context);
  };
}

export function requireRole(role: string) {
  return <T = unknown>(
    handler: (
      req: NextRequest,
      user: JWTPayload,
      context?: T,
    ) => Promise<NextResponse>,
  ) =>
    withAuth(async (req: NextRequest, user: JWTPayload, context?: T) => {
      if (user.role !== role) {
        return NextResponse.json(
          { error: 'Permissão insuficiente' },
          { status: 403 },
        );
      }
      return handler(req, user, context);
    });
}
