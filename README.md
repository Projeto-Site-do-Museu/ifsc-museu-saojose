# Documentação do Projeto

## Visão Geral
Este projeto é uma landing page responsiva para o Museu Histórico de São José, desenvolvida com **Next.js** e **Tailwind CSS**. O objetivo é proporcionar uma experiência imersiva para os visitantes, incluindo um **tour 3D interativo**.

## Tecnologias Utilizadas
- **Next.js** (React Framework)
- **Tailwind CSS** (Estilização)
- **TypeScript** (Tipagem)
- **Three.js** (para o tour 3D)
- **Docker** (Containerização)

## Como Rodar o Projeto
### 1. Clonar o Repositório
```bash
git clone https://github.com/Projeto-Site-do-Museu/ProjetoMuseu
cd nome-do-projeto
```

### 2. Instalar Dependências
```bash
npm install
# ou
yarn install
```

### 3. Rodar o Servidor de Desenvolvimento
```bash
npm run dev
# ou
yarn dev
```

Acesse `http://localhost:3000` no navegador para ver a aplicação em funcionamento.

### 4. Rodar o Projeto com Docker

#### Ambiente de Desenvolvimento
Para rodar o projeto em ambiente de desenvolvimento com Docker (com hot reload):

```bash
docker-compose -f docker-compose.dev.yml up --build
```

Este comando irá:
- Construir a imagem Docker para desenvolvimento
- Montar o código-fonte como um volume para permitir hot reload
- Iniciar o servidor de desenvolvimento com `next dev`

Acesse `http://localhost:3000` no navegador para ver a aplicação em funcionamento.

#### Ambiente de Produção
Para rodar o projeto em ambiente de produção com Docker:

```bash
docker-compose up --build
```

Este comando irá:
- Construir a imagem Docker para produção
- Executar o build da aplicação
- Iniciar o servidor otimizado com `next start`

Acesse `http://localhost:3000` no navegador para ver a aplicação em funcionamento.

### 5. Rodar o Servidor definitivo sem Docker

Inicialmente, execute: 

```bash
npm run build
```

Este comando irá gerar uma versão otimizada do site, porém qualquer erro no código pode impossibilitar o build e deve ser corrigido

após o build

```bash
npm run start
```

Acesse `http://localhost:3000` no navegador para ver a aplicação em funcionamento.

### 6. Banco de Dados: MySQL + Prisma

#### Dependências

