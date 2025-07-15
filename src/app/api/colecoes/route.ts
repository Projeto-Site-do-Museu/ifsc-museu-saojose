import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const colecoes = await prisma.acervo.findMany({
      where: {
        ativo: true,
        colecao: {
          not: null,
        },
      },
      select: {
        colecao: true,
      },
      distinct: ['colecao'],
      orderBy: {
        colecao: 'asc',
      },
    });

    const colecoesFormatadas = colecoes
      .map((item) => item.colecao)
      .filter((colecao) => colecao && colecao.trim() !== '');

    return NextResponse.json(colecoesFormatadas);
  } catch (error) {
    console.error('Erro ao buscar coleções:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}
