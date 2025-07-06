import { generateToken } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, senha } = await request.json();

    // Validações básicas
    if (!email || !senha) {
      console.warn('Tentativa de login com campos vazios');
      return NextResponse.json(
        { error: 'Preencha todos os campos.' },
        { status: 400 },
      );
    }

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.warn(`Tentativa de login com email inválido: ${email}`);
      return NextResponse.json(
        { error: 'Formato de email inválido.' },
        { status: 400 },
      );
    }

    // Buscar usuário no banco
    const usuario = await prisma.usuario.findUnique({
      where: {
        email,
        ativo: true,
      },
    });

    if (!usuario) {
      console.warn(`Tentativa de login com email não encontrado: ${email}`);
      return NextResponse.json(
        { error: 'Credenciais inválidas.' },
        { status: 401 },
      );
    }

    // Verificar se o usuário é admin
    if (usuario.role !== 'admin') {
      console.warn(`Tentativa de login de usuário não-admin: ${email}`);
      return NextResponse.json(
        { error: 'Acesso restrito a administradores.' },
        { status: 403 },
      );
    }

    // Verificar senha
    const senhaCorreta = await bcrypt.compare(senha, usuario.senhaHash);
    if (!senhaCorreta) {
      console.warn(`Tentativa de login com senha incorreta: ${email}`);
      return NextResponse.json(
        { error: 'Credenciais inválidas.' },
        { status: 401 },
      );
    }

    // Gerar token seguro
    const token = generateToken({
      userId: usuario.id.toString(),
      email: usuario.email,
      role: usuario.role,
    });

    console.log(`Login bem-sucedido para usuário: ${email}`);

    return NextResponse.json({
      token,
      user: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
      },
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}
