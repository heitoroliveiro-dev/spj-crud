# PLAN — SPJ em modo demonstração na VPS

- **Spec**: `spec.md` (aprovada) · **Status**: aprovado (2026-11-25)

## Backend
- `DEMO_MODE=true` (env): middleware `demoGuard` nas rotas `POST /api/auth/signup` e
  `POST /api/auth/forgot-password` → 403 `{ error: "Indisponível na demonstração" }`.
- `backend/scripts/reset-demo.js` (Prisma, sem SQL cru): numa transação, apaga andamentos,
  processos, tokens e usuários; cria o usuário `DEMO_EMAIL` com `DEMO_PASSWORD` (hash bcryptjs,
  `emailVerifiedAt` preenchido) e ~8 processos fictícios com andamentos. Falha se `DEMO_MODE` não
  estiver ligado (proteção contra rodar no banco errado).

## Frontend
- Build args `VITE_DEMO_EMAIL` e `VITE_DEMO_PASSWORD`. Com os dois preenchidos, a tela de login
  mostra o quadro da conta (com botão "Usar conta de demonstração") e esconde os links de
  cadastro e de "esqueci minha senha".

## Deploy (`deploy/`)
- `docker-compose.prod.yml`: `db` (Postgres 16, sem `ports`, rede `interna`), `backend` e
  `frontend` (redes `interna` + `edge` externa, aliases `spj-api` e `spj-web`), `mem_limit`,
  logs 10 MB × 5. Variáveis em `/opt/spj-crud/.env` (fora do Git).
- `spj.caddy` → `/opt/edge/config/sites/`: `/api/*` → `spj-api:3001`; resto → `spj-web:80`.
- `deploy.sh`: build local das duas imagens, envio por SSH (`docker save | docker load`),
  `compose up`, `caddy validate` + `reload` (sem reiniciar a borda).
- `spj-reset.service` + `spj-reset.timer` (systemd, 04:00 America/Sao_Paulo): roda o reset no
  container do backend.
