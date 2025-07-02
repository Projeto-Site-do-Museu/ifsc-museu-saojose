import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, senha } = await request.json();

    if (!email || !senha) {
      return NextResponse.json(
        { error: 'Preencha todos os campos.' },
        { status: 400 },
      );
    }

    const usuario = await prisma.usuario.findUnique({
      where: {
        email,
        ativo: true,
      },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: 'Credenciais inválidas.' },
        { status: 401 },
      );
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senhaHash);
    if (!senhaCorreta) {
      return NextResponse.json(
        { error: 'Credenciais inválidas.' },
        { status: 401 },
      );
    }

    return NextResponse.json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      role: usuario.role,
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}
