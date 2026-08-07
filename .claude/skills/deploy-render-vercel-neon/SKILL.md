---
name: deploy-render-vercel-neon
description: Infraestrutura e deploy gratuito do SPJ — Render (backend Docker), Vercel (frontend estático), Neon (Postgres serverless). Use SEMPRE que a tarefa envolver Dockerfile, variável de ambiente de produção, configuração de deploy ou troubleshooting de CORS/cold start.
---

# Infraestrutura e Deploy (Render + Vercel + Neon, free tier)

## Regra 0 — Fonte da verdade
Processo real de deploy documentado em `.claude/docs/playbooks/deploy.md` — sempre atualizar esse
playbook se o processo mudar. Decisão de hospedagem registrada em
`.claude/docs/architecture/adr/ADR-0001-hospedagem-render-vercel-neon.md`.

## Visão geral

```
Browser ── HTTPS ──> Vercel (React/Vite, estático)  ── fetch (CORS) ──> Render (Express, Docker)
                                                                                │
                                                                                └──> Neon (Postgres, driver adapter)
```

Frontend e backend são **domínios diferentes** (`spj-crud.vercel.app` /
`spj-crud-backend.onrender.com`) — toda decisão de auth/sessão precisa considerar isso (ver skill
`auth-api`).

## Padrões obrigatórios

1. **CORS explícito**: `cors({ origin: process.env.FRONTEND_URL, allowedHeaders: [...] })` no
   backend — nunca `origin: '*'` em produção.
2. **Variáveis de ambiente via secrets do provedor** — nunca `.env` commitado. No Render:
   `DATABASE_URL`, `NODE_ENV`, `FRONTEND_URL`, `PUBLIC_BACKEND_URL`, `JWT_SECRET`,
   `BREVO_API_KEY`, `EMAIL_FROM`. Na Vercel: `VITE_API_BASE` (build-time — Vite embute no bundle,
   mudar exige redeploy).
3. **Render free tier**: o serviço "dorme" após ~15 min de inatividade, primeira requisição
   depois disso demora até ~50s (cold start) — considerar isso em qualquer fluxo síncrono
   (ex.: primeiro login do dia, teste manual, rota de refresh de token se um dia existir).
4. **Render free tier bloqueia SMTP** (portas 25/465/587) desde set/2025 — qualquer integração de
   e-mail transacional precisa ser via API HTTP (ex.: Brevo), nunca SMTP direto.
5. **Vercel monorepo**: o root directory precisa ser explicitamente `frontend/` (auto-detecção do
   preset "Services" tenta subir frontend E backend juntos, o que quebra o build — trocar preset
   para "Vite" manualmente e apontar Root Directory para `frontend`).
6. **Migration em deploy**: `backend/Dockerfile` já roda `npx prisma generate && npx prisma
   migrate deploy && npm start` no `CMD` — toda migration nova é aplicada automaticamente no
   próximo deploy do Render, sem passo manual.
7. **Deploy automático**: push em `main` no GitHub dispara redeploy tanto no Render quanto na
   Vercel — não há passo manual de deploy em uso normal.

## Checklist de conclusão (Definition of Done)
- [ ] `docker build` local do `backend/Dockerfile` passa (testar antes de depender de dependência nativa nova)
- [ ] Variável de ambiente nova documentada em `.claude/docs/playbooks/deploy.md` e configurada no Render/Vercel
- [ ] CORS testado com a origem real de produção (não só `localhost`)
- [ ] Se envolve e-mail: confirmado que o provedor usa API HTTP, não SMTP
- [ ] Testado em produção considerando o cold start do Render (não só com o serviço já "acordado")

## Anti-padrões (rejeitar em code review)
- Segredo de produção no Dockerfile ou no repositório
- `origin: '*'` no CORS de produção
- Integração de e-mail via SMTP (não funciona no Render free tier)
- Assumir que a Vercel detecta root directory sozinha em monorepo sem confirmar
