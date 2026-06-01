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

function resolveImagePaths(
  rawPath: string | null,
  availableImages: Map<string, string>,
  dadosImagensDir: string,
  publicAcervoDir: string,
): string[] {
  if (!rawPath) return [];

  const candidates = rawPath
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  const urls: string[] = [];

  for (const candidate of candidates) {
    const baseName = path.basename(candidate).trim();
    const key = path.basename(baseName, path.extname(baseName)).trim().toLowerCase();
    const matched = availableImages.get(key);

    if (!matched) {
      console.warn(`⚠️ Imagem não encontrada no diretório de imagens: ${baseName}`);
      continue;
    }

    const normalized = normalizeImageName(matched);
    const sourceFile = path.join(dadosImagensDir, matched);
    const destFile = path.join(publicAcervoDir, normalized);

    if (!fs.existsSync(destFile) && fs.existsSync(sourceFile)) {
      fs.copyFileSync(sourceFile, destFile);
    }

    if (fs.existsSync(destFile)) {
      const url = `/imagens/acervo/${normalized}`;
      if (!urls.includes(url)) {
        urls.push(url);
      }
    }
  }

  return urls;
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

async function main() {
  const dadosDir = path.join(process.cwd(), 'dados_acervo');
  const dadosImagensDir = path.join(dadosDir, 'imagens');
  const publicAcervoDir = path.join(process.cwd(), 'public', 'imagens', 'acervo');
  const csvPath = fs.existsSync(path.join(dadosDir, 'Metadados.csv'))
    ? path.join(dadosDir, 'Metadados.csv')
    : path.join(dadosDir, 'metadados.csv');

  if (!fs.existsSync(csvPath)) {
    throw new Error(`Arquivo CSV não encontrado em ${csvPath}`);
  }

  if (!fs.existsSync(publicAcervoDir)) {
    fs.mkdirSync(publicAcervoDir, { recursive: true });
  }

  const imageMap = buildImageMap(dadosImagensDir);
  const admin = await getOrCreateAdminUser();

  console.log('🧹 Limpando acervo antigo...');
  await prisma.acervoMidia.deleteMany();
  await prisma.acervo.deleteMany();
  console.log('✅ Acervo antigo apagado.');

  // Normaliza cabeçalhos do CSV (remove BOM, trim, lowercase) e faz mapeamento
  const normalize = (s: string | undefined) =>
    (s || '').replace(/\uFEFF/g, '').trim().toLowerCase();

  const findField = (data: Record<string, string>, expected: string) => {
    const target = normalize(expected);
    for (const k of Object.keys(data)) {
      if (normalize(k) === target) return data[k];
    }
    return undefined;
  };

  // Ler arquivo e remover BOM
  let csvContent = fs.readFileSync(csvPath, 'utf-8');
  if (csvContent.charCodeAt(0) === 0xfeff) {
    csvContent = csvContent.slice(1);
  }

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
          'Local de Origem': findField(data, 'Local de Origem') || findField(data, 'Local de Origem'),
          Material: findField(data, 'Material'),
          'Nº de Inventário': findField(data, 'Nº de Inventário') || findField(data, 'N. de Inventário') || findField(data, 'Nº de Inventario') || findField(data, 'Numero de Inventario'),
          'Período/Época': findField(data, 'Período/Época') || findField(data, 'Periodo/Época') || findField(data, 'Período'),
          Responsável: findField(data, 'Responsável') || findField(data, 'Responsavel'),
          Técnica: findField(data, 'Técnica') || findField(data, 'Tecnica'),
          URL: findField(data, 'URL'),
          'URL Adicional': findField(data, 'URL Adicional') || findField(data, 'URL Adicional'),
        } as CSVRow;

        rows.push(mapped);
      })
      .on('end', resolve)
      .on('error', reject);
  });

  console.log(`📥 Lido CSV com ${rows.length} linhas.`);

  let successCount = 0;
  let errorCount = 0;
  let skippedCount = 0;

  for (const [index, row] of rows.entries()) {
    const line = index + 2;
    try {
      const titulo = cleanField(row.Nome);
      if (!titulo) {
        skippedCount += 1;
        console.warn(`Linha ${line}: pulada porque o campo Nome está vazio.`);
        continue;
      }

      const imagens = resolveImagePaths(
        row['Arquivos e mídia'],
        imageMap,
        dadosImagensDir,
        publicAcervoDir,
      );
      const imagem = imagens[0] ?? null;
      const { cidadeOrigem, estadoOrigem, paisOrigem } = parseLocalOrigem(cleanField(row['Local de Origem']));
      const { altura, largura, profundidade } = parseDimensoes(cleanField(row.Dimensões));

      const acervo = await prisma.acervo.create({
        data: {
          titulo,
          nome: titulo,
          descricao: null,
          imagem,
          imagemCapa: imagem,
          ordem: index + 1,
          colecao: cleanField(row['Coleção']),
          tags: cleanField(row.Acervo),
          ativo: parseActive(row.Add),
          usuarioId: admin.id,
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

      if (imagens.length > 0) {
        await prisma.acervoMidia.createMany({
          data: imagens.map((url, idx) => ({
            acervoId: acervo.id,
            tipo: 'imagem',
            url,
            ordem: idx + 1,
          })),
        });
      }

      successCount += 1;
    } catch (error) {
      errorCount += 1;
      console.error(`Linha ${line}: erro ao importar item.`, error instanceof Error ? error.message : error);
    }
  }

  console.log('📦 Importação concluída.');
  console.log(`  - Inseridos: ${successCount}`);
  console.log(`  - Pulados: ${skippedCount}`);
  console.log(`  - Erros: ${errorCount}`);
}

main()
  .then(() => {
    console.log('🎉 Script finalizado com sucesso.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erro no script de importação:', error);
    process.exit(1);
  });
