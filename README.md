# SPJ - Sistema de Processos Judiciais

O SPJ é uma aplicação full-stack para gestão de processos judiciais e seus andamentos. O projeto foi desenvolvido como teste técnico, priorizando arquitetura simples, separação de responsabilidades, validações essenciais, persistência relacional e execução completa com Docker Compose.

A aplicação permite cadastrar processos, consultar detalhes, registrar andamentos, editar informações e excluir registros com integridade entre processo e andamento.

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

## Regras de negócio implementadas

- Processo deve possuir número, data de abertura, descrição, cliente, advogado e UF.
- Número do processo deve ser único.
- Processo criado com UF `MG` retorna mensagem específica: `Processo de MG criado com sucesso`.
- Processo criado com outra UF retorna mensagem padrão para fora de MG.
- Andamento deve pertencer a um processo existente.
- Data de processo e andamento não pode ser futura.
- Data de andamento não pode ser anterior à data de abertura do processo.
- Exclusão de processo remove seus andamentos por cascade no banco.

## Tecnologias utilizadas

| Camada | Tecnologias |
| --- | --- |
| Frontend | React, Vite, React Router DOM, React Hook Form, React Datepicker, Tailwind CSS v4, Lucide React |
| Backend | Node.js, Express, Prisma ORM, PostgreSQL driver `pg` |
| Banco de dados | PostgreSQL 16 |
| Containerização | Docker, Docker Compose, Nginx |
| Documentação e fluxo | Markdown, Git, GitHub Projects |

## Pré-requisitos

Para rodar o projeto com Docker, é necessário ter instalado:

- Docker;
- Docker Compose;
- Git, caso vá clonar o repositório.

Não é necessário instalar Node.js localmente para executar pelo Docker Compose.

## Como rodar com um comando

Na raiz do projeto `spj`, execute:

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
- Recebe `DATABASE_URL` apontando para o host interno `db`.
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
      middlewares/       Tratamento global de erros
      database/          Instância do Prisma Client
      utils/             Utilitários compartilhados
  frontend/
    src/
      components/        Componentes reutilizáveis
      pages/             Telas da aplicação
      services/          Cliente HTTP
      utils/             Formatadores e helpers
  docs/                  Documentação auxiliar do desenvolvimento
  docker-compose.yml     Orquestração dos serviços
```

## Backend

O backend usa uma separação em camadas:

- `routes`: mapeiam endpoints.
- `controllers`: leem `params` e `body`, chamam services e retornam status HTTP.
- `services`: concentram regras de negócio.
- `repositories`: acessam o banco via Prisma.
- `middlewares/errorHandler`: padroniza erros da API.

Principais endpoints:

```text
GET    /health
GET    /api/processos
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

## Frontend

O frontend possui duas telas principais:

- `Dashboard`: listagem, busca, criação, edição e exclusão de processos.
- `DetalhesProcesso`: dados completos do processo e CRUD de andamentos.

Componentes principais:

- `ProcessoCard`;
- `ProcessoForm`;
- `AndamentoForm`;
- `DateField`;
- `Modal`;
- `ConfirmDialog`;
- `Toast`.

Mais detalhes estão em [`frontend/README.md`](./frontend/README.md).

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
10. Revisão final de documentação e execução via Docker Compose.

O projeto também foi organizado com versionamento Git, branches por evolução e documentação auxiliar em `docs/`.

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
