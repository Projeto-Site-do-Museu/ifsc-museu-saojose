# Casos de uso observados no código

Documentação reversa do site do Museu Histórico Gilberto Gerlach, elaborada em 21/09/2026 a partir das páginas, componentes, rotas de API e do esquema Prisma. Descreve o comportamento implementado que foi possível identificar no código; os fluxos não foram testados em execução nesta análise.

## Atores

- **Visitante:** acessa o conteúdo público sem autenticação.
- **Administrador:** usuário com `role = "admin"` que entra pela opção **Admin** no rodapé e recebe um token para ações de gestão.
- **Sistema:** registra visitas e consulta ou grava conteúdo no banco MySQL por meio do Prisma.

## Mapa dos casos de uso

| ID | Ator | Objetivo | Evidência principal |
| --- | --- | --- | --- |
| UC-01 | Visitante | Navegar pelas páginas institucionais | `src/components/Header.tsx`, `src/app/page.tsx`, `src/app/about/page.tsx` |
| UC-02 | Visitante | Explorar o acervo e suas mídias | `src/app/acervo/page.tsx`, `src/app/acervo/completo/page.tsx`, `src/components/GallerySection.tsx`, `src/app/api/acervo/` |
| UC-03 | Visitante | Ver a página de coleções e filtrar o acervo por coleção | `src/app/colecoes/page.tsx`, `src/components/GallerySection.tsx`, `src/components/ColecaoSelector.tsx`, `src/app/api/colecoes/route.ts` |
| UC-04 | Visitante | Ler artigos e assistir a vídeos | `src/app/artigos/page.tsx`, `src/app/videos/page.tsx`, `src/components/VideoGallery.tsx` |
| UC-05 | Visitante | Explorar o tour virtual e os jogos | `src/app/tour/page.tsx`, `src/components/Tour3D.tsx`, `src/app/jogos/page.tsx` |
| UC-06 | Administrador | Entrar e sair da área de edição | `src/components/Footer.tsx`, `src/components/AdminLogin.tsx`, `src/contexts/AdminContext.tsx`, `src/app/api/auth/login/route.ts` |
| UC-07 | Administrador | Cadastrar, editar e desativar itens do acervo e suas mídias | `src/components/GallerySection.tsx`, `src/components/ItemEditor.tsx`, `src/app/api/acervo/` |
| UC-08 | Administrador | Cadastrar, editar e desativar artigos e vídeos | `src/app/artigos/page.tsx`, `src/components/ArtigoEditor.tsx`, `src/components/VideoEditor.tsx`, `src/app/api/artigos/`, `src/app/api/videos/` |
| UC-09 | Administrador | Enviar imagens para uso no conteúdo | `src/components/ImageUpload.tsx`, `src/components/MediaManager.tsx`, `src/app/api/upload/route.ts`, `src/app/api/images/` |
| UC-10 | Sistema | Contabilizar visitas | `src/components/VisitorCounter.tsx`, `src/app/api/counter/route.ts` |

## Fluxos observados

### UC-01 — Navegar pelas páginas institucionais

**Pré-condição:** nenhuma. **Fluxo:** o visitante usa o menu para abrir início, informações sobre o museu e as demais seções públicas. **Resultado:** a página escolhida é exibida. As rotas `/exposicoes` e `/exposicoes/three` também existem no código, mas não aparecem no menu principal analisado.

### UC-02 — Explorar o acervo e suas mídias

**Pré-condição:** itens ativos cadastrados para exibição dinâmica. **Fluxo:** o visitante abre `/acervo`, segue para `/acervo/completo` e consulta itens, detalhes e mídias. A galeria busca `/api/acervo` e `/api/acervo/{id}/midias`; as consultas públicas filtram itens ativos. **Resultado:** os itens disponíveis são exibidos. O funcionamento com banco e arquivos reais ainda precisa de validação.

### UC-03 — Ver coleções disponíveis

