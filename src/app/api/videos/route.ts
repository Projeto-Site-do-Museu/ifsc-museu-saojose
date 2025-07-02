import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const videos = await prisma.videoEspecial.findMany({
      where: {
        ativo: true,
      },
      select: {
        id: true,
        titulo: true,
        video: true,
        thumbnail: true,
        tipo: true,
        ordem: true,
      },
      orderBy: [{ ordem: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(videos);
  } catch (error) {
    console.error('Erro ao buscar dados dos vídeos:', error);
    return NextResponse.json(
      { message: 'Erro ao buscar dados dos vídeos' },
      { status: 500 },
    );
  }
}
