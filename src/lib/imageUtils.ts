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

  const deleted = await deleteLocalImage(imageUrl, token);

  if (!deleted) {
    return { success: false, error: 'Imagem não encontrada ou não é local' };
  }

  return { success: true };
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

  return await deleteMultipleLocalImages(imageUrls, token);
}
