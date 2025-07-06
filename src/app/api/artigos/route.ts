import { withAuth } from '@/lib/middleware';
import { prisma } from '@/lib/prisma';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const artigos = await prisma.artigo.findMany({
      where: {
        ativo: true,
      },
      select: {
        id: true,
        titulo: true,
        resumo: true,
        imagem: true,
        dataPublicacao: true,
      },
      orderBy: {
        dataPublicacao: 'desc',
      },
    });

    return NextResponse.json(artigos);
  } catch (error) {
    console.error('Erro ao buscar artigos:', error);
    return NextResponse.json(
      { message: 'Erro ao buscar dados dos artigos' },
      { status: 500 },
    );
  }
}

// POST - Criar novo artigo (protegido)
export const POST = withAuth(async (request: NextRequest, user) => {
  if (user.role !== 'admin') {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
  }

  try {
    const { titulo, resumo, conteudo, imagem } = await request.json();

    if (!titulo) {
      return NextResponse.json(
        { error: 'Título é obrigatório' },
        { status: 400 },
      );
    }

    const artigo = await prisma.artigo.create({
      data: {
        titulo,
        resumo,
        conteudo,
        imagem,
        dataPublicacao: new Date(),
        ativo: true,
        usuarioId: Number.parseInt(user.userId),
      },
    });

    return NextResponse.json(artigo, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar artigo:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
});
