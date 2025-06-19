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
