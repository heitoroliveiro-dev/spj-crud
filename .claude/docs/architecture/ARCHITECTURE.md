# Arquitetura — SPJ

## Visão geral

```
Browser ── HTTPS ──> borda Caddy da VPS (spj.heitoroliveiro.dev)
                         ├── /*      → spj-frontend (nginx, React 19 + Vite estático)
                         └── /api/*  → spj-backend (Express 5, Docker)
                                          │  Prisma 7 (@prisma/adapter-pg)
                                          ▼
                                       spj-db (PostgreSQL 16, só rede interna)
```

Desde a spec 002 (ADR-0004) frontend e API ficam no mesmo domínio, atrás da borda Caddy da VPS, em
modo demonstração. A autenticação continua JWT Bearer no header `Authorization` (nunca cookie — ver
ADR-0002). Antes (ADR-0001, desligado): Vercel + Render + Neon, em domínios diferentes.

## Camadas do backend

```
routes → controllers → services → repositories → Prisma → PostgreSQL
```
Direção de dependência: uma camada só chama a camada imediatamente abaixo. `controllers` nunca
importam Prisma; `repositories` nunca lançam erro HTTP nem conhecem regra de negócio. Erros sobem
via `Error` com `.status`, capturados uniformemente por `middlewares/errorHandler.js`.

## Camadas do frontend

```
pages (estado local + chamada a services/api.js) → components (reutilizáveis) → context (estado global)
```
`services/api.js` é o único ponto de `fetch` da aplicação — centraliza tratamento de erro e (a
partir da feature `001`) o header `Authorization`.

## Limitações conhecidas (não hipotéticas — já vividas em produção)

- **Cold start do Render free tier**: o backend "dorme" após ~15 min de inatividade; a próxima
  requisição pode levar até ~50s para responder. Afeta o primeiro acesso do dia de qualquer
  usuário, e qualquer fluxo síncrono que dependa do backend responder rápido.
- **SMTP bloqueado no Render free tier** (desde set/2025): qualquer integração de e-mail
  transacional precisa ser via API HTTP de um provedor (Brevo), nunca SMTP direto.
- **Sem estado compartilhado entre instâncias**: rate limiting em memória (`Map` simples) zera a
  cada redeploy/restart — aceitável para o volume de tráfego atual, documentado como dívida
  técnica onde relevante.

## Ver também
`.claude/docs/architecture/adr/` — decisões arquiteturais registradas.
`.claude/docs/playbooks/deploy.md` — processo real de deploy.
