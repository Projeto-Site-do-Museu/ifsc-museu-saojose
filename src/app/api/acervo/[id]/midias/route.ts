import { withAuth } from '@/lib/middleware';
import { prisma } from '@/lib/prisma';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const midias = await prisma.acervoMidia.findMany({
      where: {
        acervoId: Number.parseInt(params.id),
        ativo: true,
      },
      orderBy: {
        ordem: 'asc',
      },
    });

    return NextResponse.json(midias);
  } catch (error) {
    console.error('Erro ao buscar mídias do acervo:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}

export const POST = withAuth(
  async (request: NextRequest, user, context?: { params: { id: string } }) => {
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    try {
      const { tipo, url, titulo, ordem } = await request.json();
      const acervoId = Number.parseInt(context?.params?.id ?? '');

      if (!tipo || !url) {
        return NextResponse.json(
          { error: 'Tipo e URL são obrigatórios' },
          { status: 400 },
        );
      }

      if (!['imagem', 'iframe'].includes(tipo)) {
        return NextResponse.json(
          { error: 'Tipo deve ser "imagem" ou "iframe"' },
          { status: 400 },
        );
      }

      const midia = await prisma.acervoMidia.create({
        data: {
          acervoId,
          tipo,
          url,
          titulo,
          ordem: ordem || 0,
          ativo: true,
        },
      });

      return NextResponse.json(midia, { status: 201 });
    } catch (error) {
      console.error('Erro ao criar mídia do acervo:', error);
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 },
      );
    }
  },
);
