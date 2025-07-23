import { mkdir, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { withAuth } from '@/lib/middleware';
import { type NextRequest, NextResponse } from 'next/server';

export const POST = withAuth(async (request: NextRequest, user) => {
  if (user.role !== 'admin') {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
  }

  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo foi enviado' },
        { status: 400 },
      );
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Apenas arquivos de imagem são permitidos' },
        { status: 400 },
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Arquivo muito grande. Máximo 5MB' },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}_${originalName}`;

    const uploadsDir = join(process.cwd(), 'uploads');
    console.log(`[POST /api/upload] Uploads directory path: ${uploadsDir}`);

    try {
      await mkdir(uploadsDir, { recursive: true });
      console.log('[POST /api/upload] Ensured uploads directory exists.');
    } catch (error: any) {
      console.warn(
        `[POST /api/upload] Could not create directory (may already exist): ${error.message}`,
      );
    }

    const filePath = join(uploadsDir, fileName);
    console.log(`[POST /api/upload] Writing file to: ${filePath}`);

    await writeFile(filePath, buffer);
    console.log('[POST /api/upload] Successfully wrote file to disk.');

    try {
      await stat(filePath);
      console.log(`[POST /api/upload] Verified file exists at: ${filePath}`);
    } catch (error: any) {
      console.error(
        `[POST /api/upload] CRITICAL: File write verification failed for ${filePath}. Error: ${error.message}`,
      );
    }

    const imageUrl = `/api/images/${fileName}`;
    console.log(`[POST /api/upload] Returning image URL: ${imageUrl}`);

    return NextResponse.json({
      success: true,
      url: imageUrl,
      fileName,
    });
  } catch (error: any) {
    console.error(
      `[POST /api/upload] Unhandled server error: ${error.message}`,
      error,
    );
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
});
