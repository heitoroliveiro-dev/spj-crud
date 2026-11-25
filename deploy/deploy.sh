#!/usr/bin/env bash
# Publica o SPJ em modo demonstração na VPS (spec 002, ADR-0004). Roda na máquina do Heitor.
# Build local das duas imagens → docker save | ssh docker load → compose up → caddy validate/reload
# (sem reiniciar a borda, que serve outros projetos) → timer de reset diário.
# Na primeira vez cria /opt/spj-crud/.env na VPS com senhas aleatórias geradas lá (nunca saem dela,
# exceto e-mail e senha da demonstração, que são públicos e vão para o build do frontend).
set -euo pipefail

VPS="${VPS:-root@189.24.14.41}"
APP=/opt/spj-crud
SITE=/opt/edge/config/sites/spj.caddy
KEEP=3

cd "$(dirname "$0")/.."
[ -z "$(git status --porcelain)" ] || { echo "Há mudanças não commitadas." >&2; exit 1; }
TAG="$(git rev-parse --short HEAD)"

echo "==> .env da VPS"
ssh "$VPS" "set -e; install -d -m 750 $APP
  if [ ! -f $APP/.env ]; then
    umask 077
    {
      echo POSTGRES_PASSWORD=\$(openssl rand -hex 24)
      echo JWT_SECRET=\$(openssl rand -hex 48)
      echo DEMO_EMAIL=demo@spj.example
      echo DEMO_PASSWORD=demo-\$(openssl rand -hex 4)
    } > $APP/.env
  fi
  sed -i '/^TAG=/d' $APP/.env && echo TAG=$TAG >> $APP/.env"
DEMO_EMAIL="$(ssh "$VPS" "grep ^DEMO_EMAIL= $APP/.env | cut -d= -f2-")"
DEMO_PASSWORD="$(ssh "$VPS" "grep ^DEMO_PASSWORD= $APP/.env | cut -d= -f2-")"

echo "==> build spj-backend:$TAG e spj-frontend:$TAG"
docker build -q -t "spj-backend:$TAG" backend
docker build -q -t "spj-frontend:$TAG" \
  --build-arg VITE_API_BASE=https://spj.heitoroliveiro.dev \
  --build-arg VITE_DEMO_EMAIL="$DEMO_EMAIL" \
  --build-arg VITE_DEMO_PASSWORD="$DEMO_PASSWORD" frontend

echo "==> enviando as imagens"
docker save "spj-backend:$TAG" "spj-frontend:$TAG" | gzip | ssh "$VPS" 'gunzip | docker load'

echo "==> compose"
scp -q deploy/docker-compose.prod.yml "$VPS:$APP/docker-compose.yml"
ssh "$VPS" "cd $APP && docker compose up -d"

echo "==> borda: validar e recarregar (sem reiniciar)"
scp -q deploy/spj.caddy "$VPS:$SITE.new"
ssh "$VPS" "set -e
  cp -a $SITE $SITE.bak 2>/dev/null || true
  mv $SITE.new $SITE
  if ! docker exec edge-caddy-1 caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile >/dev/null; then
    echo 'Caddyfile inválido; restaurando.' >&2
    if [ -f $SITE.bak ]; then mv $SITE.bak $SITE; else rm -f $SITE; fi
    exit 1
  fi
  docker exec edge-caddy-1 caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile
  rm -f $SITE.bak"

echo "==> timer de reset diário"
scp -q deploy/spj-reset.service deploy/spj-reset.timer "$VPS:/etc/systemd/system/"
ssh "$VPS" "systemctl daemon-reload && systemctl enable --now spj-reset.timer >/dev/null"

echo "==> limpando imagens antigas (mantém $KEEP)"
for img in spj-backend spj-frontend; do
  ssh "$VPS" "docker images $img --format '{{.CreatedAt}}\t{{.Repository}}:{{.Tag}}' | sort -r | tail -n +$((KEEP + 1)) | cut -f2 | xargs -r docker rmi" || true
done
echo "Publicado: https://spj.heitoroliveiro.dev ($TAG)"
