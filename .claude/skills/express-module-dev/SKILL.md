---
name: express-module-dev
description: Convenções de desenvolvimento de módulos no backend Express (camadas routes/controllers/services/repositories) e de páginas/componentes no frontend React. Use SEMPRE que a tarefa envolver nova rota, controller, service, repository, página ou componente.
---

# Desenvolvimento de módulos (Express + React)

## Regra 0 — Fonte da verdade
Consulte https://expressjs.com/en/guide/routing.html e https://react.dev/learn antes de assumir
comportamento de roteamento/hooks. Confirme a versão instalada (`package.json`) antes de propor
uma API — Express 5 e React Router v7 mudaram comportamento de versões anteriores (ex.: Express 5
propaga rejeição de Promise em handler async automaticamente para o error handler, sem precisar
de `try/catch` + `next(error)` manual em todo handler — mas o projeto já segue o padrão explícito
por consistência com o código existente, manter esse padrão em vez de misturar os dois estilos).

## Camadas do backend (`backend/src/`)

```
routes/<recurso>Routes.js       # só mapeia HTTP verb + path -> controller. Sem lógica.
controllers/<recurso>Controller.js  # lê req.params/req.body/req.user, chama service, define status HTTP.
                                     # try/catch -> next(error). Nunca importa Prisma.
services/<recurso>Service.js     # validação de entrada + regra de negócio. Lança Error com .status
                                     # via helper reportaErro(message, status) (ver processoService.js).
repositories/<recurso>Repository.js  # só chamadas Prisma (findMany/create/update/delete). Sem
                                        # status HTTP, sem regra de negócio.
```

Padrão de erro (já estabelecido no projeto, seguir sempre):
```js
function reportaErro(message, status) {
  const error = new Error(message);
  error.status = status;
  throw error;
}
```
Capturado uniformemente por `middlewares/errorHandler.js`, que responde
`{ error: message }` com `status || 500`.

## Camadas do frontend (`frontend/src/`)

```
pages/<Tela>.jsx        # estado local (useState) para loading/error/dados, useEffect para buscar,
                          # chama frontend/src/services/api.js.
components/              # reutilizáveis: Modal, ConfirmDialog, Toast, forms com padrão fieldErrors
                          # (ver ProcessoForm.jsx) — reaproveitar antes de criar um novo componente.
context/                 # estado global (hoje só AuthContext) — usar Context API nativa do React,
                          # sem lib de state management (nenhuma no projeto, não introduzir sem necessidade).
services/api.js          # único ponto de fetch — helper request() central, lança Error com .status.
```

## Checklist de conclusão (Definition of Done)
- [ ] Controller não importa Prisma nem contém regra de negócio
- [ ] Service não conhece `req`/`res`, lança erro via `reportaErro`
- [ ] Repository não lança erro HTTP nem conhece regra de negócio
- [ ] Página/componente novo reaproveita `Modal`/`Toast`/`ConfirmDialog`/padrão `fieldErrors` quando aplicável
- [ ] `npx eslint` limpo no frontend (config já existe em `frontend/eslint.config.js` ou similar)
- [ ] `node --check` limpo em todo arquivo `.js` novo do backend (sintaxe válida, projeto é JS puro)

## Anti-padrões (rejeitar em code review)
- Lógica de negócio dentro do controller ou da rota
- Prisma importado fora de `repositories/` ou `database/`
- Novo componente de UI duplicando um já existente (`Modal`/`Toast`/`ConfirmDialog`)
- Estado global novo sem necessidade real (preferir `useState` local até haver motivo concreto)
