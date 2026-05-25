import * as fs from 'node:fs';
import * as path from 'node:path';
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
  Técnica: string;
  URL: string;
  'URL Adicional': string;
}

// Auxiliar para tratar e padronizar campos vazios
const cleanField = (val: string | undefined): string | null => {
  if (!val) return null;
  const trimmed = val.trim();
  return trimmed === '' ? null : trimmed;
};

// Auxiliar para analisar a string de localização de origem
// Exemplo: "São José - SC" -> cidade: "São José", estado: "SC", pais: "Brasil"
function parseLocalOrigem(localText: string | null) {
  if (!localText) {
    return { cidadeOrigem: null, estadoOrigem: null, paisOrigem: null };
  }

  const cleaned = localText.trim();
  if (cleaned.toLowerCase() === 'brasil') {
    return { cidadeOrigem: null, estadoOrigem: null, paisOrigem: 'Brasil' };
  }

  if (cleaned.includes('-')) {
    const parts = cleaned.split('-').map((p) => p.trim());
    return {
      cidadeOrigem: parts[0] || null,
      estadoOrigem: parts[1] || null,
      paisOrigem: 'Brasil',
    };
  }

  return {
    cidadeOrigem: cleaned,
    estadoOrigem: null,
    paisOrigem: 'Brasil',
  };
}

// Auxiliar para tratar dimensões
// Exemplo: "Altura 24 cm, largura 38 cm, profundidade 30 cm"
function parseDimensoes(dimText: string | null) {
  if (!dimText) {
    return { altura: null, largura: null, profundidade: null };
  }

  const cleaned = dimText.trim();
  let altura: string | null = null;
  let largura: string | null = null;
  let profundidade: string | null = null;

  const altMatch = cleaned.match(/altura\s*[:\-]?\s*([^,\n;]*)/i);
  const largMatch = cleaned.match(/largura\s*[:\-]?\s*([^,\n;]*)/i);
  const profMatch = cleaned.match(/profundidade\s*[:\-]?\s*([^,\n;]*)/i);

  if (altMatch) altura = altMatch[1].trim();
  if (largMatch) largura = largMatch[1].trim();
  if (profMatch) profundidade = profMatch[1].trim();

  // Caso não consiga destrinchar, salva o texto inteiro no campo de altura para não perder a informação
  if (!altura && !largura && !profundidade) {
    altura = cleaned;
  }

  return { altura, largura, profundidade };
}

// Auxiliar para normalizar o caminho de imagem convertendo qualquer arquivo para o nome .webp esperado
function normalizeImageName(fileName: string): string {
  const baseName = path.basename(fileName.trim());
  const ext = path.extname(baseName);
  const nameWithoutExt = baseName.slice(0, baseName.length - ext.length);
  return `${nameWithoutExt}.webp`;
}

function resolveImageUrl(
  imagePath: string,
  availableImages: Map<string, string>,
  dadosImagensDir: string,
  publicAcervoDir: string,
): string | null {
  const normalizedKey = path
    .basename(imagePath)
    .replace(path.extname(imagePath), '')
    .trim()
    .toLowerCase();

  const matchedFile = availableImages.get(normalizedKey);
  if (!matchedFile) {
    return null;
  }

  const targetFile = normalizeImageName(matchedFile);
  const sourcePath = path.join(dadosImagensDir, matchedFile);
  const destinationPath = path.join(publicAcervoDir, targetFile);

  if (!fs.existsSync(destinationPath) && fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destinationPath);
  }

  if (fs.existsSync(destinationPath)) {
    return `/imagens/acervo/${targetFile}`;
  }

  return null;
}

