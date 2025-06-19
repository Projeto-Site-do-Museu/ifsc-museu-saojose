import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { nome, email, senha } = await request.json();

    if (!nome || !email || !senha) {
      return NextResponse.json(
        { error: 'Preencha todos os campos.' },
        { status: 400 },
      );
    }

    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email },
    });
    
    if (usuarioExistente) {
      return NextResponse.json(
        { error: 'E-mail já cadastrado.' },
        { status: 400 },
      );
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const usuario = await prisma.usuario.create({
      data: { 
        nome, 
        email, 
        senhaHash, 
        role: 'admin' 
      },
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json(usuario);
  } catch (error) {
    console.error('Erro no registro:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}
