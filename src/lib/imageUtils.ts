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

  if (!imageUrl.startsWith('/api/images/') && !imageUrl.startsWith('/imgs/')) {
    return {
      success: false,
      error: 'Apenas imagens locais podem ser deletadas',
    };
  }

  try {
    let fileName: string;

    if (imageUrl.startsWith('/api/images/')) {
      fileName = imageUrl.replace('/api/images/', '');
    } else {
      fileName = imageUrl.replace('/imgs/', '');
    }

    const filePath = join(process.cwd(), 'uploads', fileName);

    await unlink(filePath);

    console.log(`Imagem deletada com sucesso: ${fileName}`);
    return { success: true };
  } catch (error) {
    console.error('Erro ao deletar arquivo:', error);
    return { success: false, error: 'Erro ao deletar arquivo físico' };
  }
}

export async function deleteMultipleLocalImages(
  imageUrls: string[],
  token: string | null | undefined,
): Promise<{
  success: boolean;
  deletedCount: number;
  errors: string[];
}> {
  const errors: string[] = [];
  let deletedCount = 0;

  for (const imageUrl of imageUrls) {
    const result = await deleteLocalImage(imageUrl, token);
    if (result.success) {
      deletedCount++;
    } else {
      errors.push(result.error || `Erro ao deletar ${imageUrl}`);
    }
  }

  return {
    success: deletedCount > 0,
    deletedCount,
    errors,
  };
}
