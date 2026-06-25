import 'dotenv/config';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { Readable } from 'node:stream';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import csvParser from 'csv-parser';

const prisma = new PrismaClient();

interface CSVRow {
  Nome: string;
  Acervo: string;
  Add: string;
  'Arquivos e mídia': string;
  Coleção: string;
  'Contexto Historico': string;
  'Data de Produção': string;
  Dimensões: string;
  Doador: string;
  'Estado de Conservação': string;
  'Local de Origem': string;
  Material: string;
  'Nº de Inventário': string;
  'Período/Época': string;
  Responsável: string;
  'Técnica': string;
  URL: string;
  'URL Adicional': string;
}

const cleanField = (value?: string): string | null => {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
};

const parseActive = (value?: string): boolean => {
  if (!value) return true;
  const normalized = value.trim().toLowerCase();
  return normalized !== 'no' && normalized !== 'não' && normalized !== 'false';
};

function parseLocalOrigem(localText: string | null) {
  if (!localText) {
    return { cidadeOrigem: null, estadoOrigem: null, paisOrigem: null };
  }

  const cleaned = localText.trim();
  if (cleaned === '') {
    return { cidadeOrigem: null, estadoOrigem: null, paisOrigem: null };
  }

  if (cleaned.toLowerCase() === 'brasil') {
    return { cidadeOrigem: null, estadoOrigem: null, paisOrigem: 'Brasil' };
  }

  const parts = cleaned.split('-').map((part) => part.trim()).filter(Boolean);
  if (parts.length === 1) {
    return { cidadeOrigem: parts[0], estadoOrigem: null, paisOrigem: 'Brasil' };
  }

  return {
    cidadeOrigem: parts[0] || null,
    estadoOrigem: parts[1] || null,
    paisOrigem: parts[2] || 'Brasil',
  };
}

function parseDimensoes(dimText: string | null) {
  if (!dimText) {
    return { altura: null, largura: null, profundidade: null };
  }

  const cleaned = dimText.trim();
  if (cleaned === '') {
    return { altura: null, largura: null, profundidade: null };
  }

  let altura: string | null = null;
  let largura: string | null = null;
  let profundidade: string | null = null;

  const alturaMatch = cleaned.match(/altura\s*[:\-]?\s*([^,;]+)/i);
  const larguraMatch = cleaned.match(/largura\s*[:\-]?\s*([^,;]+)/i);
  const profundidadeMatch = cleaned.match(/profundidade\s*[:\-]?\s*([^,;]+)/i);

  if (alturaMatch) altura = alturaMatch[1].trim();
  if (larguraMatch) largura = larguraMatch[1].trim();
  if (profundidadeMatch) profundidade = profundidadeMatch[1].trim();

  if (!altura && !largura && !profundidade) {
    return { altura: cleaned, largura: null, profundidade: null };
  }

  return { altura, largura, profundidade };
}

function normalizeImageName(fileName: string): string {
  const baseName = path.basename(fileName.trim());
  const ext = path.extname(baseName);
  const nameWithoutExt = baseName.slice(0, baseName.length - ext.length);
  return `${nameWithoutExt}.webp`;
}

function buildImageMap(dadosImagensDir: string) {
  const imageFiles = fs.existsSync(dadosImagensDir)
    ? fs.readdirSync(dadosImagensDir)
    : [];

  const map = new Map<string, string>();
  for (const file of imageFiles) {
    const key = path.basename(file, path.extname(file)).trim().toLowerCase();
    map.set(key, file);
  }
  return map;
}

function resolveImagePath(
  rawPath: string | null,
  availableImages: Map<string, string>,
  dadosImagensDir: string,
  publicAcervoDir: string,
): string | null {
  if (!rawPath) return null;

  const candidates = rawPath
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  if (candidates.length === 0) return null;

  const firstCandidate = candidates[0];
  const baseName = path.basename(firstCandidate).trim();
  const key = path.basename(baseName, path.extname(baseName)).trim().toLowerCase();
  const matched = availableImages.get(key);
  if (!matched) {
    return null;
  }

  const normalized = normalizeImageName(matched);
  const sourceFile = path.join(dadosImagensDir, matched);
  const destFile = path.join(publicAcervoDir, normalized);

  if (!fs.existsSync(destFile) && fs.existsSync(sourceFile)) {
    fs.copyFileSync(sourceFile, destFile);
  }

  if (fs.existsSync(destFile)) {
    return `/imagens/acervo/${normalized}`;
  }

  return null;
}

async function getOrCreateAdminUser() {
  const email = 'admin@acervo.local';
  const existing = await prisma.usuario.findUnique({ where: { email } });
  if (existing) return existing;

  const passwordHash = await bcrypt.hash('AdminMuseu123!', 10);
  return prisma.usuario.create({
    data: {
      nome: 'Administrador do Acervo',
      email,
      senhaHash: passwordHash,
      role: 'admin',
      ativo: true,
    },
  });
}

