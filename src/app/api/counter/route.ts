import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const COOKIE_NAME = 'visitor_counted';

async function getCurrentCount(): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const result = await prisma.contadorVisitante.findFirst({
    where: {
      dataRegistro: {
        gte: today,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return result?.contador || 0;
}

async function incrementCounter(ipAddress?: string, userAgent?: string): Promise<number> {
  const currentCount = await getCurrentCount();
  const newCount = currentCount + 1;
  
  await prisma.contadorVisitante.create({
    data: {
      contador: newCount,
      dataRegistro: new Date(),
      ipOrigem: ipAddress,
      userAgent: userAgent,
    },
  });

  return newCount;
}

export async function GET() {
  try {
    const count = await getCurrentCount();
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
      const count = await getCurrentCount();
      return NextResponse.json({ count, counted: false });
    }

    const ipAddress = request.ip || request.headers.get('x-forwarded-for')?.split(',')[0] || undefined;
    const userAgent = request.headers.get('user-agent') || undefined;
    
    const newCount = await incrementCounter(ipAddress, userAgent);

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
