# SPJ - Sistema de Processos Judiciais

O SPJ é uma aplicação full-stack para gestão de processos judiciais e seus andamentos. O projeto foi desenvolvido como teste técnico, priorizando arquitetura simples, separação de responsabilidades, validações essenciais, persistência relacional e execução completa com Docker Compose.

A aplicação permite cadastrar processos, consultar detalhes, registrar andamentos, editar informações e excluir registros com integridade entre processo e andamento. É **multiusuário**: cada pessoa cria sua própria conta (com confirmação de e-mail obrigatória) e só acessa os processos/andamentos que ela mesma criou.

**Em produção (demonstração)**: [spj.heitoroliveiro.dev](https://spj.heitoroliveiro.dev) — conta de teste na tela de login, dados restaurados todo dia às 4h (spec 002, ADR-0004). Deploy: `deploy/deploy.sh`.

## Requisitos funcionais

| Código | Requisito |
| --- | --- |
| RF01 | Cadastrar processos judiciais |
| RF02 | Listar processos cadastrados |
| RF03 | Buscar detalhes de um processo |
| RF04 | Editar processos |
| RF05 | Excluir processos |
| RF06 | Cadastrar andamentos vinculados a um processo |
| RF07 | Listar andamentos de um processo |
| RF08 | Editar andamentos |
| RF09 | Excluir andamentos |
| RF10 | Exibir mensagem específica ao criar processo de MG |
| RF11 | Pesquisar processos por número, cliente, advogado ou UF |
| RF12 | Cadastrar conta com e-mail e senha |
| RF13 | Confirmar e-mail via link recebido antes de permitir o primeiro login |
| RF14 | Entrar com e-mail e senha |
| RF15 | Solicitar redefinição de senha por e-mail |
| RF16 | Redefinir senha a partir de um link recebido por e-mail |
| RF17 | Sair da conta (logout) |
| RF18 | Isolar processos e andamentos por conta — cada usuário só acessa o que criou |

## Requisitos não funcionais

| Código | Requisito |
| --- | --- |
| RNF01 | Executar frontend, backend e banco com `docker compose up --build` |
| RNF02 | Persistir dados em PostgreSQL |
| RNF03 | Usar Prisma ORM para modelagem, migration e acesso ao banco |
| RNF04 | Aplicar exclusão em cascata dos andamentos ao excluir um processo |
| RNF05 | Separar backend em rotas, controllers, services e repositories |
| RNF06 | Exibir feedbacks de sucesso e erro no frontend |
| RNF07 | Validar dados principais antes da persistência |
| RNF08 | Servir o frontend em container Nginx |
| RNF09 | Documentar execução, arquitetura e decisões principais |
| RNF10 | Nunca armazenar senha ou token de verificação/reset em texto puro |
| RNF11 | Limitar tentativas de signup/login/forgot-password por IP (rate limiting) |
| RNF12 | Rodar em produção como demonstração pública na VPS do Heitor (desde a spec 002; antes, free tier Render + Vercel + Neon) |

## Regras de negócio implementadas

- Processo deve possuir número, data de abertura, descrição, cliente, advogado e UF.
- Número do processo deve ser único **por usuário** — duas contas diferentes podem cadastrar o mesmo número (são casos de pessoas diferentes), mas a mesma conta não pode repetir.
- Processo criado com UF `MG` retorna mensagem específica: `Processo de MG criado com sucesso`.
- Processo criado com outra UF retorna mensagem padrão para fora de MG.
- Andamento deve pertencer a um processo existente.
- Data de processo e andamento não pode ser futura.
- Data de andamento não pode ser anterior à data de abertura do processo.
- Exclusão de processo remove seus andamentos por cascade no banco.
- E-mail de cadastro deve ser único; senha precisa ter no mínimo 8 caracteres.
- Conta recém-criada não consegue logar até confirmar o e-mail pelo link recebido.
- Login com credencial errada e pedido de redefinição de senha para e-mail inexistente retornam a mesma mensagem genérica — nunca revelam se a conta existe.
- Token de confirmação de e-mail e de redefinição de senha são de uso único e expiram (24h).
- Tentar acessar/editar/excluir um processo ou andamento de outra conta retorna "não encontrado" (404), nunca revela que o recurso existe para outro usuário.
- Excluir uma conta remove em cascata todos os processos e andamentos dela.

## Tecnologias utilizadas

| Camada | Tecnologias |
| --- | --- |
| Frontend | React, Vite, React Router DOM, React Hook Form, React Datepicker, Tailwind CSS v4, Lucide React |
| Backend | Node.js, Express, Prisma ORM, PostgreSQL driver `pg` |
| Autenticação | bcryptjs (hash de senha), jsonwebtoken (JWT Bearer), express-rate-limit |
| E-mail transacional | Brevo (API HTTP) |
| Banco de dados | PostgreSQL 16 (container na VPS em produção) |
| Containerização | Docker, Docker Compose, Nginx |
| Hospedagem (produção) | VPS Hostinger KVM 2 + Docker, atrás da borda Caddy (ADR-0004) |
| Documentação e fluxo | Markdown, Git, GitHub Projects, Spec-Driven Development (`.claude/`) |

## Pré-requisitos

Para rodar o projeto com Docker, é necessário ter instalado:

- Docker;
- Docker Compose;
- Git, caso vá clonar o repositório.

Não é necessário instalar Node.js localmente para executar pelo Docker Compose.

## Como rodar o projeto

Clone o repositório e entre na pasta do projeto:

```bash
git clone https://github.com/heitoroliveiro-dev/spj-crud.git
cd spj-crud
```

**Opcional** — para os e-mails de verificação de cadastro e redefinição de senha funcionarem de
verdade localmente, copie `.env.example` para `.env` na raiz e preencha `BREVO_API_KEY`/
`EMAIL_FROM` com uma conta [Brevo](https://app.brevo.com) (free tier). Sem isso, o projeto sobe e
o CRUD de processos funciona normalmente — só o envio de e-mail falha.

```bash
cp .env.example .env
```

---
**Atenção**:
Para que o projeto rode com `docker compose` é importante garantir que o aplicativo Docker foi aberto e que, no canto inferior esquerdo da tela, apareça a mensagem `Docker is running`.

---
Em seguida, execute:

```bash
docker compose up --build
```

Após a subida dos containers:

```text
Frontend:        http://localhost:5173
Backend API:     http://localhost:3001
Healthcheck:     http://localhost:3001/health
Banco de dados:  localhost:5432/spj_db
```

O backend imprime esses links no terminal ao iniciar. Em muitos terminais, é possível usar `Ctrl + click` para abrir os links.

Para parar os containers:

```bash
docker compose down
```

Para parar e apagar também o volume do banco:

```bash
docker compose down -v
```

Use `docker compose down -v` apenas quando quiser resetar os dados locais.

## Containers Docker

O `docker-compose.yml` orquestra três serviços:

### `db`

- Usa imagem `postgres:16-alpine`.
- Cria o banco `spj_db`.
- Expõe a porta `5432`.
- Usa volume `pgdata` para persistência local.
- Possui healthcheck com `pg_isready`.

### `backend`

- Build a partir de `backend/Dockerfile`.
- Expõe a porta `3001`.
- Aguarda o banco ficar saudável antes de iniciar.
- Recebe `DATABASE_URL` apontando para o host interno `db`, além de `JWT_SECRET`,
  `BREVO_API_KEY` e `EMAIL_FROM` (lidos de um `.env` opcional na raiz — ver seção anterior).
- Ao iniciar, executa:

```bash
npx prisma generate && npx prisma migrate deploy && npm start
```

Isso garante geração do Prisma Client, aplicação das migrations versionadas e subida da API.

### `frontend`

- Build a partir de `frontend/Dockerfile`.
- Compila a aplicação React com Vite.
- Recebe `VITE_API_BASE=http://localhost:3001` como argumento de build.
- Serve o build estático com Nginx.
- Expõe a porta `5173` apontando para a porta `80` do container.
- Usa `nginx.conf` com fallback para SPA:

```nginx
try_files $uri $uri/ /index.html;
```

## Arquitetura do projeto

```text
spj/
  backend/
    prisma/              Schema e migrations
    src/
      controllers/       Entrada HTTP e status de resposta
      routes/            Definição de rotas Express
      services/          Regras de negócio e validações
      repositories/      Acesso ao banco via Prisma
      middlewares/       errorHandler e requireAuth (guard de autenticação)
      database/          Instância do Prisma Client
      utils/             Utilitários compartilhados (hash de senha, token, JWT)
  frontend/
    src/
      components/        Componentes reutilizáveis (inclui RequireAuth, o guard de rota)
      context/           Estado global (AuthContext)
      pages/             Telas da aplicação (processos + login/cadastro/senha)
      services/          Cliente HTTP
      utils/             Formatadores e helpers
  docs/                  Documentação auxiliar do desenvolvimento
  .claude/               Metodologia de trabalho (Spec-Driven Development) — não afeta o build
  docker-compose.yml     Orquestração dos serviços
```

## Backend

O backend usa uma separação em camadas:

- `routes`: mapeiam endpoints.
- `controllers`: leem `params` e `body`, chamam services e retornam status HTTP.
- `services`: concentram regras de negócio.
- `repositories`: acessam o banco via Prisma.
- `middlewares/errorHandler`: padroniza erros da API.
- `middlewares/requireAuth`: único ponto que lê e valida o JWT, popula `req.user` — protege todas
  as rotas de `processos`/`andamentos`.

Principais endpoints:

```text
GET    /health

POST   /api/auth/signup
POST   /api/auth/verify-email
POST   /api/auth/login
POST   /api/auth/forgot-password
POST   /api/auth/reset-password

GET    /api/processos                              (requer Authorization: Bearer <token>)
GET    /api/processos/:id
POST   /api/processos
PUT    /api/processos/:id
DELETE /api/processos/:id

GET    /api/processos/:processoId/andamentos
POST   /api/processos/:processoId/andamentos
GET    /api/andamentos/:id
PUT    /api/andamentos/:id
DELETE /api/andamentos/:id
```

Toda rota de `processos`/`andamentos` é escopada pelo `userId` extraído do JWT — nunca por um
valor vindo do corpo da requisição. Ver `.claude/skills/auth-api/SKILL.md` para o detalhe da
implementação e `.claude/docs/architecture/adr/ADR-0002-autenticacao-jwt-bearer-em-memoria.md`
para a decisão de transporte de sessão.

## Testes

Devido ao prazo limite para entrega do projeto, os testes automatizados unitários e de integração foram implementados somente no backend.

A cobertura atual prioriza as regras de negócio e os principais contratos HTTP da API:

- testes unitários de utilitários de data;
- testes unitários dos services de processos, andamentos e autenticação;
- testes unitários do middleware `requireAuth`;
- testes de integração das rotas Express (incluindo `/api/auth/*`) com `supertest`;
- validação do tratamento global de erros pelo `errorHandler`.

Para rodar os testes do backend:

```bash
cd backend
npm test
```

Para gerar relatório de cobertura:

```bash
cd backend
npm run test:coverage
```

A documentação detalhada dos testes está em [`backend/tests/README.md`](./backend/tests/README.md).

## Frontend

Telas de processos (acesso restrito a quem está logado):

- `Dashboard`: listagem, busca, criação, edição e exclusão de processos.
- `DetalhesProcesso`: dados completos do processo e CRUD de andamentos.

Telas de autenticação (públicas):

- `Login`, `Signup`, `VerifyEmail` (confirma o link recebido por e-mail), `ForgotPassword`,
  `ResetPassword` (define nova senha a partir do link recebido).

`AuthContext` mantém o token JWT em memória (nunca em `localStorage`) e o usuário logado;
`RequireAuth` é o guard de rota que redireciona para `/login` quando não há sessão válida.

Componentes principais:

- `ProcessoCard`;
- `ProcessoForm`;
- `AndamentoForm`;
- `DateField`;
- `Modal`;
- `ConfirmDialog`;
- `Toast`;
- `RequireAuth`.

Mais detalhes estão em [`frontend/README.md`](./frontend/README.md).

## Deploy em produção

Desde 2026-11-25 o SPJ roda em **modo demonstração** na VPS Hostinger KVM 2 do Heitor, atrás de uma
borda Caddy compartilhada com outros projetos (spec 002, ADR-0004, que substitui a ADR-0001 —
Render + Vercel + Neon, desligados).

| Camada | Onde | Endereço |
|---|---|---|
| Frontend (React/Vite, nginx) | container `spj-frontend` | https://spj.heitoroliveiro.dev |
| Backend (Express, Docker) | container `spj-backend` | https://spj.heitoroliveiro.dev/api |
| Banco (PostgreSQL 16) | container `spj-db`, só na rede interna | — |

- **Conta de demonstração** na tela de login; cadastro e "esqueci minha senha" desligados
  (`DEMO_MODE=true`, sem e-mail na VPS).
- **Reset diário às 04:00** (timer systemd `spj-reset.timer`): dados apagados e recriados por
  `backend/scripts/reset-demo.js`.
- **Publicar:** `deploy/deploy.sh` (build local, imagens enviadas por SSH, `caddy validate` +
  `reload`). Passo a passo e rollback em `.claude/docs/playbooks/deploy.md`.

## Metodologia de desenvolvimento

O desenvolvimento foi conduzido de forma incremental, com foco em entregar primeiro o fluxo completo e depois endurecer validações e documentação.

Etapas principais:

1. Entendimento dos requisitos do teste técnico.
2. Planejamento em playbook para orientar decisões de backend, banco, frontend e Docker.
3. Criação do backend em camadas.
4. Modelagem do banco com Prisma e PostgreSQL.
5. Criação e aplicação de migration inicial.
6. Testes manuais de API com Postman.
7. Construção do frontend conectado à API.
8. Evolução de UX com modais, confirmações, date picker e toasts.
9. Containerização de banco, backend e frontend.
10. Deploy em produção: primeiro gratuito (Neon + Render + Vercel), desde a spec 002 demonstração pública na VPS do Heitor.
11. Adoção de Spec-Driven Development (SDD) para a evolução do projeto — toda funcionalidade não
    trivial passa por spec → plano → tarefas → implementação, documentado em `.claude/`. A feature
    de autenticação multiusuário foi a primeira construída inteiramente por esse fluxo, ver
    [`.claude/docs/specs/001-autenticacao-multiusuario/`](./.claude/docs/specs/001-autenticacao-multiusuario/).
12. Revisão final de documentação.

O projeto também foi organizado com versionamento Git, branches por evolução e documentação auxiliar em `docs/` e `.claude/docs/`.

## Validação rápida

Com os containers rodando:

```bash
curl http://localhost:3001/health
```

Resposta esperada:

```json
{
  "status": "ok"
}
```

A interface deve estar disponível em:

```text
http://localhost:5173
```

Para testar o fluxo de autenticação localmente sem depender de e-mail real: crie uma conta pela
tela de cadastro e confirme diretamente no banco (via `npx prisma studio` no backend, tabela
`users`, coluna `email_verified_at`) — útil quando `BREVO_API_KEY` não está configurada.