async function main() {
  console.log(
    '🚀 Iniciando script de população (seed) definitivo do acervo...',
  );

  const dadosImagensDir = path.join(process.cwd(), 'dados_acervo/imagens');
  const publicAcervoDir = path.join(process.cwd(), 'public/imagens/acervo');

  if (!fs.existsSync(dadosImagensDir)) {
    throw new Error(
      `❌ Diretório de imagens de metadados não encontrado em ${dadosImagensDir}`,
    );
  }

  if (!fs.existsSync(publicAcervoDir)) {
    fs.mkdirSync(publicAcervoDir, { recursive: true });
  }

  const availableImages = new Map<string, string>();
  for (const file of fs.readdirSync(dadosImagensDir)) {
    const key = path.basename(file, path.extname(file)).trim().toLowerCase();
    availableImages.set(key, file);
  }

  // 1. Garantir que existe um usuário Administrador no banco para vincular aos itens
  console.log('👤 Buscando ou criando utilizador Administrador padrão...');
  const defaultPassword = 'AdminMuseuPassword2026!';
  const salt = await bcrypt.genSalt(10);
  const senhaHash = await bcrypt.hash(defaultPassword, salt);

  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@museu.com' },
    update: {},
    create: {
      nome: 'Administrador Principal',
      email: 'admin@museu.com',
      senhaHash: senhaHash,
      role: 'admin',
      ativo: true,
    },
  });
  console.log(`✅ Administrador garantido: ${admin.email} (ID: ${admin.id})`);

  // 2. Localizar o arquivo CSV de forma robusta a nível de caixa de texto (case sensitivity)
  const possiblePaths = [
    path.join(process.cwd(), 'dados_acervo/Metadados.csv'),
    path.join(process.cwd(), 'dados_acervo/metadados.csv'),
  ];
  let csvPath = '';
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      csvPath = p;
      break;
    }
  }

  if (!csvPath) {
    throw new Error(
      '❌ Arquivo CSV de metadados não foi encontrado em ./dados_acervo/Metadados.csv',
    );
  }
  console.log(`📂 Arquivo CSV encontrado em: ${csvPath}`);

  // 3. Ler o CSV usando stream linha por linha para acumular os registros
  const rows: CSVRow[] = [];

  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csvParser())
      .on('data', (data) => {
        // Apenas processa se a linha tiver um nome definido
        if (data.Nome && data.Nome.trim() !== '') {
          rows.push(data as CSVRow);
        }
      })
      .on('end', () => {
        console.log(
          `📥 Leitura do CSV concluída. ${rows.length} registros acumulados.`,
        );
        resolve();
      })
      .on('error', (err) => {
        reject(err);
      });
  });

  // 4. Processar a inserção no banco de dados usando try/catch por linha
  console.log('⚡ Iniciando inserção dos itens no banco de dados...');
  let inseridosSucesso = 0;
  let falhas = 0;
  let pulados = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const indexStr = `[Linha ${i + 2}]`; // +2 porque o CSV começa em 1 e tem o cabeçalho

    try {
      const nome = cleanField(row.Nome);
      const numeroInventario = cleanField(row['Nº de Inventário']);

      // Validação básica do registro
      if (!nome) {
        console.warn(`${indexStr} ⚠️ Registro pulado por falta de Nome.`);
        pulados++;
        continue;
      }

      // Evita duplicados verificando se o número de inventário já existe
      if (numeroInventario) {
        const existente = await prisma.acervo.findFirst({
          where: { numeroInventario },
        });
        if (existente) {
          console.log(
            `${indexStr} ℹ️ Item com Nº de Inventário "${numeroInventario}" já cadastrado. Ignorado.`,
          );
          pulados++;
          continue;
        }
      }

      // Tratar arquivos e mídia para pegar a imagem principal e extras
      const mediaField = row['Arquivos e mídia'] || '';
      const imagePaths = mediaField
        .split(',')
        .map((p) => p.trim())
        .filter((p) => p.length > 0);

      const resolvedImages = imagePaths
        .map((p) =>
          resolveImageUrl(p, availableImages, dadosImagensDir, publicAcervoDir),
        )
        .filter((url): url is string => Boolean(url));

      let mainImagePath: string | null = null;
      const additionalImages: string[] = [];

      if (resolvedImages.length > 0) {
        mainImagePath = resolvedImages[0];
        additionalImages.push(...resolvedImages.slice(1));
      }

      if (!mainImagePath && imagePaths.length > 0) {
        console.warn(
          `${indexStr} ⚠️ Imagem principal não encontrada para ${imagePaths[0]}`,
        );
      }

      // Tratar demais metadados com as funções auxiliares robustas
      const localOrigem = parseLocalOrigem(cleanField(row['Local de Origem']));
      const dimensoes = parseDimensoes(cleanField(row.Dimensões));

      // Mapeamento e Criação do Registro
      await prisma.acervo.create({
        data: {
          titulo: nome,
          nome: nome,
          descricao: cleanField(row['Contexto Historico']),
          contextoHistorico: cleanField(row['Contexto Historico']),
          imagem: mainImagePath,
          imagemCapa: mainImagePath,
          ordem: i + 1,
          colecao: cleanField(row.Acervo), // Ex: "Religiosa", "Acervo Militar"
          tags: cleanField(row.Coleção), // Ex: "Utensílios Domésticos, Vidraria"
          numeroInventario: numeroInventario,
          artista: cleanField(row.Responsável), // Mapeia o Responsável como Criador/Artista
          periodo: cleanField(row['Período/Época']),
          dataProducao: cleanField(row['Data de Produção']),
          material: cleanField(row.Material),
          tecnica: cleanField(row.Técnica),
          doador: cleanField(row.Doador),
          estadoConservacao: cleanField(row['Estado de Conservação']),
          cidadeOrigem: localOrigem.cidadeOrigem,
          estadoOrigem: localOrigem.estadoOrigem,
          paisOrigem: localOrigem.paisOrigem,
          altura: dimensoes.altura,
          largura: dimensoes.largura,
          profundidade: dimensoes.profundidade,
          ativo: true,
          usuarioId: admin.id,
          // Insere as mídias adicionais de carrossel de forma atômica/aninhada no Prisma
          midias: {
            create: additionalImages.map((imgUrl, index) => ({
              tipo: 'imagem',
              url: imgUrl,
              titulo: `Mídia adicional de ${nome}`,
              ordem: index + 1,
              ativo: true,
            })),
          },
        },
      });

      console.log(`${indexStr} ✅ Inserido com sucesso: "${nome}"`);
      inseridosSucesso++;
    } catch (error) {
      console.error(
        `${indexStr} ❌ Falha ao inserir o item "${row.Nome}":`,
        error,
      );
      falhas++;
    }
  }

  console.log('\n📊 --- RESUMO FINAL DA POPULAÇÃO ---');
  console.log(`✅ Itens inseridos com sucesso: ${inseridosSucesso}`);
  console.log(`⚠️ Itens ignorados/já cadastrados: ${pulados}`);
  console.log(`❌ Itens com falha de inserção: ${falhas}`);
  console.log('🎉 Script de semente (seed) concluído.');
}

main()
  .catch((e) => {
    console.error('❌ Erro crítico no seed script:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
