import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const acervos = await prisma.acervo.findMany({
      where: {
        ativo: true,
      },
      select: {
        id: true,
        titulo: true,
        imagem: true,
        ordem: true,
      },
      orderBy: [{ ordem: 'asc' }, { createdAt: 'desc' }],
    });

    const galleryData = acervos.map((acervo) => ({
      id: acervo.id,
      img: acervo.imagem || '/imgs/placeholder.jpg',
      text: acervo.titulo,
    }));

    return NextResponse.json(galleryData);
  } catch (error) {
    console.error('Erro ao buscar dados da galeria:', error);
    return NextResponse.json(
      { message: 'Erro ao buscar dados da galeria' },
      { status: 500 },
    );
  }
}
