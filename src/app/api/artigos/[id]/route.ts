import { deleteLocalImage } from '@/lib/imageUtils';
import { withAuth } from '@/lib/middleware';
import { prisma } from '@/lib/prisma';
import { type NextRequest, NextResponse } from 'next/server';

// GET - Buscar artigo específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const artigo = await prisma.artigo.findUnique({
      where: {
        id: Number.parseInt(params.id),
        ativo: true,
      },
    });

    if (!artigo) {
      return NextResponse.json(
        { error: 'Artigo não encontrado' },
        { status: 404 },
      );
    }

    return NextResponse.json(artigo);
  } catch (error) {
    console.error('Erro ao buscar artigo:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}

// PUT - Atualizar artigo (protegido)
export const PUT = withAuth(
  async (
    request: NextRequest,
    user,
    context?: { params: { id: string } },
    token?: string,
  ) => {
    try {
      const { titulo, resumo, conteudo, imagem } = await request.json();

      const artigo = await prisma.artigo.update({
        where: {
          id: Number.parseInt(context?.params?.id ?? ''),
        },
        data: {
          titulo,
          resumo,
          conteudo,
          imagem,
        },
      });

      return NextResponse.json(artigo);
    } catch (error) {
      console.error('Erro ao atualizar artigo:', error);
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 },
      );
    }
  },
);

// DELETE - Deletar artigo (protegido)
export const DELETE = withAuth(
  async (
    request: NextRequest,
    user,
    context?: { params: { id: string } },
    token?: string,
  ) => {
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    if (!context?.params?.id) {
      return NextResponse.json(
        { error: 'ID do artigo é obrigatório' },
        { status: 400 },
      );
    }

    try {
      // Buscar o artigo antes de deletar para pegar a URL da imagem
      const artigo = await prisma.artigo.findUnique({
        where: {
          id: Number.parseInt(context.params.id),
        },
        select: {
          imagem: true,
        },
      });

      if (!artigo) {
        return NextResponse.json(
          { error: 'Artigo não encontrado' },
          { status: 404 },
        );
      }

      // Deletar imagem física se for uma imagem local
      await deleteLocalImage(artigo.imagem, token);

      // Fazer soft delete do artigo
      await prisma.artigo.update({
        where: {
          id: Number.parseInt(context.params.id),
        },
        data: {
          ativo: false,
        },
      });

      return NextResponse.json({ message: 'Artigo deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar artigo:', error);
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 },
      );
    }
  },
);
