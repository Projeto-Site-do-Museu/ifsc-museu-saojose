import { deleteLocalImage, deleteMultipleLocalImages } from '@/lib/imageUtils';
import { requireRole } from '@/lib/middleware';
import { type NextRequest, NextResponse } from 'next/server';

export const DELETE = requireRole('admin')(
  async (request: NextRequest, user) => {
    try {
      const body = await request.json();
      const { imageUrl, imageUrls } = body;

      if (!imageUrl && !imageUrls) {
        return NextResponse.json(
          { error: 'imageUrl ou imageUrls é obrigatório' },
          { status: 400 },
        );
      }
      const authHeader = request.headers.get('Authorization');
      const token = authHeader?.replace('Bearer ', '') || null;

      if (imageUrl && !imageUrls) {
        const result = await deleteLocalImage(imageUrl, token);

        if (!result.success) {
          return NextResponse.json(
            { error: result.error },
            {
              status: result.error?.includes('Token')
                ? 401
                : result.error?.includes('Permissão')
                  ? 403
                  : 404,
            },
          );
        }

        return NextResponse.json({
          message: 'Imagem deletada com sucesso',
          success: true,
        });
      }

      if (imageUrls && Array.isArray(imageUrls)) {
        const result = await deleteMultipleLocalImages(imageUrls, token);

        if (!result.success && result.deletedCount === 0) {
          return NextResponse.json(
            { error: result.errors[0] || 'Falha ao deletar imagens' },
            {
              status: result.errors[0]?.includes('Token')
                ? 401
                : result.errors[0]?.includes('Permissão')
                  ? 403
                  : 404,
            },
          );
        }

        return NextResponse.json({
          message: `${result.deletedCount} imagem(ns) deletada(s) com sucesso`,
          success: true,
          deletedCount: result.deletedCount,
          errors: result.errors.length > 0 ? result.errors : undefined,
        });
      }

      return NextResponse.json(
        { error: 'imageUrls deve ser um array' },
        { status: 400 },
      );
    } catch (error) {
      console.error('Erro ao deletar imagem(ns):', error);
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 },
      );
    }
  },
);
