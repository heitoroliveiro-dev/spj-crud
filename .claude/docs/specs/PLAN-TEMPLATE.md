# PLAN — [Título da spec correspondente]

- **Spec de origem**: `spec.md` (deve estar `aprovada`)
- **Status**: rascunho | aprovado | em desenvolvimento
- **Skills consultadas**:

Esta é a **fase 2 (como)** do fluxo SDD.

## 1. Solução técnica
### Camadas afetadas
`routes`/`controllers`/`services`/`repositories` (backend) e/ou `pages`/`components`/`context`
(frontend) — o que entra em cada uma.

### Modelo de dados
Entidades/campos novos ou alterados (Prisma), migrations necessárias, índices. Ver
`.claude/skills/prisma-database/SKILL.md`.

### Integrações
APIs externas consumidas, autenticação, idempotência. Ver `.claude/skills/auth-api/SKILL.md` ou
`deploy-render-vercel-neon/SKILL.md` quando aplicável.

### Observabilidade
Logs/métricas do que será entregue.

## 2. Trade-offs da solução escolhida
O que ganhamos, o que abrimos mão, dívida técnica assumida (se houver) e plano para ela.

## 3. Plano de implantação
Passos, rollback, impacto em produção (Render/Vercel/Neon já estão no ar — considerar).

## 4. ADR relacionada
Se esta decisão for arquiteturalmente relevante, link para
`.claude/docs/architecture/adr/ADR-XXXX-*.md`.

---
Próximo passo depois de `Status: aprovado` → `/tasks` gera `tasks.md` nesta mesma pasta.
