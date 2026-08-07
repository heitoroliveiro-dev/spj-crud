#!/usr/bin/env bash
# Bloqueia edição/criação de arquivos .env via ferramenta — segredo nunca deve ser escrito por aqui.
INPUT=$(cat)
FILE=$(echo "$INPUT" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/.*"file_path"[[:space:]]*:[[:space:]]*"\([^"]*\)"/\1/')
[ -z "$FILE" ] && exit 0
case "$FILE" in
  *.env.example)
    exit 0
    ;;
  *.env|*.env.*)
    echo "BLOQUEADO: '$FILE' é um arquivo de segredo — edite manualmente fora do Claude Code." >&2
    exit 2
    ;;
esac
exit 0
