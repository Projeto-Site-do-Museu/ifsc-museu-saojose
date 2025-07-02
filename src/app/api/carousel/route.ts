import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const artigos = await prisma.artigo.findMany({
      where: {
        ativo: true,
        dataPublicacao: {
          not: null,
        },
      },
      select: {
        id: true,
        titulo: true,
        resumo: true,
        imagem: true,
      },
      orderBy: {
        dataPublicacao: 'desc',
      },
      take: 5,
    });

    const carouselData = artigos.map((artigo) => ({
      id: artigo.id,
      img: artigo.imagem || '/imgs/placeholder.jpg',
      text: artigo.resumo || artigo.titulo,
    }));

    return NextResponse.json(carouselData);
  } catch (error) {
    console.error('Erro ao buscar dados do carrossel:', error);
    return NextResponse.json(
      { message: 'Erro ao buscar dados do carrossel' },
      { status: 500 },
    );
  }
}
