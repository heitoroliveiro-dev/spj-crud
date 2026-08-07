# ADR-0001 — Hospedagem gratuita: Render (backend) + Vercel (frontend) + Neon (banco)

- **Status**: aceita (retroativa — decisão já implementada antes da adoção formal de ADRs neste projeto)
- **Data**: 2026-08-06 · **Autores**: Heitor Oliveiro + Claude
- **Spec/Plan relacionados**: nenhuma spec formal — decisão de infraestrutura anterior à feature `001`

## Contexto
O SPJ precisava ir para produção sem custo. O `docker-compose.yml` original assume três serviços
(`db`, `backend`, `frontend`) rodando juntos, mas não há VPS disponível para hospedar isso como
no projeto irmão `heitoroliveiro.dev`. O usuário já tinha conta ativa em Render e Vercel — reuso
de conta existente era preferível a criar contas novas em provedores desconhecidos.

## Alternativas consideradas
1. **Tudo no Render** (backend + frontend + Postgres) — um único painel, mas o Postgres free do
   Render expira em 30 dias e precisa ser recriado manualmente — inaceitável para um banco que
   deveria ser permanente.
2. **Railway** — deixou de ter tier gratuito indefinido (hoje só crédito único de trial para
   contas novas, depois cobra mensalidade mínima) — não atende ao requisito de gratuidade
   permanente.
3. **Neon (banco) + Render (backend) + Vercel (frontend)** — três provedores especializados, cada
   um com free tier permanente sem cartão de crédito: Neon (Postgres serverless, 0.5GB, sem
   expiração), Render (Web Service Docker gratuito, com cold start), Vercel (Hobby, projetos
   estáticos ilimitados). Mais peças móveis (3 paineis, 3 CORS/env var a manter em sincronia),
   mas nenhuma delas expira ou precisa recriação manual.

## Decisão
Neon + Render + Vercel. Custo operacional de mais uma peça (manter `FRONTEND_URL`/`VITE_API_BASE`
sincronizados entre os três painéis) aceito em troca de gratuidade permanente sem expiração de
nenhum componente.

## Consequências
Positivas: custo zero permanente, reaproveita contas já existentes do usuário, cada provedor é
o melhor da categoria dele (Neon para Postgres serverless, Vercel para estático, Render para
container Docker de longa duração). Negativas: cold start do Render (backend dorme após 15 min
de inatividade — ver `ARCHITECTURE.md`), SMTP bloqueado no Render free tier (relevante para
qualquer feature futura de e-mail — ver ADR-0003), deploy em 3 painéis distintos em vez de um
único `docker compose up` (documentado em `.claude/docs/playbooks/deploy.md` para não depender de
memória de como foi feito da primeira vez).
