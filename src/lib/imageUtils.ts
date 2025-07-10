import { unlink } from 'node:fs/promises';
import { join } from 'node:path';
import { verifyToken } from './jwt';

export async function deleteLocalImage(
  imageUrl: string | null | undefined,
  token: string | null | undefined,
): Promise<{ success: boolean; error?: string }> {
  if (!token) {
    return { success: false, error: 'Token de autenticação obrigatório' };
  }

  const user = verifyToken(token);
  if (!user) {
    return { success: false, error: 'Token inválido ou expirado' };
  }

  if (!imageUrl) {
    return { success: false, error: 'URL da imagem é obrigatória' };
  }

  if (!imageUrl.startsWith('/imgs/')) {
    return {
      success: false,
      error: 'Apenas imagens locais podem ser deletadas',
    };
  }

  try {
    const fileName = imageUrl.replace('/imgs/', '');
    const filePath = join(process.cwd(), 'public/imgs', fileName);

    await unlink(filePath);

    return { success: true };
  } catch (error) {
    console.error('Erro ao deletar arquivo:', error);
    return { success: false, error: 'Erro ao deletar arquivo físico' };
  }
}

export async function deleteMultipleLocalImages(
  imageUrls: (string | null | undefined)[],
  token: string | null | undefined,
): Promise<{ success: boolean; deletedCount: number; errors: string[] }> {
  if (!token) {
    return {
      success: false,
      deletedCount: 0,
      errors: ['Token de autenticação obrigatório'],
    };
  }

  const user = verifyToken(token);
  if (!user) {
    return {
      success: false,
      deletedCount: 0,
      errors: ['Token inválido ou expirado'],
    };
  }

  const results = await Promise.all(
    imageUrls.map(async (imageUrl) => {
      const result = await deleteLocalImage(imageUrl, token);
      return result;
    }),
  );

  const deletedCount = results.filter((res) => res.success).length;
  const errors = results
    .filter((res) => !res.success && res.error)
    .map((res) => res.error as string);

  return {
    success: errors.length === 0,
    deletedCount,
    errors,
  };
}
