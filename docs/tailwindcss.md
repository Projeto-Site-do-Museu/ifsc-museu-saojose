# 📘 Documentação Completa: Tailwind CSS

## 🧠 O que é Tailwind CSS?

Tailwind é um framework CSS utilitário que permite construir interfaces de forma rápida, usando **classes CSS diretas no HTML**.

Diferente de frameworks como Bootstrap, ele não vem com componentes prontos, e sim **ferramentas para você criar o seu próprio design.**

---

## ⚙️ Como funciona?

Você usa classes utilitárias como:

```html
<div class="p-4 bg-blue-500 text-white rounded-lg">
  Olá, mundo!
</div>
```

Cada classe representa uma regra de CSS, como:

- `p-4` → padding: 1rem
- `bg-blue-500` → fundo azul
- `text-white` → texto branco

---

## 🚀 Iniciando um projeto

### Instalação via npm:

```bash
npm install -D tailwindcss
npx tailwindcss init
```

### Arquivo CSS base:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Compilação com CLI:

```bash
npx tailwindcss -i ./src/input.css -o ./dist/output.css --watch
```

---

## 🧩 Recursos poderosos

- **Responsividade** com prefixos `sm:`, `md:`, `lg:`
- **Dark mode**
- **Plugins** como `@tailwindcss/forms`, `typography`, etc.
- **Customização via tailwind.config.js**

---

## 📦 Exemplo de botão:

```html
<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  Clique aqui
</button>
```

---

## ✅ Vantagens do Tailwind

- Menos CSS customizado
- Responsivo por padrão
- Altamente produtivo
- Código visual direto no HTML
- Integra com qualquer framework (React, Vue, etc)

---

## 📚 Recursos adicionais

- [Documentação Oficial](https://tailwindcss.com/docs)
- [Playground Online](https://play.tailwindcss.com)