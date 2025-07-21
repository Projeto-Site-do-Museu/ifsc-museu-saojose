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
      orderBy: [{ ordem: 'asc' }, { createdAt: 'desc' }],
    });

    const galleryData = acervos.map((acervo) => {
      const thumbnailUrl =
        acervo.midias[0]?.url || acervo.imagem || '/imgs/placeholder.jpg';

      return {
        id: acervo.id,
        img: thumbnailUrl,
        text: acervo.titulo,
        descricao: acervo.descricao,
      };
    });

    return NextResponse.json(galleryData);
  } catch (error) {
    console.error('Erro ao buscar dados da galeria:', error);
    return NextResponse.json(
      { message: 'Erro ao buscar dados da galeria' },
      { status: 500 },
    );
  }
}
