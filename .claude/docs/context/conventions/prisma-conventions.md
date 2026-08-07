# Convenções — Prisma (resumo rápido)

Ver `.claude/skills/prisma-database/SKILL.md` para o detalhe completo — este arquivo é referência
rápida.

- PK: `Int @id @default(autoincrement())` (não UUID — ids nunca aparecem em URL pública neste
  projeto).
- Coluna em `snake_case` via `@map`, campo em `camelCase` no schema.
- Migration sempre via `prisma migrate dev --name descricao`, nunca editar histórico aplicado.
- Índice em toda FK e coluna de busca frequente.
- `onDelete: Cascade` quando o filho não existe sem o pai.
