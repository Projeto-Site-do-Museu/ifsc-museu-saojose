const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const fs = require('node:fs');
const path = require('node:path');
const generator = require("generate-password");
const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Iniciando migração dos dados JSON para o banco...\n');

  try {
    // 1. Criar usuário admin
    console.log('👤 Criando usuário administrador...');


    const senha = generator.generate({
      length: 12,
      numbers: true,
      symbols: true,
      uppercase: true,
      lowercase: true
    });
    const adminPassword = `batatinha+${senha}` ;
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const admin = await prisma.usuario.upsert({
      where: { email: 'admin@museu.com' },
      update: {},
      create: {
        nome: 'Administrador',
        email: 'admin@museu.com',
        senhaHash: hashedPassword,
        role: 'admin',
        ativo: true,
      },
    });

    console.log(`✅ Admin criado - ID: ${admin.id}, Email: ${admin.email}`);
    console.log(`🔑 Senha: ${adminPassword}\n`);

    // 2. Migrar dados dos artigos (artigos.json)
    console.log('📰 Migrando artigos...');
    const artigosData = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), 'public/data/artigos.json'),
        'utf-8',
      ),
    );

    const artigos = [];
    for (let i = 0; i < artigosData.length; i++) {
      const item = artigosData[i];
      const artigo = await prisma.artigo.create({
        data: {
          titulo: item.alt || `Artigo ${i + 1}`,
          resumo: item.descricao,
          conteudo: `<p>${item.descricao}</p><p>Conteúdo completo do artigo sobre ${item.alt}.</p>`,
          imagem: item.src,
          dataPublicacao: new Date(Date.now() - i * 24 * 60 * 60 * 1000), // Datas escalonadas
          ativo: true,
          usuarioId: admin.id,
        },
      });
      artigos.push(artigo);
    }

    console.log(`✅ ${artigos.length} artigos criados`);

    // 3. Migrar dados do carousel (carousel.json) - como artigos especiais
    console.log('🎠 Migrando dados do carousel...');
    const carouselData = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), 'public/data/carousel.json'),
        'utf-8',
      ),
    );

    const carouselArtigos = [];
    for (const item of carouselData) {
      const artigo = await prisma.artigo.create({
        data: {
          titulo: `Destaque ${item.id}`,
          resumo: `${item.text.substring(0, 200)}...`,
          conteudo: `<p>${item.text}</p>`,
          imagem: item.img,
          dataPublicacao: new Date(Date.now() + item.id * 60 * 60 * 1000), // Futuros para destaque
          ativo: true,
          usuarioId: admin.id,
        },
      });
      carouselArtigos.push(artigo);
    }

    console.log(`✅ ${carouselArtigos.length} artigos de destaque criados`);

    // 4. Migrar vídeos (videos.json) - NOTA: Acervo é importado via npm run setup-db
    console.log('🎥 Migrando vídeos especiais...');
    const videosData = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), 'public/data/videos.json'),
        'utf-8',
      ),
    );

    const videos = [];
    const tiposVideo = [
      'intro',
      'banner',
      'educativo',
      'tour',
      'destaque',
      'especial',
    ];

    for (let i = 0; i < videosData.length; i++) {
      const videoFile = videosData[i];
      const video = await prisma.videoEspecial.create({
        data: {
          titulo: `Vídeo ${i + 1}`,
          descricao: `Vídeo especial do museu - ${videoFile}`,
          tipo: tiposVideo[i] || 'especial',
          video: `/videos/${videoFile}`,
          thumbnail: '/imgs/thumbnail.png',
          ordem: i + 1,
          ativo: true,
          usuarioId: admin.id,
        },
      });
      videos.push(video);
    }

    console.log(`✅ ${videos.length} vídeos especiais criados`);

    // 6. Migrar contador (counter.json)
    console.log('📊 Migrando contador de visitantes...');
    const counterData = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'data/counter.json'), 'utf-8'),
    );

    await prisma.contadorVisitante.create({
      data: {
        contador: counterData.count,
        dataRegistro: new Date(counterData.lastUpdated),
        ipOrigem: '127.0.0.1',
        userAgent: 'Migration Script',
      },
    });

    console.log(`✅ Contador migrado - Total: ${counterData.count} visitantes`);

    // 7. Adicionar algumas configurações básicas
    console.log('⚙️  Criando configurações básicas...');
    const configs = [
      {
        chave: 'site_titulo',
        valor: 'Museu Histórico de São José',
        descricao: 'Título principal do site',
      },
      {
        chave: 'contato_email',
        valor: 'contato@museu.com',
        descricao: 'Email de contato do museu',
      },
      {
        chave: 'endereco',
        valor: 'São José, Santa Catarina',
        descricao: 'Endereço do museu',
      },
    ];

    for (const config of configs) {
      await prisma.configuracao.upsert({
        where: { chave: config.chave },
        update: { valor: config.valor },
        create: config,
      });
    }

    console.log(`✅ ${configs.length} configurações criadas`);

    // 7. Resumo final
    console.log('\n🎉 MIGRAÇÃO CONCLUÍDA COM SUCESSO!');
    console.log('='.repeat(50));
    console.log('👤 Usuários: 1 admin criado');
    console.log(
      `📰 Artigos: ${artigos.length + carouselArtigos.length} criados`,
    );
    console.log(`🎥 Vídeos: ${videos.length} criados`);
    console.log(`📊 Visitantes: ${counterData.count} registrados`);
    console.log(`⚙️  Configurações: ${configs.length} criadas`);
    console.log('='.repeat(50));
    console.log('📌 NOTA: Para importar o acervo do CSV, use:');
    console.log('   npm run setup-db');
    console.log('='.repeat(50));
    console.log('🔐 Login Admin:');
    console.log('   Email: admin@museu.com');
    console.log(`   Senha: ${adminPassword}`);
    console.log('='.repeat(50));
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