**Pré-condição:** nenhuma para abrir `/colecoes`; itens ativos com `colecao` preenchido para ver opções no filtro do acervo. **Fluxo:** a página `/colecoes` mostra dois carrosséis com dados estáticos de exemplo e um link para o acervo completo. Na galeria do acervo, o visitante pode filtrar por coleção; o seletor consulta `/api/colecoes`, que retorna valores distintos do campo `colecao` dos itens ativos. **Resultado:** a página estática é exibida e, no acervo completo, o filtro usa as coleções cadastradas. O modelo Prisma não possui tabela `Colecao` separada.

### UC-04 — Ler artigos e assistir a vídeos

**Pré-condição:** conteúdo ativo cadastrado. **Fluxo:** o visitante abre `/artigos` ou `/videos`; as páginas consultam as APIs correspondentes. **Resultado:** o conteúdo publicado é exibido. Os componentes administrativos de edição aparecem apenas quando o contexto local identifica um administrador.

### UC-05 — Explorar o tour virtual e os jogos

**Pré-condição:** navegador capaz de executar os recursos da página. **Fluxo:** o visitante abre `/tour`, interage com uma cena Three.js construída com uma imagem panorâmica local e marcadores, ou escolhe um jogo em `/jogos`, que é aberto em um `iframe`. **Resultado:** a experiência selecionada aparece no navegador. A cena do tour contém conteúdo de exemplo no código; não há evidência nesta análise de que ela seja alimentada pelo banco.

### UC-06 — Entrar e sair da área de edição

**Pré-condição:** usuário ativo com papel `admin`. **Fluxo:** o administrador aciona **Admin** no rodapé, informa email e senha, recebe um JWT e passa a ver controles de edição; ao sair, o token local é removido. **Resultado:** o estado de administração da interface é alterado. A API compara a senha com o hash armazenado no banco.

### UC-07 — Gerenciar o acervo e suas mídias

**Pré-condição:** administrador autenticado. **Fluxo:** os controles de edição da galeria enviam requisições às rotas de acervo; o item pode incluir mídias associadas. **Resultado:** criação ou atualização persistida pelo Prisma. A exclusão de item no fluxo da API o marca como `ativo = false`; a exclusão de mídias possui rota própria. As mutações analisadas usam `withAuth`.

### UC-08 — Gerenciar artigos e vídeos

**Pré-condição:** administrador autenticado. **Fluxo:** o administrador usa os editores para criar ou alterar registros; as rotas de mutação validam o token. **Resultado:** conteúdo persistido no banco. As rotas de exclusão analisadas desativam registros em vez de removê-los fisicamente.

### UC-09 — Enviar imagens

**Pré-condição:** administrador autenticado. **Fluxo:** os componentes de edição enviam arquivos para `/api/upload`; a rota salva os arquivos em `uploads/` e retorna URLs de `/api/images/{filename}`. **Resultado:** a mídia fica disponível para associação ao conteúdo, dependendo da persistência desse diretório no ambiente implantado.

### UC-10 — Contabilizar visitas

**Pré-condição:** página com `VisitorCounter` renderizada. **Fluxo:** o componente envia `POST /api/counter` e consulta a contagem. A API usa um cookie `visitor_counted` para evitar nova contagem no mesmo navegador por até 30 dias e guarda registros em `ContadorVisitante`. **Resultado:** a contagem apresentada é atualizada conforme a resposta da API.

## Pontos a validar antes de tratar como requisitos consolidados

- A rota `POST /api/auth/register` cria um usuário com papel `admin` sem usar `withAuth`; não foi identificado uso de `RegisterForm` nas páginas analisadas. A política de cadastro e a exposição dessa rota exigem revisão.
- A proteção visual por `AdminContext` não substitui a validação do token nas APIs. As rotas de mutação listadas acima usam `withAuth`; revisar a autorização de cada nova rota quando ela for criada.
- O tour e os jogos dependem de arquivos locais. Verificar quais recursos estão disponíveis na implantação e se o conteúdo de exemplo do tour deve ser substituído.
- Esta documentação não comprova sucesso dos fluxos em produção. Validar navegação, permissões, operações no MySQL e armazenamento de arquivos em um ambiente de teste.
