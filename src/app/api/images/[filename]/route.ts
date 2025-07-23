import { readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } },
) {
  const { filename } = params;
  console.log(`[GET /api/images] Received request for filename: ${filename}`);

  if (!filename) {
    console.error('[GET /api/images] Error: Filename is missing.');
    return NextResponse.json(
      { error: 'Nome do arquivo obrigatório' },
      { status: 400 },
    );
  }

  if (filename.includes('..')) {
    console.error(
      `[GET /api/images] Error: Invalid filename, contains '..': ${filename}`,
    );
    return NextResponse.json(
      { error: 'Nome de arquivo inválido' },
      { status: 400 },
    );
  }

  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '');
  if (safeName !== filename) {
    console.error(
      `[GET /api/images] Error: Invalid characters in filename. Original: "${filename}", Safe: "${safeName}"`,
    );
    return NextResponse.json(
      { error: 'Nome de arquivo inválido' },
      { status: 400 },
    );
  }

  try {
    const uploadsPath = join(process.cwd(), 'uploads', safeName);
    console.log(
      `[GET /api/images] Attempting to read from uploads path: ${uploadsPath}`,
    );

    try {
      await stat(uploadsPath);
      const imageBuffer = await readFile(uploadsPath);
      console.log(
        `[GET /api/images] Success: Found and read file from uploads: ${uploadsPath}`,
      );

      const mimeTypes: Record<string, string> = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml',
      };
      const ext = safeName.toLowerCase().substring(safeName.lastIndexOf('.'));
      const mimeType = mimeTypes[ext] || 'application/octet-stream';

      return new NextResponse(imageBuffer, {
        status: 200,
        headers: {
          'Content-Type': mimeType,
          'Cache-Control': 'public, max-age=31536000, immutable',
          'Content-Length': imageBuffer.length.toString(),
        },
      });
    } catch (uploadError: any) {
      console.warn(
        `[GET /api/images] Info: File not found in uploads directory. Error: ${uploadError.message}`,
      );
      const publicPath = join(process.cwd(), 'public', 'imgs', safeName);
      console.log(
        `[GET /api/images] Fallback: Attempting to read from public path: ${publicPath}`,
      );

      try {
        await stat(publicPath);
        const imageBuffer = await readFile(publicPath);
        console.log(
          `[GET /api/images] Success: Found and read file from public fallback: ${publicPath}`,
        );

        const mimeTypes: Record<string, string> = {
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.png': 'image/png',
          '.gif': 'image/gif',
          '.webp': 'image/webp',
          '.svg': 'image/svg+xml',
        };
        const ext = safeName.toLowerCase().substring(safeName.lastIndexOf('.'));
        const mimeType = mimeTypes[ext] || 'application/octet-stream';

        return new NextResponse(imageBuffer, {
          status: 200,
          headers: {
            'Content-Type': mimeType,
            'Cache-Control': 'public, max-age=31536000, immutable',
            'Content-Length': imageBuffer.length.toString(),
          },
        });
      } catch (publicError: any) {
        console.error(
          `[GET /api/images] Error: File not found in uploads or public. Final error: ${publicError.message}`,
        );
        return NextResponse.json(
          { error: 'Imagem não encontrada' },
          { status: 404 },
        );
      }
    }
  } catch (error: any) {
    console.error(
      `[GET /api/images] Unhandled server error: ${error.message}`,
      error,
    );
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}
