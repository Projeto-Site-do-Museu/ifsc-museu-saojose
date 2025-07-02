import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

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
