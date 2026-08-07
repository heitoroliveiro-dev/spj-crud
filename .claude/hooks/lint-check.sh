#!/usr/bin/env bash
# Roda checagem leve após edição de arquivo JS/JSX. Não falha a edição (apenas avisa) —
# o gate real de qualidade é o Definition of Done da task.
INPUT=$(cat)
FILE=$(echo "$INPUT" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/.*"file_path"[[:space:]]*:[[:space:]]*"\([^"]*\)"/\1/')
case "$FILE" in
  */frontend/*.jsx|*/frontend/*.js)
    if [ -f frontend/package.json ]; then
      (cd frontend && npx eslint "$(realpath --relative-to=frontend "$FILE" 2>/dev/null)" 2>&1 | head -20)
    fi
    ;;
  */backend/*.js)
    node --check "$FILE" 2>&1 | head -20
    ;;
esac
exit 0
