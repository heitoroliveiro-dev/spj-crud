#!/usr/bin/env bash
# Alerta (não bloqueia) se o arquivo editado parece conter segredo em texto puro.
INPUT=$(cat)
FILE=$(echo "$INPUT" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/.*"file_path"[[:space:]]*:[[:space:]]*"\([^"]*\)"/\1/')
[ -z "$FILE" ] && exit 0
[ -f "$FILE" ] || exit 0
if grep -Eq '(DATABASE_URL|JWT_SECRET|BREVO_API_KEY|API_KEY|SECRET|PASSWORD)[[:space:]]*=[[:space:]]*["'"'"'][A-Za-z0-9]' "$FILE" 2>/dev/null; then
  echo "AVISO: '$FILE' parece conter um segredo em texto puro. Confirme que não deveria estar em .env." >&2
fi
exit 0
