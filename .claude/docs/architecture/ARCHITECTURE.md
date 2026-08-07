# Arquitetura — SPJ

## Visão geral

```
Browser ── HTTPS ──> Vercel (React 19 + Vite, estático)
                              │  fetch, JSON, CORS
                              ▼
                      Render (Express 5, Docker, free)
                              │  Prisma 7 (@prisma/adapter-pg)
                              ▼
                      Neon (PostgreSQL serverless, free)
```

Frontend e backend são publicados em domínios diferentes — não há proxy reverso unindo os dois.
Toda comunicação passa por CORS explícito e, a partir da feature `001`, por JWT Bearer no header
`Authorization` (nunca cookie — ver ADR-0002).

## Camadas do backend

```
routes → controllers → services → repositories → Prisma → Neon
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
