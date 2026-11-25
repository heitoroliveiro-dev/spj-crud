# Playbook — Deploy do SPJ

Produção desde 2026-11-25 (spec 002, ADR-0004): **VPS Hostinger KVM 2 (`189.24.14.41`)**, modo
demonstração, em https://spj.heitoroliveiro.dev. Render, Vercel e Neon foram desligados.

## Publicar uma versão

Na máquina do Heitor, com tudo commitado:

```bash
deploy/deploy.sh
```

O script: cria `/opt/spj-crud/.env` na primeira vez (senhas aleatórias geradas na VPS) → build de
`spj-backend:<commit>` e `spj-frontend:<commit>` → `docker save | ssh docker load` → copia o compose
→ `docker compose up -d` (o backend roda `prisma migrate deploy` ao subir) → `caddy validate` e
`caddy reload` do `spj.caddy` (restaura o anterior se falhar) → instala/ativa o timer de reset →
apaga imagens além das 3 últimas.

## Reset da demonstração

- Automático todo dia às 04:00 (`spj-reset.timer`).
- Manual: `ssh root@189.24.14.41 systemctl start spj-reset.service`.
- Log: `journalctl -u spj-reset.service -n 20`.

## Rollback

```bash
ssh root@189.24.14.41
docker images spj-backend            # versões disponíveis (as 3 últimas)
cd /opt/spj-crud && sed -i 's/^TAG=.*/TAG=<anterior>/' .env && docker compose up -d
```

## Verificação

- `https://spj.heitoroliveiro.dev` 200; `POST /api/auth/signup` → 403; login com a conta de
  demonstração.
- `docker ps --filter name=spj` → backend, frontend e db saudáveis; db sem porta publicada.
- Outros sites da VPS (heitoroliveiro.dev, CigMenu, CRM) respondendo como antes.

## Cuidados

- A borda serve outros projetos (um com cliente real): nunca reiniciar `edge-caddy-1` nem editar
  arquivos de outros projetos em `/opt/edge/config/sites/`.
- Logs: `docker compose -f /opt/spj-crud/docker-compose.yml logs --tail 100 backend`.
