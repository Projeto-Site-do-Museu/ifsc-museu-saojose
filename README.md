# Documentação do Projeto

## Visão Geral
Este projeto é uma landing page responsiva para o Museu Histórico de São José, desenvolvida com **Next.js** e **Tailwind CSS**. O objetivo é proporcionar uma experiência imersiva para os visitantes, incluindo um **tour 3D interativo**.

## Tecnologias Utilizadas
- **Next.js** (React Framework)
- **Tailwind CSS** (Estilização)
- **TypeScript** (Tipagem)
- **Three.js** (para o tour 3D)

## Como Rodar o Projeto
### 1. Clonar o Repositório
```bash
git clone https://github.com/nicolasfvp/ProjetoMuseu.git
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
### 4. Rodar o Servidor definitivo

Inicialmente, execute: 

```bash
npm run build
```

#Este comando irá gerar uma versão otimizada do site, porém qualquer erro no código pode impossibilizar o build e deve ser corrigido

após o build

```bash
npm run start
```

Acesse `http://localhost:3000` no navegador para ver a aplicação em funcionamento.

### Boas práticas

# O projeto foi criado em Next.JS com Tailwind.CSS, utilizando conceitos de MobileFirst.
Em resumo, caso altere a estrutura do código, tome *MUITO* cuidado para não alterar as boas práticas.
Toda a responsividade do site gira em torno do MobileFirst. Os estilos em comum permanecem inalterados, mas os estilos que são diferentes para mobile e web devem ser feitos da seguinte forma:

ClassName=" estilo-para-mobile md:estilo-para-web"

mantendo esta estrutura a responsividade do site deve ser facilmente ajustada.

#Utilize apenas as novas versões do Next!

todas as maiores funcionalidades do site estão feitas conforme as boas práticas das versões mais recentes do next, então, em caso de novas alterações, olhe para o restante do código e não adicione nenhuma sintaxe nova, pois provavelmente estará errada.

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
└── next.config.js    # Configuração do Next.js
```

## Padrões e Boas Práticas
- **Componentização**: Componentes reutilizáveis para facilitar a manutenção.
- **Responsividade**: Uso de Tailwind CSS para adaptação a diferentes tamanhos de tela.
- **Code Style**: Uso de **ESLint e Prettier** para manter a uniformidade do código.
- **Performance**: Imagens otimizadas e uso de **lazy loading**.

## Considerações Finais
Caso precise adicionar novas funcionalidades ou realizar manutenção, siga os padrões estabelecidos e consulte a documentação do Next.js e Tailwind CSS.

Se tiver dúvidas, entre em contato comigo pelo email: nicolasfvp11@gmail.com. 🚀

