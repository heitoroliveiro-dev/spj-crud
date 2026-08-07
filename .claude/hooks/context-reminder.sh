#!/usr/bin/env bash
# Injeta lembrete das regras imutáveis e do fluxo SDD a cada prompt do usuário.
cat << 'MSG'
[LEMBRETE DO PROJETO]
- Stack: Node 22 / Express 5 / PostgreSQL (Neon) + Prisma 7 / React 19 + Vite / JavaScript puro.
- Deploy: Render (backend, Docker) + Vercel (frontend) + Neon (banco) — free tier, ver playbooks/deploy.md.
- Auth própria: bcryptjs + JWT Bearer em memória (sem cookie). Toda rota de dado de usuário passa por requireAuth e escopa por req.user.id.
- Nunca segredo em código/commit. Senha e token de verificação/reset nunca em texto puro.
- Fluxo SDD: /specify -> spec.md, /plan -> plan.md, /tasks -> tasks.md, /implement. Não pular fase para código não trivial.
MSG
exit 0