async function setupArtigos(adminId: number) {
  console.log('📰 Importando artigos...');
  const artigosPath = path.join(process.cwd(), 'public/data/artigos.json');
  
  if (!fs.existsSync(artigosPath)) {
    console.warn('⚠️ arquivo artigos.json não encontrado');
    return 0;
  }

  const artigosData = JSON.parse(fs.readFileSync(artigosPath, 'utf-8'));
  let count = 0;

  for (let i = 0; i < artigosData.length; i++) {
    try {
      const item = artigosData[i];
      await prisma.artigo.create({
        data: {
          titulo: item.alt || `Artigo ${i + 1}`,
          resumo: item.descricao,
          conteudo: `<p>${item.descricao}</p>`,
          imagem: item.src,
          dataPublicacao: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
          ativo: true,
          usuarioId: adminId,
        },
      });
      count++;
    } catch (error) {
      console.warn(`⚠️ erro ao importar artigo ${i + 1}`);
    }
  }

  console.log(`✅ ${count} artigos importados`);
  return count;
}

async function setupCarousel(adminId: number) {
  console.log('🎠 Importando carousel...');
  const carouselPath = path.join(process.cwd(), 'public/data/carousel.json');
  
  if (!fs.existsSync(carouselPath)) {
    console.warn('⚠️ arquivo carousel.json não encontrado');
    return 0;
  }

  const carouselData = JSON.parse(fs.readFileSync(carouselPath, 'utf-8'));
  let count = 0;

  for (const item of carouselData) {
    try {
      await prisma.artigo.create({
        data: {
          titulo: `Destaque ${item.id}`,
          resumo: `${item.text.substring(0, 200)}...`,
          conteudo: `<p>${item.text}</p>`,
          imagem: item.img,
          dataPublicacao: new Date(),
          ativo: true,
          usuarioId: adminId,
        },
      });
      count++;
    } catch (error) {
      console.warn(`⚠️ erro ao importar carousel item ${item.id}`);
    }
  }

  console.log(`✅ ${count} itens de carousel importados`);
  return count;
}

async function setupVideos(adminId: number) {
  console.log('🎥 Importando vídeos especiais...');
  const videosPath = path.join(process.cwd(), 'public/data/videos.json');
  
  if (!fs.existsSync(videosPath)) {
    console.warn('⚠️ arquivo videos.json não encontrado');
    return 0;
  }

  const videosData = JSON.parse(fs.readFileSync(videosPath, 'utf-8'));
  const tiposVideo = ['intro', 'banner', 'educativo', 'tour', 'destaque', 'especial'];
  let count = 0;

  for (let i = 0; i < videosData.length; i++) {
    try {
      const videoFile = videosData[i];
      await prisma.videoEspecial.create({
        data: {
          titulo: `Vídeo ${i + 1}`,
          descricao: `Vídeo especial do museu`,
          tipo: tiposVideo[i] || 'especial',
          video: `/videos/${videoFile}`,
          ordem: i + 1,
          ativo: true,
          usuarioId: adminId,
        },
      });
      count++;
    } catch (error) {
      console.warn(`⚠️ erro ao importar vídeo ${i + 1}`);
    }
  }

  console.log(`✅ ${count} vídeos importados`);
  return count;
}

