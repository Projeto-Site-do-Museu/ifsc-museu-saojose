import type { JWTPayload } from '@/lib/jwt';
import { withAuth } from '@/lib/middleware';
import { prisma } from '@/lib/prisma';
import { type NextRequest, NextResponse } from 'next/server';

export const GET = withAuth(async (req: NextRequest, user: JWTPayload) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: {
        id: Number.parseInt(user.userId),
        ativo: true,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 },
      );
    }

    return NextResponse.json({ user: usuario });
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
});
