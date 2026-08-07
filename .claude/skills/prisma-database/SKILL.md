---
name: prisma-database
description: Modelagem de dados e acesso ao banco via Prisma ORM (PostgreSQL/Neon). Use SEMPRE que a tarefa envolver schema.prisma, migration, índice, relação ou query.
---

# Banco de dados (Prisma + PostgreSQL/Neon)

## Regra 0 — Fonte da verdade
Consulte https://www.prisma.io/docs antes de assumir sintaxe/comportamento — confirmar a versão
instalada (Prisma 7, `@prisma/adapter-pg`, driver adapter em vez do engine binário clássico).

## Convenções deste projeto

1. **Chave primária**: `Int @id @default(autoincrement())` — convenção já estabelecida em
   `Processos`/`Andamento`, manter para novos modelos (`User`, tokens). Diferente do projeto
   irmão (que usa UUID por exposição de URL pública) — aqui os ids não aparecem em URL pública
   (API consumida só pelo próprio frontend), então autoincrement é suficiente e mais simples.
2. **Nomes de coluna em `snake_case`** via `@map`, nomes de campo em `camelCase` no schema — já
   padrão (`numeroProcesso @map("numero_processo")`), manter.
3. **Nunca editar uma migration já aplicada em produção.** Mudança de schema = nova migration
   (`prisma migrate dev --name descricao_da_mudanca`), nunca editar o histórico em
   `backend/prisma/migrations/`.
4. **Índices**: em toda FK (`@@index([userId])`) e em toda coluna usada em busca/filtro frequente
   (ex.: `email` em `User`, já `@unique` o que já cria índice).
5. **Cascade delete** (`onDelete: Cascade`) quando o filho não faz sentido sem o pai — já usado em
   `Andamento.processos` (apagar processo apaga andamentos), mesmo padrão para `User` → `Processos`
   (apagar usuário apaga os processos dele, dado que são dados pessoais dele).
6. **Nunca SQL cru concatenado.** Se precisar de `$queryRaw`, usar template tagged
   (`prisma.$queryRaw\`SELECT ... WHERE id = ${id}\``), nunca concatenação de string.
7. **Migration em produção**: `prisma migrate deploy` já roda automaticamente no `CMD` do
   `backend/Dockerfile` a cada deploy do Render — nunca rodar migration manualmente direto no
   Neon fora desse fluxo, para manter o histórico de migrations como fonte da verdade.

## Checklist de conclusão (Definition of Done)
- [ ] Migration gerada via `prisma migrate dev`, nunca editada à mão depois de aplicada
- [ ] FK nova tem `@@index`
- [ ] `onDelete` explícito em toda relação obrigatória (Cascade ou Restrict, nunca implícito)
- [ ] Nenhuma query com SQL cru concatenado
- [ ] `npx prisma validate` sem erro

## Anti-padrões (rejeitar em code review)
- Editar arquivo dentro de `backend/prisma/migrations/*/migration.sql` já aplicado
- Coluna sem índice usada em `where`/`orderBy` de query frequente
- SQL raw com concatenação de string (`$queryRawUnsafe` com input do usuário)
- Rodar `prisma db push` em produção (só `migrate deploy`, para manter histórico)
