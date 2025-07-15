import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const acervos = await prisma.acervo.findMany({
      where: {
        ativo: true,
      },
      include: {
        midias: {
          where: {
            ativo: true,
            tipo: 'imagem',
          },
          orderBy: {
            ordem: 'asc',
          },
          take: 1,
          select: {
            url: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    });

    const carouselData = acervos.map((acervo) => {
      const thumbnailUrl =
        acervo.midias[0]?.url || acervo.imagem || '/imgs/placeholder.jpg';

      return {
        id: acervo.id,
        img: thumbnailUrl,
        text: acervo.descricao || acervo.titulo,
      };
    });

    return NextResponse.json(carouselData);
  } catch (error) {
    console.error('Erro ao buscar dados do carrossel:', error);
    return NextResponse.json(
      { message: 'Erro ao buscar dados do carrossel' },
      { status: 500 },
    );
  }
}
