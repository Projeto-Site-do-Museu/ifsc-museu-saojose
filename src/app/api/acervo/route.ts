import { withAuth } from '@/lib/middleware';
import { prisma } from '@/lib/prisma';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const acervos = await prisma.acervo.findMany({
      where: {
        ativo: true,
      },
      select: {
        id: true,
        titulo: true,
        descricao: true,
        imagem: true,
        colecao: true,
        ordem: true,
        createdAt: true,
      },
      orderBy: [
        { ordem: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json(acervos);
  } catch (error) {
    console.error('Erro ao buscar acervos:', error);
    return NextResponse.json(
      { message: 'Erro ao buscar dados do acervo' },
      { status: 500 },
    );
  }
}

export const POST = withAuth(async (request: NextRequest, user) => {
  if (user.role !== 'admin') {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
  }

  try {
    const { titulo, descricao, imagem, colecao, midias } = await request.json();

    if (!titulo) {
      return NextResponse.json(
        { error: 'Título é obrigatório' },
        { status: 400 },
      );
    }

    // Buscar próxima ordem automaticamente
    const ultimoAcervo = await prisma.acervo.findFirst({
      where: { ativo: true },
      orderBy: { ordem: 'desc' },
      select: { ordem: true },
    });

    const proximaOrdem = (ultimoAcervo?.ordem || 0) + 1;

    const acervo = await prisma.acervo.create({
      data: {
        titulo,
        descricao,
        imagem,
        colecao,
        ordem: proximaOrdem,
        ativo: true,
        usuarioId: Number.parseInt(user.userId),
      },
    });

    if (midias && Array.isArray(midias) && midias.length > 0) {
      await prisma.acervoMidia.createMany({
        data: midias.map((midia: any) => ({
          acervoId: acervo.id,
          tipo: midia.tipo,
          url: midia.url,
          titulo: midia.titulo || '',
          ordem: midia.ordem || 0,
          ativo: true,
        })),
      });
    }

    return NextResponse.json(acervo, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar item do acervo:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}); 
