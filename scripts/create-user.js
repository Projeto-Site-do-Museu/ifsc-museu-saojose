const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const readline = require('node:readline');

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function pergunta(texto) {
  return new Promise((resolve) => {
    rl.question(texto, (resposta) => {
      resolve(resposta.trim());
    });
  });
}

async function main() {
  console.log('👤 Criação de Usuário\n');

  try {
    // Perguntar dados do usuário
    const nome = await pergunta('Nome do usuário: ');
    const email = await pergunta('Email: ');
    const senha = await pergunta('Senha: ');

    // Validar dados básicos
    if (!nome || nome.length < 2) {
      console.log('❌ Nome deve ter pelo menos 2 caracteres');
      return;
    }

    if (!email || !email.includes('@')) {
      console.log('❌ Email inválido');
      return;
    }

    if (!senha || senha.length < 6) {
      console.log('❌ Senha deve ter pelo menos 6 caracteres');
      return;
    }

    // Verificar se email já existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email },
    });

    if (usuarioExistente) {
      console.log('❌ Email já está em uso');
      return;
    }

    // Criar hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Criar usuário
    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senhaHash,
        role: 'admin',
        ativo: true,
      },
    });

    console.log('\n✅ Usuário criado com sucesso!');
    console.log(`ID: ${usuario.id}`);
    console.log(`Nome: ${usuario.nome}`);
    console.log(`Email: ${usuario.email}`);
    console.log(`Role: ${usuario.role}`);
  } catch (error) {
    console.error('❌ Erro ao criar usuário:', error.message);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

main();
