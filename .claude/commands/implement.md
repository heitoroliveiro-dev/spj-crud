Execute as tarefas pendentes (fase 4 do fluxo SDD) para: $ARGUMENTS

Pré-condição: `.claude/docs/specs/NNN-slug/tasks.md` deve existir com itens não marcados.

Para cada tarefa pendente, na ordem declarada (respeitando dependências):
1. Implemente exatamente o que a tarefa descreve — sem expandir escopo além do `plan.md`.
2. Siga a skill referenciada na tarefa e o Definition of Done dela.
3. Nunca commite `.env` nem escreva segredo em código (hook `protect-env.sh` bloqueia edição de
   `.env`, mas não dependa só do hook — já parta sabendo disso).
4. Ao concluir a tarefa: rode o checklist de DoD da skill aplicável (lint, testes), marque `[x]`
   em `tasks.md`, e se for uma unidade de trabalho fechada, considere um commit atômico
   (Conventional Commits — ver `.claude/docs/context/conventions/git-conventions.md`).
5. Se encontrar um requisito ambíguo ou uma decisão não coberta pelo `plan.md`, pare e pergunte —
   não assuma.

Ao final de todas as tarefas, revise `spec.md` e confirme item a item que os critérios de aceite
foram satisfeitos. Se algum não foi, não marque a spec como `entregue`.
