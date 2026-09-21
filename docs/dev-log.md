# Diário de desenvolvimento — Museu Histórico Gilberto Gerlach

Este arquivo serve como passagem de contexto para continuar o trabalho em outra instalação do Codex CLI. Acrescente uma entrada datada a cada sessão, distinguindo o que foi confirmado do que ainda precisa ser verificado.

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
