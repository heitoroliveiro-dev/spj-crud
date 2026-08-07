# Convenções — Git

## Repositório
- Repositório único para este projeto (backend + frontend + `.claude/`).
- **Nunca versionar**: `.env`, `node_modules/`, dumps de banco, credenciais.

## Fluxo
- Trunk-based simplificado: `main` estável + branches curtas `feat/...`, `fix/...`, `chore/...`.
- PRs pequenas (< ~400 linhas de diff); commits atômicos, um por tarefa de `tasks.md` quando
  fizer sentido.
- Push em `main` dispara deploy automático (Render + Vercel) — cuidado extra antes de mergear
  algo que não foi testado localmente.

## Conventional Commits
`<tipo>(escopo): descrição no imperativo`

Tipos: feat, fix, docs, refactor, perf, test, chore, build, ci

Exemplos:
- `feat(auth): adicionar signup com verificação de e-mail`
- `fix(processos): corrigir unicidade de numeroProcesso para ser por usuário`
- `docs(adr): registrar decisão de provedor de e-mail`
- `test(auth): cobrir fluxo de reset de senha`

## Critérios de merge
- Lint limpo (`npx eslint` no frontend), `node --check` limpo no backend, testes passando
  (`npm test` em `backend/`); spec/plan/tasks referenciados e atualizados junto com o código; sem
  segredo no diff.
