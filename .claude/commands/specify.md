Crie uma especificação funcional (fase 1 do fluxo SDD) para: $ARGUMENTS

Passos:
1. Determine o próximo número sequencial `NNN` olhando `.claude/docs/specs/` e crie a pasta
   `.claude/docs/specs/NNN-slug-descritivo/`.
2. Antes de escrever, verifique se um recurso nativo do Express/React ou uma biblioteca
   consolidada da comunidade já resolve a necessidade — a spec deve propor a solução mais
   simples que atende ao requisito, e justificar qualquer implementação própria (ordem de
   preferência: recurso nativo do framework → biblioteca consolidada → implementação própria).
3. Preencha `spec.md` a partir de `.claude/docs/specs/SPEC-TEMPLATE.md`.

Regras de conteúdo:
- Foco em **o quê e por quê**, não em como implementar (nada de nome de tabela, rota ou
  componente aqui — isso é `plan.md`).
- Critérios de aceite verificáveis e testáveis por alguém não técnico.
- Confirme que os requisitos citados existem em `README.md` (raiz) — se for algo novo relevante,
  sinalize que o `README.md` também precisa ser atualizado.
- Status inicial: `rascunho`. Não avance para `/plan` até o status virar `aprovada`.