async function setupAcervo(adminId: number) {
  console.log('🖼️ Importando acervo do CSV...');
  
  const dadosDir = path.join(process.cwd(), 'dados_acervo');
  const dadosImagensDir = path.join(dadosDir, 'imagens');
  const publicAcervoDir = path.join(process.cwd(), 'public', 'imagens', 'acervo');
  const csvPath = fs.existsSync(path.join(dadosDir, 'Metadados.csv'))
    ? path.join(dadosDir, 'Metadados.csv')
    : path.join(dadosDir, 'metadados.csv');

  if (!fs.existsSync(csvPath)) {
    console.warn('⚠️ Arquivo CSV não encontrado');
    return 0;
  }

  if (!fs.existsSync(publicAcervoDir)) {
    fs.mkdirSync(publicAcervoDir, { recursive: true });
  }

  const imageMap = buildImageMap(dadosImagensDir);

  // Ler arquivo e remover BOM
  let csvContent = fs.readFileSync(csvPath, 'utf-8');
  if (csvContent.charCodeAt(0) === 0xfeff) {
    csvContent = csvContent.slice(1);
  }

  // Normaliza cabeçalhos
  const normalize = (s: string | undefined) =>
    (s || '').replace(/\uFEFF/g, '').trim().toLowerCase();

  const findField = (data: Record<string, string>, expected: string) => {
    const target = normalize(expected);
    for (const k of Object.keys(data)) {
      if (normalize(k) === target) return data[k];
    }
    return undefined;
  };

  // Parse CSV com csv-parser
  const rows: CSVRow[] = [];
  await new Promise<void>((resolve, reject) => {
    const readableStream = Readable.from([csvContent]);

    readableStream
      .pipe(csvParser())
      .on('data', (data: Record<string, string>) => {
        const mapped: any = {
          Nome: findField(data, 'Nome'),
          Acervo: findField(data, 'Acervo'),
          Add: findField(data, 'Add'),
          'Arquivos e mídia': findField(data, 'Arquivos e mídia') || findField(data, 'Arquivos e midia'),
          Coleção: findField(data, 'Coleção') || findField(data, 'Colecao'),
          'Contexto Historico': findField(data, 'Contexto Historico') || findField(data, 'Contexto Histórico'),
          'Data de Produção': findField(data, 'Data de Produção') || findField(data, 'Data de Producao'),
          Dimensões: findField(data, 'Dimensões') || findField(data, 'Dimensoes'),
          Doador: findField(data, 'Doador'),
          'Estado de Conservação': findField(data, 'Estado de Conservação') || findField(data, 'Estado de Conservacao'),
          'Local de Origem': findField(data, 'Local de Origem'),
          Material: findField(data, 'Material'),
          'Nº de Inventário': findField(data, 'Nº de Inventário') || findField(data, 'Nº de Inventario'),
          'Período/Época': findField(data, 'Período/Época') || findField(data, 'Período'),
          Responsável: findField(data, 'Responsável') || findField(data, 'Responsavel'),
          'Técnica': findField(data, 'Técnica') || findField(data, 'Tecnica'),
          URL: findField(data, 'URL'),
          'URL Adicional': findField(data, 'URL Adicional'),
        } as CSVRow;

        rows.push(mapped);
      })
      .on('end', resolve)
      .on('error', reject);
  });

  let successCount = 0;
  let skippedCount = 0;

  for (const [index, row] of rows.entries()) {
    try {
      const titulo = cleanField(row.Nome);
      if (!titulo) {
        skippedCount += 1;
        continue;
      }

      const imagem = resolveImagePath(row['Arquivos e mídia'], imageMap, dadosImagensDir, publicAcervoDir);
      const { cidadeOrigem, estadoOrigem, paisOrigem } = parseLocalOrigem(cleanField(row['Local de Origem']));
      const { altura, largura, profundidade } = parseDimensoes(cleanField(row.Dimensões));

      await prisma.acervo.create({
        data: {
          titulo,
          nome: titulo,
          descricao: null,
          imagem,
          imagemCapa: imagem,
          ordem: index + 1,
          colecao: cleanField(row.Coleção),
          tags: cleanField(row.Acervo),
          ativo: parseActive(row.Add),
          usuarioId: adminId,
          numeroInventario: cleanField(row['Nº de Inventário']),
          artista: null,
          localizacao: null,
          periodo: cleanField(row['Período/Época']),
          dataProducao: cleanField(row['Data de Produção']),
          material: cleanField(row.Material),
          tecnica: cleanField(row['Técnica']),
          altura,
          largura,
          profundidade,
          cidadeOrigem,
          estadoOrigem,
          paisOrigem,
          contextoHistorico: cleanField(row['Contexto Historico']),
          doador: cleanField(row.Doador),
          formaAquisicao: null,
          estadoConservacao: cleanField(row['Estado de Conservação']),
        },
      });

      successCount += 1;
    } catch (error) {
      console.error(`erro ao importar acervo linha ${index + 2}:`, error instanceof Error ? error.message : error);
    }
  }

  console.log(`✅ ${successCount} itens de acervo importados (${skippedCount} pulados)`);
  return successCount;
}

async function setupConfiguracoes() {
  console.log('⚙️ Criando configurações...');
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
}

async function main() {
  console.log('🚀 Iniciando setup completo do banco de dados...\n');

  try {
    // Limpar acervo antigo
    console.log('🧹 Limpando acervo antigo...');
    await prisma.acervoMidia.deleteMany();
    await prisma.acervo.deleteMany();
    console.log('✅ Acervo antigo apagado.\n');

    // 1. Criar/obter admin
    const admin = await getOrCreateAdminUser();
    console.log(`✅ Admin garantido: ${admin.email}\n`);

    // 2. Setup de dados JSON
    await setupArtigos(admin.id);
    await setupCarousel(admin.id);
    await setupVideos(admin.id);

    // 3. Setup de acervo do CSV
    await setupAcervo(admin.id);

    // 4. Setup de configurações
    await setupConfiguracoes();

    console.log('\n🎉 SETUP CONCLUÍDO COM SUCESSO!');
    console.log('='.repeat(50));
    console.log(`✅ Banco de dados pronto para usar`);
    console.log(`🔐 Admin: ${admin.email}`);
    console.log('='.repeat(50));
  } catch (error) {
    console.error('❌ Erro no setup:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  });
