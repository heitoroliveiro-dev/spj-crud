Quebre o plano em tarefas executáveis (fase 3 do fluxo SDD) para: $ARGUMENTS

Pré-condição: `.claude/docs/specs/NNN-slug/plan.md` deve existir e estar aprovado.

Preencha `.claude/docs/specs/NNN-slug/tasks.md` a partir de
`.claude/docs/specs/TASKS-TEMPLATE.md` com uma lista ordenada de tarefas onde cada item:
- É pequeno o suficiente para revisar em um único diff (guia: < ~400 linhas).
- Tem um resultado verificável (arquivo criado, teste automatizado passando, critério de aceite
  específico da spec que ele satisfaz).
- Declara dependência explícita de outra tarefa quando existir (ex.: "depende da T2 — precisa do
  schema criado").
- Referencia a skill aplicável (`express-module-dev`, `prisma-database`, `auth-api`,
  `deploy-vps`).

Agrupe por camada seguindo a direção de dependência do projeto: schema/migration (Prisma) →
infrastructure (repositories/utils) → application (services) → routes/middleware → frontend →
testes automatizados → verificação manual dos critérios de aceite. Cada tarefa nasce com checkbox
`[ ]` não marcado.
