Crie o plano técnico (fase 2 do fluxo SDD) para a spec: $ARGUMENTS

Pré-condição: a spec correspondente em `.claude/docs/specs/NNN-slug/spec.md` deve existir com
status `aprovada`. Se não existir ou ainda estiver `rascunho`, pare e peça para rodar/concluir
`/specify` primeiro — não invente requisitos que não estão na spec.

Passos:
1. Releia `spec.md` e os critérios de aceite.
2. Consulte as skills relevantes (`express-module-dev`, `prisma-database`, `auth-api`,
   `deploy-vps` conforme o caso) e confirme comportamento na documentação oficial
   antes de propor a solução técnica.
3. Preencha `.claude/docs/specs/NNN-slug/plan.md` a partir de
   `.claude/docs/specs/PLAN-TEMPLATE.md`: camadas afetadas (`routes`/`controllers`/`services`/
   `repositories`), modelo de dados (Prisma), integrações, observabilidade, trade-offs da solução
   escolhida.
4. Se a decisão técnica for arquiteturalmente relevante (ex.: nova forma de integração externa,
   mudança de padrão de dados), registre também um ADR via `/adr` e referencie-o no `plan.md`.

Não escreva código nesta fase. Próximo passo depois de aprovado: `/tasks`.
