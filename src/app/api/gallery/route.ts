import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function GET() {
  try {
    const jsonPath = path.resolve(process.cwd(), 'public/data/gallery.json');
    const jsonData = await fs.readFile(jsonPath, 'utf-8');
    const data = JSON.parse(jsonData);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao ler dados da galeria:', error);
    return NextResponse.json(
      { message: 'Erro ao buscar dados da galeria' },
      { status: 500 },
    );
  }
} 
