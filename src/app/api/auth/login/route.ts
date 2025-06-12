import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { email, senha } = await request.json();

  if (!email || !senha) {
    return NextResponse.json(
      { error: 'Preencha todos os campos.' },
      { status: 400 },
    );
  }

  const usuario = await prisma.usuario.findUnique({ where: { email } });
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

  // Aqui você pode gerar um token JWT ou usar cookies para autenticação
  return NextResponse.json({
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
  });
}
