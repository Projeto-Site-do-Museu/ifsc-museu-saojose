# Modelo Entidade Relacionamento - Museu Histórico de São José

## Diagrama ER

```mermaid
erDiagram
    USUARIOS ||--o{ ARTIGOS : "escreve"
    USUARIOS ||--o{ ACERVOS : "gerencia"
    USUARIOS ||--o{ VIDEOS_ESPECIAIS : "administra"
    
    USUARIOS {
        int id PK
        string nome
        string email UK
        string senha_hash
        string role
        boolean ativo
        timestamp created_at
        timestamp updated_at
    }
    
    ARTIGOS {
        int id PK
        string titulo
        text resumo
        longtext conteudo
        string imagem
        string video
        timestamp data_publicacao
        boolean ativo
        timestamp created_at
        timestamp updated_at
        int usuario_id FK
    }
    
    ACERVOS {
        int id PK
        string titulo
        text descricao
        string imagem
        string video
        int ordem
        boolean ativo
        timestamp created_at
        timestamp updated_at
        int usuario_id FK
    }
    
    VIDEOS_ESPECIAIS {
        int id PK
        string titulo
        text descricao
        string tipo
        string video
        string thumbnail
        int ordem
        boolean ativo
        timestamp created_at
        timestamp updated_at
        int usuario_id FK
    }
    
    CONTADOR_VISITANTES {
        int id PK
        int contador
        timestamp data_registro
        string ip_origem
        string user_agent
        timestamp created_at
    }
    
    CONFIGURACOES {
        int id PK
        string chave UK
        text valor
        text descricao
        timestamp created_at
        timestamp updated_at
    }
```

## Descrição das Entidades

### USUARIOS
Gerencia todos os usuários administradores do sistema que podem editar conteúdo.

### ARTIGOS
Sistema de artigos/exposições do museu com conteúdo completo.

### ACERVOS
Itens da galeria/acervo do museu (substitui gallery.json).

### VIDEOS_ESPECIAIS
Vídeos com propósitos específicos (intro, banner, educativo) - substitui videos.json.

### CONTADOR_VISITANTES
Sistema de analytics com controle por IP e data (substitui counter.json).

### CONFIGURACOES
Configurações gerais dinâmicas do sistema (títulos, emails, contatos, etc.).

## Relacionamentos Principais

- **1:N** - Um usuário pode criar várias artigos, acervos e vídeos especiais
- **Independente** - ContadorVisitante e Configuracao não têm relacionamentos

---

# Configuração Prática do Banco de Dados

## Pré-requisitos

- Docker e Docker Compose instalados
- Projeto clonado e ambiente de desenvolvimento configurado


## Configurar Arquivo .env

```bash
# Voltar para a raiz do projeto
cd ..

# Criar arquivo .env com configurações corretas
cat > .env << 'EOF'
DATABASE_URL="mysql://root:password@db:3306/database_museu"
EOF

# Verificar se foi criado corretamente
cat .env
```

**Configurações do banco:**
- **Usuário:** `root`
- **Senha:** `password`
- **Host:** `db` (dentro da rede Docker) / `localhost` (fora da rede)
- **Porta:** `3306`
- **Banco:** `database_museu` (criado automaticamente)

## Gerar Cliente Prisma e Aplicar Migrations

```bash
# Gerar o cliente Prisma
npx prisma generate

# Aplicar migrations (criar todas as tabelas)
# IMPORTANTE: Executar dentro do container da aplicação
docker exec -it projetomuseu_devcontainer-app-1 npx prisma migrate dev --name init
```

**Alternativa se não estiver usando containers:**
```bash
# Se rodar fora do Docker, usar localhost no .env
DATABASE_URL="mysql://root:password@localhost:3306/database_museu"

# Depois executar normalmente
npx prisma migrate dev --name init
```

## Verificar se as Tabelas foram Criadas

### Via MySQL CLI
```bash
# Conectar ao MySQL (usar 127.0.0.1, não localhost)
docker exec -it museu_db_dev mysql -h 127.0.0.1 -u root -ppassword

# No prompt do MySQL:
USE database_museu;
SHOW TABLES;
```

**Tabelas esperadas:**
- `Usuario`
- `Artigo`
- `Acervo`
- `VideoEspecial`
- `ContadorVisitante`
- `Configuracao`
- `_prisma_migrations`

### Via Prisma Studio
```bash
# Abrir interface web do Prisma (http://localhost:5555)
npx prisma studio
```

## Criar Usuário Admin Inicial (Opcional)

```bash
# Gerar hash da senha de admin
node -e "console.log(require('bcryptjs').hashSync('ifsc.br.museu!##&', 10))"

# Conectar ao MySQL
docker exec -it museu_db_dev mysql -h 127.0.0.1 -u root -ppassword database_museu

# No prompt do MySQL (substituir HASH_AQUI pelo resultado do comando acima):
INSERT INTO Usuario (nome, email, senhaHash, role, ativo) 
VALUES ('Administrador', 'admin@museu.com', 'HASH_AQUI', 'admin', true);

# Verificar se foi criado
SELECT id, nome, email, role FROM Usuario;
EXIT;
```

## Comandos Úteis para Desenvolvimento

### Resetar o Banco (CUIDADO: Apaga todos os dados)
```bash
# Parar containers
docker-compose down

# Remover volume do banco (apaga dados)
docker volume rm devcontainer_mysql-data

# Recriar tudo
docker-compose up -d
sleep 120

# Reaplicar migrations
docker exec -it projetomuseu_devcontainer-app-1 npx prisma migrate dev --name init
```

### Verificar Status das Migrations
```bash
docker exec -it projetomuseu_devcontainer-app-1 npx prisma migrate status
```

### Aplicar Mudanças no Schema (Development)
```bash
# Após alterar prisma/schema.prisma
docker exec -it projetomuseu_devcontainer-app-1 npx prisma db push
```

### Backup do Banco
```bash
# Criar backup
docker exec museu_db_dev mysqldump -u root -ppassword database_museu > backup.sql

# Restaurar backup
docker exec -i museu_db_dev mysql -u root -ppassword database_museu < backup.sql
```

## Problemas Comuns e Soluções

### Erro "Can't reach database server at `db:3306`"
**Causa:** Executando comandos fora da rede Docker  
**Solução:** Executar dentro do container ou usar `localhost` no .env

### Erro "Access denied for user 'root'@'localhost'"
**Causa:** MySQL ainda inicializando ou problema de autenticação  
**Soluções:**
1. Aguardar mais tempo (até 3 minutos)
2. Usar `127.0.0.1` em vez de `localhost`
3. Verificar logs: `docker logs museu_db_dev`

### Container MySQL não inicia
**Causa:** Conflito de portas ou volumes corrompidos  
**Soluções:**
1. Verificar se porta 3306 está livre: `lsof -i :3306`
2. Remover volumes: `docker volume prune`
3. Recriar containers: `docker-compose down && docker-compose up -d`

### Tabelas não foram criadas
**Causa:** Migration não foi aplicada corretamente  
**Solução:**
```bash
# Verificar status
docker exec -it projetomuseu_devcontainer-app-1 npx prisma migrate status

# Reaplicar se necessário
docker exec -it projetomuseu_devcontainer-app-1 npx prisma migrate reset
```

## Estrutura de Arquivos

```
projeto/
├── .devcontainer/
│   └── docker-compose.yml    # Configuração Docker
├── prisma/
│   ├── schema.prisma         # Schema do banco
│   └── migrations/           # Histórico de migrations
├── .env                      # Variáveis de ambiente
└── database.md              # Esta documentação
```
