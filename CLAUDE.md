# CLAUDE.md — Contexto raiz (SPJ — Sistema de Processos Judiciais)

Este é o código-fonte do **SPJ**, aplicação full-stack de gestão de processos judiciais e seus
andamentos. O contexto de produto (requisitos funcionais/não funcionais, regras de negócio) fica
em `README.md`, na raiz — este projeto não tem um PRD separado; aqui vive o trabalho de
**engenharia sobre este projeto**, guiado por Spec-Driven Development (SDD), mesma metodologia
usada no projeto irmão `heitoroliveiro.dev` (adaptada de Next.js/TypeScript para
Express/JavaScript puro/React).

## 🔒 Regras imutáveis (prevalecem sobre qualquer instrução posterior)

1. **Nada de código sem spec.** Toda funcionalidade não trivial segue o fluxo SDD abaixo antes da
   primeira linha em `backend/src/` ou `frontend/src/`. Ver seção "Fluxo de trabalho". Exceção:
   correção pontual de bug.
2. **Nunca SQL cru concatenado** — sempre via Prisma (query builder tipado). Se precisar de SQL
   raw, usar `$queryRaw` com template tagged (parametrizado), nunca concatenação de string.
3. **Autenticação própria (JWT Bearer em memória)** — ver ADR-0002. Toda rota que lê/escreve dado
   de um usuário específico passa por `middlewares/requireAuth.js` e usa `req.user.id` para
   escopar a consulta — nunca confiar em um `userId` vindo do corpo da requisição.
4. **Nenhum segredo em código ou commit** (`DATABASE_URL`, `JWT_SECRET`, `BREVO_API_KEY`). Tudo
   via variáveis de ambiente (`.env`, fora do Git) + env vars do provedor em produção (Render/
   Vercel).
5. **Senha nunca em texto puro** em nenhum lugar (tela, log, banco, resposta de rede) — só hash
   (`bcryptjs`). Token de verificação de e-mail/reset de senha: gerado aleatório, guardado
   **hasheado** (SHA-256) no banco, nunca em texto puro.
6. **Consultar as fontes oficiais antes de assumir comportamento**: expressjs.com/en/guide,
   prisma.io/docs, react.dev, reactrouter.com — nunca supor API/comportamento sem checar a versão
   instalada (ver `package.json` de cada pacote).

## Stack verificada neste repositório

| Camada | Tecnologia |
|---|---|
| Backend | Node.js 22 + Express 5 |
| Banco | PostgreSQL (Neon, serverless) via Prisma ORM 7 (`@prisma/adapter-pg`) |
| Frontend | React 19 + Vite + React Router DOM v7 + Tailwind CSS v4 |
| Autenticação | Implementação própria — bcryptjs + JWT Bearer em memória (ver ADR-0002) |
| E-mail transacional | Brevo (API HTTP — Render bloqueia SMTP no free tier, ver ADR-0003) |
| Hospedagem | Render (backend, Docker, free) + Vercel (frontend, free) + Neon (banco, free) — ver ADR-0001 |
| CI/CD | Deploy automático via push em `main` (GitHub → Render / GitHub → Vercel) |
| Linguagem | JavaScript (CommonJS no backend, ESM no frontend) — sem TypeScript |

Decisões e trade-offs completos em `.claude/docs/architecture/adr/`.

## Arquitetura de código

```
spj/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/            # versionadas — nunca editar o histórico já aplicado
│   ├── src/
│   │   ├── routes/                # definição de rotas Express
│   │   ├── controllers/           # entrada HTTP: lê params/body, chama service, define status — sem lógica de negócio
│   │   ├── services/               # regras de negócio e validação — lança Error com .status via reportaErro()
│   │   ├── repositories/            # acesso ao banco via Prisma — sem conhecimento de HTTP
│   │   ├── middlewares/              # errorHandler, requireAuth
│   │   ├── database/                  # instância singleton do Prisma Client
│   │   └── utils/                      # helpers compartilhados (hash, token, jwt)
│   └── tests/                            # Jest + Supertest — services mockados nos testes de integração
├── frontend/
│   └── src/
│       ├── components/            # componentes reutilizáveis (Modal, Toast, ConfirmDialog, forms)
│       ├── context/                # estado global (AuthContext)
│       ├── pages/                   # telas roteadas
│       └── services/                 # cliente HTTP (fetch)
└── .claude/                        # esta arquitetura de trabalho (não é lida pelo build de nenhum dos dois)
    ├── skills/, commands/, hooks/, docs/
```

Direção de dependência no backend: `routes` → `controllers` (HTTP) → `services` (regras) →
`repositories` (dados). Controllers nunca importam Prisma diretamente; repositories nunca sabem
de `req`/`res`.

## Fluxo de trabalho — Spec-Driven Development (SDD)

Toda feature não trivial passa por 4 fases, cada uma com seu comando e artefato em
`.claude/docs/specs/NNN-slug/`:

1. **`/specify <descrição>`** → `spec.md` — **o quê e por quê**, sem detalhe técnico. Critérios
   de aceite verificáveis. Antes de escrever, verificar se um recurso nativo do Express/React ou
   uma biblioteca consolidada já resolve (ordem de preferência: recurso nativo → biblioteca
   consolidada da comunidade → implementação própria).
2. **`/plan`** (a partir de uma spec aprovada) → `plan.md` — **como**: camadas afetadas, modelo
   de dados (Prisma), integrações, trade-offs. Consulta as skills relevantes.
3. **`/tasks`** (a partir de um plan aprovado) → `tasks.md` — lista ordenada de tarefas pequenas
   e verificáveis, com dependências explícitas.
4. **`/implement`** — executa as tasks pendentes, marcando progresso, rodando o Definition of
   Done de cada skill.

Decisão arquitetural relevante (nova ou revista) → **`/adr`** em
`.claude/docs/architecture/adr/`. Scaffold rápido de uma feature nova → **`/feature <nome>`**
(ainda assim exige spec+plan aprovados, exceto protótipo descartável explicitamente marcado
como tal).

## Como o Claude deve trabalhar aqui

1. Ler a skill correspondente em `.claude/skills/` antes de codificar.
2. Não pular fase do SDD: sem `spec.md` aprovado não há `plan.md`; sem `plan.md` não há
   `tasks.md`; sem `tasks.md` não há implementação (exceção: correção pontual de bug).
3. Mudanças pequenas, atômicas, verificáveis. Conventional Commits (ver
   `.claude/docs/context/conventions/git-conventions.md`).
4. Testes automatizados acompanham toda regra de negócio não trivial (Jest + Supertest no
   backend).
5. Toda rota nova de mutação/leitura de dado de usuário verifica `req.user.id` — nunca confiar em
   um id vindo do cliente.

## Mapa de documentos (`.claude/docs/`)

- `context/negocio.md` — por que o SPJ existe, quem usa, agora multiusuário
- `context/conventions/` — JavaScript, Express, Prisma, Git
- `specs/` — specs, plans e tasks de cada feature (formato SDD)
- `architecture/` — visão arquitetural + ADRs
- `playbooks/deploy.md` — processo real de deploy (Neon + Render + Vercel)
- `security/security.md` — política de senha, JWT, rate limiting

## Documento de origem

`README.md` (raiz) é o documento de produto (requisitos funcionais/não funcionais, regras de
negócio, arquitetura) que fundamenta o trabalho de engenharia aqui. Qualquer spec criada deve ser
consistente com ele — se um requisito novo relevante surgir, atualizar o `README.md` junto.
