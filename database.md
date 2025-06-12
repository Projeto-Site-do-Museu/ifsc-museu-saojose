# Modelo Entidade Relacionamento - Museu Histórico de São José

## Diagrama ER

```mermaid
erDiagram
    USUARIOS ||--o{ MIDIAS : "cria"
    USUARIOS ||--o{ ARTIGOS : "escreve"
    USUARIOS ||--o{ LOGS_ATIVIDADES : "gera"
    
    CATEGORIAS ||--o{ MIDIAS : "classifica"
    CATEGORIAS ||--o{ ARTIGOS : "categoriza"
    
    MIDIAS ||--o{ GALERIA : "exibe"
    MIDIAS ||--o{ CAROUSEL : "apresenta"
    MIDIAS ||--o{ VIDEOS_ESPECIAIS : "armazena"
    MIDIAS ||--o{ VIDEOS_ESPECIAIS : "thumbnail"
    MIDIAS ||--o{ ARTIGOS : "destaque"
    MIDIAS ||--o{ ARTIGOS_MIDIAS : "relaciona"
    
    ARTIGOS ||--o{ ARTIGOS_MIDIAS : "possui"
    
    USUARIOS {
        int id PK
        string nome
        string email UK
        string senha_hash
        enum role
        boolean ativo
        timestamp created_at
        timestamp updated_at
    }
    
    CATEGORIAS {
        int id PK
        string nome
        text descricao
        string slug UK
        boolean ativo
        timestamp created_at
    }
    
    MIDIAS {
        int id PK
        string nome
        string arquivo
        enum tipo
        string alt_text
        text descricao
        int categoria_id FK
        int usuario_id FK
        int tamanho_arquivo
        int largura
        int altura
        boolean ativo
        timestamp created_at
        timestamp updated_at
    }
    
    GALERIA {
        int id PK
        int midia_id FK
        string titulo
        text descricao
        int ordem
        boolean ativo
        timestamp created_at
    }
    
    CAROUSEL {
        int id PK
        int midia_id FK
        string titulo
        text texto
        string link_externo
        int ordem
        boolean ativo
        timestamp created_at
    }
    
    ARTIGOS {
        int id PK
        string titulo
        string slug UK
        text resumo
        longtext conteudo
        int imagem_destaque_id FK
        int categoria_id FK
        int usuario_id FK
        enum status
        timestamp data_publicacao
        boolean destaque
        int visualizacoes
        timestamp created_at
        timestamp updated_at
    }
    
    ARTIGOS_MIDIAS {
        int id PK
        int artigo_id FK
        int midia_id FK
        text legenda
        int ordem
    }
    
    VIDEOS_ESPECIAIS {
        int id PK
        int midia_id FK
        string titulo
        text descricao
        enum tipo
        int thumbnail_id FK
        int duracao
        int ordem
        boolean ativo
        timestamp created_at
    }
    
    CONTADOR_VISITANTES {
        int id PK
        int contador
        date data_registro
        string ip_origem
        text user_agent
        timestamp created_at
    }
    
    CONFIGURACOES {
        int id PK
        string chave UK
        text valor
        enum tipo
        text descricao
        timestamp created_at
        timestamp updated_at
    }
    
    LOGS_ATIVIDADES {
        int id PK
        int usuario_id FK
        string acao
        string tabela_afetada
        int id_registro
        json dados_anteriores
        json dados_novos
        string ip_origem
        text user_agent
        timestamp created_at
    }
```

## Descrição das Entidades

### USUARIOS
Gerencia todos os usuários do sistema com diferentes níveis de acesso (admin, editor, viewer).

### CATEGORIAS  
Organiza o conteúdo por temas (História Local, Cultura, Documentos, etc.).

### MIDIAS
Entidade central que armazena todas as imagens e vídeos do sistema.

### GALERIA
Itens exibidos na galeria principal do site (substitui gallery.json).

### CAROUSEL
Slides do carrossel da página inicial (substitui carousel.json).

### ARTIGOS
Sistema completo de artigos/exposições com versionamento e status.

### ARTIGOS_MIDIAS
Relacionamento N:M entre artigos e mídias (galeria de cada artigo).

### VIDEOS_ESPECIAIS
Vídeos com propósitos específicos (intro, banner, educativo) - substitui videos.json.

### CONTADOR_VISITANTES
Sistema de analytics com controle por IP e data (substitui counter.json).

### CONFIGURACOES
Configurações gerais do sistema (títulos, emails, flags de funcionalidades).

### LOGS_ATIVIDADES
Auditoria completa de todas as ações dos usuários no sistema.

## Relacionamentos Principais

- **1:N** - Um usuário pode criar várias mídias, artigos e gerar múltiplos logs
- **1:N** - Uma categoria pode ter várias mídias e artigos
- **1:N** - Uma mídia pode aparecer em múltiplas galerias, carrossel e vídeos especiais
- **N:M** - Artigos podem ter múltiplas mídias associadas através da tabela de relacionamento
- **Autorreferência** - Mídias podem referenciar outras mídias (ex: thumbnail de vídeo)

## Benefícios da Estrutura

1. **Modularidade**: Cada funcionalidade em sua própria tabela
2. **Escalabilidade**: Relacionamentos bem definidos permitem crescimento
3. **Auditoria**: Sistema completo de logs e versionamento
4. **Flexibilidade**: Categorização e múltiplos tipos de conteúdo
5. **Performance**: Índices otimizados para consultas frequentes
