# Diário de desenvolvimento — Museu Histórico Gilberto Gerlach

Este arquivo serve como passagem de contexto para continuar o trabalho em outra instalação do Codex CLI. Acrescente uma entrada datada a cada sessão, distinguindo o que foi confirmado do que ainda precisa ser verificado.

## 2026-09-21 — Atualização do diagrama e registro das decisões

### Objetivo da sessão

Atualizar o diagrama do banco no README e manter as decisões desta conversa disponíveis para continuar o trabalho em outra instalação do Codex CLI.

### O que foi analisado

- O diagrama Mermaid do `README.md`, os modelos de `prisma/schema.prisma` e a migração que acrescentou campos ao `Acervo`.
- A regra do repositório no GitHub: alterações na branch `main` devem passar por pull request; o envio direto foi recusado.
- A necessidade de preservar não apenas mudanças feitas, mas também ideias, justificativas e dúvidas de arquitetura.

### Alterações realizadas

- O diagrama do `README.md` foi alinhado aos sete modelos atuais do Prisma: inclusão de `AcervoMidia` e dos campos de catalogação do `Acervo`, remoção do campo `video` inexistente em `Acervo`, atualização de chaves e relacionamentos. Foi registrada a exclusão em cascata das mídias vinculadas a um item do acervo.
- O README foi publicado na branch `docs/atualizar-diagrama-banco-readme` no commit `ac8ef46`; a primeira versão deste log foi publicada na mesma branch no commit `aa51420`.
- Nenhum código da aplicação ou esquema do banco foi alterado. A correspondência dos campos do diagrama com os modelos Prisma foi conferida; a renderização visual do Mermaid no GitHub não foi verificada nesta sessão.

### Decisões tomadas

- Usar este log, por enquanto, também para ideias de arquitetura: registrar a proposta, a razão, alternativas consideradas, decisão e questões abertas, sempre indicando se a ideia ainda não foi aprovada ou implementada.
- Criar documentos próprios de arquitetura apenas quando uma decisão ou desenho ficar extenso o bastante para dificultar a leitura do diário; nesse caso, deixar aqui um resumo e um link para o documento.
- Integrar a branch à `main` por pull request. Não há necessidade de instalar o GitHub CLI para abrir ou aprovar o PR pelo navegador.

### Problemas pendentes

- Confirmar se o pull request foi criado e se a branch foi integrada à `main`. Isso não foi verificado nesta sessão.
- O histórico desta conversa no Codex CLI não é transferido automaticamente pelo Git; registrar aqui os pontos relevantes é necessário para recuperá-los em outro computador.

### Próximos passos

1. Abrir ou revisar o pull request da branch `docs/atualizar-diagrama-banco-readme` para `main` e cumprir as verificações e aprovações exigidas pelo GitHub.
2. Em sessões futuras, adicionar entradas que preservem também o raciocínio das decisões e as ideias ainda em discussão.

## 2026-09-21 — Preparação da passagem de contexto

### Objetivo da sessão

Registrar o estado observável do repositório e os passos para retomar o projeto em outro computador, sem alterar o código da aplicação.

### O que foi analisado

- Repositório `Projeto-Site-do-Museu/ifsc-museu-saojose`, branch `main`. O commit atual é `59bd506` (25/06/2026); os commits recentes tratam de volumes de dados do MySQL e atualização de dependências.
- Aplicação em Next.js 14, React 18, TypeScript e Tailwind CSS. Há páginas para apresentação do museu, acervo, coleções, artigos, vídeos, exposições, jogos e tour 3D em `src/app/`.
- Há rotas de API para autenticação, acervo, artigos, vídeos, coleções, imagens, uploads e contador em `src/app/api/`, além de componentes de administração em `src/components/`. A existência desses arquivos não confirma que todos os fluxos funcionam.
- O banco usa MySQL e Prisma; o esquema e as migrações estão em `prisma/`. Há scripts de configuração, importação e população em `scripts/`.
- `package.json` define `dev`, `build`, `lint`, `setup-db` e `import-acervo`, entre outros comandos. Há `package-lock.json` e `yarn.lock`; convém escolher um gerenciador antes de instalar dependências.
- `docker-compose.yml` usa `.env`, volumes `db_data` e `uploads_data`, diretório `dados_acervo/` e uma rede externa chamada `museu_network`. O `README.md` menciona `docker-compose.dev.yml`, mas esse arquivo não está presente nesta cópia.
- `.env.example` contém valores de exemplo para a aplicação, mas não lista `MY_SECRET_PW` nem `MY_DATABASE`, usados pelo Compose. `README.md` e `database.md` contêm instruções que precisam ser confrontadas com a configuração atual.

### Alterações realizadas

- Criado e atualizado apenas `docs/dev-log.md`. Nenhum arquivo da aplicação foi modificado.
- Não foram executados instalação de dependências, lint, build, migrações, testes funcionais ou comandos Docker nesta sessão.
- No momento desta revisão, `docs/dev-log.md` é o único arquivo não rastreado; ainda não houve commit nem push.

### Decisões tomadas

- Usar este diário como ponto de partida para a próxima instalação do Codex CLI e registrar observações verificadas, decisões e pendências em entradas datadas.
- Apresentar o documento para revisão antes de qualquer commit.

### Problemas pendentes

- Confirmar o funcionamento real das páginas, APIs, autenticação, administração, persistência e tour 3D.
- Conciliar a documentação existente com o repositório: o `README.md` ainda apresenta a API e a interface de gestão como trabalho futuro; ele também cita um arquivo Compose de desenvolvimento ausente.
- Verificar as variáveis e a rede necessárias ao Compose antes de subir os serviços. Não há validação do ambiente de banco nesta sessão.
- Dados locais não acompanham automaticamente o clone: `.env`, `uploads/` e `dados_acervo/` são ignorados pelo Git; os volumes Docker e o banco também exigem transferência ou recriação separada se forem necessários no outro computador.

### Próximos passos para retomar em outro computador

1. Após revisão e publicação deste arquivo no repositório, clonar ou atualizar a branch `main` e ler esta entrada, `README.md`, `package.json`, `prisma/schema.prisma` e `docker-compose.yml`.
2. Preparar as variáveis de ambiente a partir de `.env.example`, conferindo também as exigidas pelo Compose. Obter por canal seguro os segredos e, se necessário, os dados locais ou um backup do banco; não incluí-los no Git.
3. Instalar as dependências com o gerenciador escolhido e executar `npm run lint` e `npm run build` para estabelecer uma linha de base. Registrar aqui os resultados e eventuais falhas.
4. Configurar MySQL/Prisma e validar os fluxos principais em execução. Só então atualizar as instruções desatualizadas do `README.md` e de `database.md`.
