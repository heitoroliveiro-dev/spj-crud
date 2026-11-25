# .claude — Arquitetura de trabalho (Spec-Driven Development)

Esta pasta **não faz parte do backend nem do frontend publicados** — nem o build do Express, nem
o build do Vite a leem. É só a metodologia usada para chegar a mudanças em `backend/src/` e
`frontend/src/` de forma rastreável, com decisões documentadas antes do código. Mesma metodologia
do projeto irmão `heitoroliveiro.dev`, adaptada de Next.js/TypeScript para Express/JavaScript
puro/React.

## Estrutura
```
CLAUDE.md (na raiz do projeto)  # contexto lido automaticamente pelo Claude Code
.claude/
  settings.json          # liga os hooks abaixo
  hooks/                 # protege .env, roda lint/checagem de sintaxe, checa segredos, lembrete de contexto
  skills/                 # auth-api · express-module-dev · prisma-database · deploy-vps
  commands/               # /specify /plan /tasks /implement /feature /adr
  docs/
    context/              # negocio.md, conventions/
    specs/                 # SPEC/PLAN/TASKS-TEMPLATE.md + specs reais em NNN-slug/
    architecture/           # ARCHITECTURE.md + adr/
    playbooks/              # deploy.md
    security/                # security.md
```

## Fluxo Spec-Driven Development

```
/specify <feature>  ──►  docs/specs/NNN-slug/spec.md    (o quê e por quê — sem código)
        │  status: aprovada
        ▼
/plan               ──►  docs/specs/NNN-slug/plan.md    (como — camadas, modelo de dados, integrações)
        │  status: aprovado
        ▼
/tasks              ──►  docs/specs/NNN-slug/tasks.md   (lista ordenada, verificável)
        │
        ▼
/implement          ──►  código em backend/src ou frontend/src, tasks marcadas [x], DoD de cada skill cumprido
```

Regra de ouro: não pular fase para funcionalidade não trivial. Correção pontual de bug é a única
exceção explícita.

## Comandos auxiliares
- `/feature <nome>` — scaffold rápido de uma feature/página (ainda exige spec+plan, salvo
  protótipo marcado como tal)
- `/adr <decisão>` — registra decisão arquitetural em `docs/architecture/adr/`

## Exemplo de referência
`docs/specs/001-autenticacao-multiusuario/` tem `spec.md` + `plan.md` + `tasks.md` como primeira
feature real aprovada por este fluxo — usar como modelo de nível de detalhe esperado nas
próximas specs.

## Ver também
`CLAUDE.md` na raiz do projeto — regras imutáveis e contexto que o Claude Code carrega
automaticamente. `README.md` na raiz — requisitos funcionais/não funcionais e regras de negócio
que fundamentam o trabalho de engenharia daqui.
