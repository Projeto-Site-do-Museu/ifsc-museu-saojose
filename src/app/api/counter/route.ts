import fs from 'node:fs/promises';
import path from 'node:path';
import { type NextRequest, NextResponse } from 'next/server';

const COUNTER_FILE = path.join(process.cwd(), 'data', 'counter.json');
const COOKIE_NAME = 'visitor_counted';

async function ensureDataDir() {
  const dataDir = path.dirname(COUNTER_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

async function getCounter(): Promise<number> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(COUNTER_FILE, 'utf-8');
    const { count } = JSON.parse(data);
    return count || 0;
  } catch {
    return 0;
  }
}

async function saveCounter(count: number): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(
    COUNTER_FILE,
    JSON.stringify({
      count,
      lastUpdated: new Date().toISOString(),
    }),
    'utf-8',
  );
}

export async function GET() {
  try {
    const count = await getCounter();
    return NextResponse.json({ count });
  } catch (error) {
    console.error('Erro ao buscar contador:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const hasCookie = request.cookies.has(COOKIE_NAME);

    if (hasCookie) {
      const count = await getCounter();
      return NextResponse.json({ count, counted: false });
    }

    const currentCount = await getCounter();
    const newCount = currentCount + 1;
    await saveCounter(newCount);

    const response = NextResponse.json({ count: newCount, counted: true });

    response.cookies.set(COOKIE_NAME, 'true', {
      maxAge: 30 * 24 * 60 * 60, // 30 dias
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return response;
  } catch (error) {
    console.error('Erro ao processar contador:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}
