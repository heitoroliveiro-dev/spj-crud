# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


ERRO ENCONTRADO NA INSTALAÇÃO DO TAILWIND DEVIDO A CONFLITO DE VERSOES. NOVA FORMA DE UTILIZAR TAILWIND COM VITE É COM PLUGIN VITE NO TAILWIND V4
A correção recomendada é seguir o fluxo atual do Tailwind v4 com Vite: instalar @tailwindcss/vite, adicionar o plugin no vite.config.js e importar Tailwind no CSS. Não criar tailwind.config.js nem postcss.config.js por enquanto.
https://tailwindcss.com/docs/installation/using-vite

index.css: variaveis globais
app.css: estilo componente