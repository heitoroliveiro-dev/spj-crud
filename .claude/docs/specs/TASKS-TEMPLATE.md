# TASKS — [Título da spec correspondente]

- **Plan de origem**: `plan.md` (deve estar `aprovado`)

Esta é a **fase 3** do fluxo SDD: quebra do plano em tarefas pequenas, ordenadas e verificáveis.
`/implement` executa esta lista em ordem, respeitando dependências.

## Schema / migration
- [ ] T1 — [descrição] (`prisma-database`)

## Infrastructure (repositories/utils)
- [ ] T2 — [descrição], depende de T1 (`prisma-database`)

## Application (services)
- [ ] T3 — [descrição], depende de T2 (`express-module-dev` ou `auth-api`)

## Routes/middleware
- [ ] T4 — [descrição], depende de T3 (`express-module-dev` ou `auth-api`)

## Frontend
- [ ] T5 — [descrição], depende de T4 (`express-module-dev`)

## Testes automatizados
- [ ] T6 — [descrição] cobrindo a regra de negócio principal

## Verificação dos critérios de aceite da spec
- [ ] T7 — validar cada item da seção 5 de `spec.md` manualmente
