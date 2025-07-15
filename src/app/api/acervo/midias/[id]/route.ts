import { withAuth } from '@/lib/middleware';
import { prisma } from '@/lib/prisma';
import { type NextRequest, NextResponse } from 'next/server';

export const DELETE = withAuth(
  async (
    request: NextRequest,
    user,
    context?: { params: { id: string } },
  ) => {
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    if (!context?.params?.id) {
      return NextResponse.json(
        { error: 'ID da mídia é obrigatório' },
        { status: 400 },
      );
    }

    try {
      await prisma.acervoMidia.update({
        where: {
          id: Number.parseInt(context.params.id),
        },
        data: {
          ativo: false,
        },
      });

      return NextResponse.json({ message: 'Mídia deletada com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar mídia:', error);
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 },
      );
    }
  },
); 