- [MySQL](https://www.mysql.com/) (Servidor de banco de dados relacional)
- [Prisma ORM](https://www.prisma.io/) (`prisma` e `@prisma/client`)
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) (para hash de senhas)

Instale as dependências do Prisma no projeto:

```bash
npm install prisma @prisma/client bcryptjs
npx prisma init
```

#### Configuração do MySQL

1. **Instale o MySQL** (caso não tenha):

   ```bash
   sudo apt update
   sudo apt install mysql-server
   ```

2. **Crie um usuário e banco de dados:**

   ```bash
   sudo mysql
   ```

   No prompt do MySQL:

   ```sql
   CREATE USER 'admin'@'localhost' IDENTIFIED BY 'password';
   CREATE DATABASE database_museu;
   GRANT ALL PRIVILEGES ON database_museu.* TO 'admin'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

3. **Configure a string de conexão no arquivo `.env`:**

   ```env
   DATABASE_URL="mysql://admin:password@localhost:3306/database_museu"
   ```

#### Comandos Prisma

- **Gerar as tabelas no banco:**

  ```bash
  npx prisma migrate dev --name init
  ```

- **Visualizar e editar dados via interface web:**

  ```bash
  npx prisma studio
  ```

- **Gerar o client do Prisma (após alterar o schema):**

  ```bash
  npx prisma generate
  ```

#### Boas Práticas

- **Nunca salve senhas em texto puro**: Sempre utilize hash (exemplo: `bcryptjs`).
- **Versione o schema do banco**: Use migrations do Prisma para manter o histórico das alterações.
- **Use variáveis de ambiente**: Nunca exponha senhas ou dados sensíveis no código.
- **Faça backup regular do banco**: Especialmente em produção.
- **Utilize o Prisma Client para todas as queries**: Evita SQL Injection e facilita manutenção.
- **Mantenha o schema.prisma atualizado**: Sempre que alterar entidades ou relacionamentos.

#### Acesso ao Banco de Dados

- **Acesso via terminal:**

  ```bash
  mysql -u admin -p -h localhost -P 3306 database_museu
  ```

- **Acesso via Prisma Studio:**

  ```bash
  npx prisma studio
  ```

### Como gerar o hash da senha do admin

Para criar um usuário admin manualmente no banco, você precisa gerar o hash da senha.  
No terminal, execute:

```sh
node
```
E então, dentro do prompt do Node.js, digite:

```js
const bcrypt = require('bcryptjs');
bcrypt.hashSync('ifsc.br.museu!##&', 10);
```
O resultado será o hash da senha. Use esse valor no campo `senhaHash` ao criar o usuário admin no banco de dados.

#### Referências

- [Documentação Prisma](https://www.prisma.io/docs/)
- [Documentação MySQL](https://dev.mysql.com/doc/)
- [Prisma + Next.js](https://www.prisma.io/docs/guides/development-environment/nextjs)

---

**Observação:**  
Sempre que alterar o arquivo `prisma/schema.prisma`, rode `npx prisma migrate dev` para atualizar o banco de dados.


# Boas práticas

### O projeto foi criado em Next.JS com Tailwind.CSS, utilizando conceitos de MobileFirst.
Em resumo, caso altere a estrutura do código, tome *MUITO* cuidado para não alterar as boas práticas.
Toda a responsividade do site gira em torno do MobileFirst. Os estilos em comum permanecem inalterados, mas os estilos que são diferentes para mobile e web devem ser feitos da seguinte forma:

ClassName=" estilo-para-mobile md:estilo-para-web"

mantendo esta estrutura a responsividade do site deve ser facilmente ajustada.

#Utilize apenas as novas versões do Next!

todas as maiores funcionalidades do site estão feitas conforme as boas práticas das versões mais recentes do next, então, em caso de novas alterações, olhe para o restante do código e não adicione nenhuma sintaxe nova, pois provavelmente estará errada.

# Futuras alterações 

O site foi desenhado para que todos as imagens e textos sejam dinamicos a partir de uma API. Esta API deve ser criada, juntamente ao banco de dados e uma interface gráfica para o gestor administrar o site de forma simples e segura apenas realizando requisições para a API. Após a conclusão da mesma, os Mocks de imagens e texto do site devem ser substituidos pelo retorno da requisição para a API, tornando o site dinâmico às alterações.

## Estrutura do Projeto
```
/
├── components/       # Componentes reutilizáveis
├── public/           # Arquivos estáticos (imagens, fontes)
├── src/              # Diretório fonte do projeto
|   ├── app/          # Páginas da aplicação
│     ├── globals.css # arquivo css geral (utilizar apenas para configurações globais, para estilizações de pagina utilizar as classes tailwind.)
│     ├── page.tsx    # Página principal (Home)
│     ├── about       # pagina sobre
│     ├── acervo      # pagina acervo
│     ├── tour        # pagina tour3D
│     ├── ...         # dentre outros
|   ├── components/   # Diretório dos componentes
│     ├── footer.tsx  # Footer do site
│     ├── header.tsx  # header do site
│     ├── tour3D.tsc  # componente do tour 3D
│     ├── ...         # dentre outros
├── package.json      # Configuração de dependências
├── tsconfig.json     # Configuração do TypeScript
├── next.config.js    # Configuração do Next.js
├── Dockerfile        # Configuração Docker para produção
├── Dockerfile.dev    # Configuração Docker para desenvolvimento
├── docker-compose.yml       # Configuração docker-compose para produção
└── docker-compose.dev.yml   # Configuração docker-compose para desenvolvimento
```

## Diagrama do Banco de Dados
```mermaid
erDiagram
    Usuario {
        Int id PK "autoincrement()"
        String nome
        String email "unique"
        String senhaHash
        String role
        Boolean ativo
        DateTime createdAt
        DateTime updatedAt
    }
    Categoria {
        Int id PK "autoincrement()"
        String nome
        String descricao
        String slug "unique"
        Boolean ativo
        DateTime createdAt
    }
    Midia {
        Int id PK "autoincrement()"
        String nome
        String arquivo
        String tipo
        String altText
        String descricao
        Int categoriaId FK
        Int usuarioId FK
        Int tamanhoArquivo
        Int largura
        Int altura
        Boolean ativo
        DateTime createdAt
        DateTime updatedAt
    }
    Galeria {
        Int id PK "autoincrement()"
        Int midiaId FK
        String titulo
        String descricao
        Int ordem
        Boolean ativo
        DateTime createdAt
    }
    Carousel {
        Int id PK "autoincrement()"
        Int midiaId FK
        String titulo
        String texto
        String linkExterno
        Int ordem
        Boolean ativo
        DateTime createdAt
    }
    Artigo {
        Int id PK "autoincrement()"
        String titulo
        String slug "unique"
        String resumo
        String conteudo
        Int imagemDestaqueId FK
        Int categoriaId FK
        Int usuarioId FK
        String status
        DateTime dataPublicacao
        Boolean destaque
        Int visualizacoes
        DateTime createdAt
        DateTime updatedAt
    }
    ArtigoMidia {
        Int id PK "autoincrement()"
        Int artigoId FK
        Int midiaId FK
        String legenda
        Int ordem
    }
    VideoEspecial {
        Int id PK "autoincrement()"
        Int midiaId FK
        String titulo
        String descricao
        String tipo
        Int thumbnailId FK
        Int duracao
        Int ordem
        Boolean ativo
        DateTime createdAt
    }
    ContadorVisitante {
        Int id PK "autoincrement()"
        Int contador
        DateTime dataRegistro
        String ipOrigem
        String userAgent
        DateTime createdAt
    }
    Configuracao {
        Int id PK "autoincrement()"
        String chave "unique"
        String valor
        String tipo
        String descricao
        DateTime createdAt
        DateTime updatedAt
    }
    LogAtividade {
        Int id PK "autoincrement()"
        Int usuarioId FK
        String acao
        String tabelaAfetada
        Int idRegistro
        Json dadosAnteriores
        Json dadosNovos
        String ipOrigem
        String userAgent
        DateTime createdAt
    }

    Usuario ||--o{ Midia : "possui"
    Usuario ||--o{ Artigo : "escreve"
    Usuario ||--o{ LogAtividade : "registra"
    Categoria ||--o{ Midia : "possui"
    Categoria ||--o{ Artigo : "possui"
    Midia ||--o{ Galeria : "possui"
    Midia ||--o{ Carousel : "possui"
    Midia }o--|| VideoEspecial : "principal"
    Midia }o--|| VideoEspecial : "thumbnail"
    Midia ||--o{ ArtigoMidia : "possui"
    Midia }o--|| Artigo : "destaque"
    Artigo ||--o{ ArtigoMidia : "possui"
    Artigo }o--|| Midia : "destaque"
    Artigo ||--o{ Categoria : "pertence"
    Artigo ||--o{ Usuario : "escrito por"
    VideoEspecial }o--|| Midia : "midia"
    VideoEspecial }o--|| Midia : "thumbnail"
    LogAtividade }o--|| Usuario : "relacionado a"
```

## Padrões e Boas Práticas
- **Componentização**: Componentes reutilizáveis para facilitar a manutenção.
- **Responsividade**: Uso de Tailwind CSS para adaptação a diferentes tamanhos de tela.
- **Code Style**: Uso de **ESLint e Prettier** para manter a uniformidade do código.
- **Performance**: Imagens otimizadas e uso de **lazy loading**.

## Considerações Finais
Caso precise adicionar novas funcionalidades ou realizar manutenção, siga os padrões estabelecidos e consulte a documentação do Next.js e Tailwind CSS.



