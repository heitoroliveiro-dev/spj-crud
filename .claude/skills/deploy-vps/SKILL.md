---
name: deploy-vps
description: Infraestrutura e deploy do SPJ na VPS Hostinger KVM 2 do Heitor (modo demonstração atrás da borda Caddy compartilhada). Use SEMPRE que a tarefa envolver Dockerfile, compose de produção, variável de ambiente de produção, deploy, reset da demonstração ou troubleshooting de proxy/CORS.
---

# Infraestrutura e Deploy (VPS + borda Caddy)

Decisão em `.claude/docs/architecture/adr/ADR-0004-hospedagem-vps-modo-demonstracao.md` (substitui a
ADR-0001, Render + Vercel + Neon, desligados em 2026-11-25). Passo a passo em
`.claude/docs/playbooks/deploy.md`.

## Como está montado
- `/opt/spj-crud` na VPS: `docker-compose.yml` (cópia de `deploy/docker-compose.prod.yml`) e `.env`
  (`chmod 600`, gerado na VPS: `TAG`, `POSTGRES_PASSWORD`, `JWT_SECRET`, `DEMO_EMAIL`,
  `DEMO_PASSWORD`).
- Serviços: `db` (só rede interna, sem porta), `backend` (alias `spj-api` na rede `edge`),
  `frontend` (alias `spj-web`). Limites de memória e logs com rotação.
- Borda: `/opt/edge/config/sites/spj.caddy` — `/api/*` → backend, resto → frontend.
- Reset diário: `spj-reset.timer` às 04:00 → `node scripts/reset-demo.js` no backend.

## Padrões obrigatórios
1. Nunca reiniciar a borda (`edge-caddy-1`): ela serve outros projetos, um deles com cliente real.
   Só `caddy validate` e depois `caddy reload` (o `deploy.sh` já faz e restaura se falhar).
2. Nenhum segredo no repositório nem na imagem: tudo no `.env` da VPS.
3. `TRUST_PROXY=1` em produção (um proxy na frente), para o limite de login usar o IP real.
4. `reset-demo.js` só roda com `DEMO_MODE=true`.

## Definition of Done
- [ ] `deploy/deploy.sh` terminou e `https://spj.heitoroliveiro.dev` responde.
- [ ] `POST /api/auth/signup` → 403 na demonstração; login com a conta de demonstração funciona.
- [ ] Outros sites da VPS respondendo igual antes e depois.
