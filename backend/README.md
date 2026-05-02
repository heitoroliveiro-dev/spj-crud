# Backend SPJ

Backend do SPJ (Sistema de Processos Judiciais), desenvolvido com Node.js, Express, Prisma ORM e PostgreSQL.

## Requisitos

Antes de iniciar, tenha instalado:

- Node.js
- npm
- Docker
- Docker Compose

## Tecnologias usadas

| Recurso | Tecnologia |
| --- | --- |
| Runtime | Node.js |
| API | Express |
| ORM | Prisma |
| Banco de dados | PostgreSQL |
| Ambiente local | Docker Compose |

## 1. Subir o banco de dados

O PostgreSQL e configurado pelo arquivo `docker-compose.yml` que fica na raiz do projeto.

Na raiz do repositório, execute:

```bash
docker compose up -d db
```

Confira se o container esta rodando:

```bash
docker compose ps
```

O banco local ficara disponivel em:

```text
localhost:5432
```

Dados do banco local:

```text
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=spj_db
```

## 2. Entrar na pasta do backend

Ainda a partir da raiz do projeto, acesse:

```bash
cd backend
```

## 3. Instalar dependencias

Execute:

```bash
npm install
```

## 4. Configurar variaveis de ambiente

Crie ou confira o arquivo `.env` dentro da pasta `backend`.

Exemplo:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/spj_db?schema=public"
PORT=3001
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"
```

Descricao das variaveis:

| Variavel | Descricao |
| --- | --- |
| `DATABASE_URL` | URL de conexao com o PostgreSQL usado pelo Prisma |
| `PORT` | Porta em que a API sera iniciada |
| `NODE_ENV` | Ambiente de execucao |
| `FRONTEND_URL` | Origem liberada no CORS para o frontend |

## 5. Aplicar migrations do Prisma

Com o banco rodando e o `.env` configurado, execute dentro de `backend`:

```bash
npx prisma migrate dev
```

Esse comando aplica as migrations existentes em `prisma/migrations` e deixa o banco sincronizado com o schema.

Se precisar gerar novamente o Prisma Client, execute:

```bash
npx prisma generate
```

## 6. Rodar o backend em desenvolvimento

Dentro de `backend`, execute:

```bash
npm run dev
```

O servidor sera iniciado com `nodemon`.

Por padrao, a API ficara disponivel em:

```text
http://localhost:3001
```

## 7. Testar se a API esta no ar

Com o backend rodando, acesse no navegador ou use `curl`:

```bash
curl http://localhost:3001/health
```

Resposta esperada:

```json
{
  "status": "ok"
}
```

Tambem e possivel testar a rota principal de processos:

```bash
curl http://localhost:3001/api/processos
```

## 8. Rodar em modo producao/local simples

Para iniciar sem `nodemon`, execute:

```bash
npm start
```

Esse comando roda:

```bash
node server.js
```

## Comandos uteis

| Comando | Onde executar | Finalidade |
| --- | --- | --- |
| `docker compose up -d db` | Raiz do projeto | Sobe o PostgreSQL |
| `docker compose ps` | Raiz do projeto | Lista containers ativos |
| `npm install` | `backend` | Instala dependencias |
| `npx prisma migrate dev` | `backend` | Aplica migrations no banco local |
| `npx prisma generate` | `backend` | Gera o Prisma Client |
| `npm run dev` | `backend` | Inicia a API em desenvolvimento |
| `npm start` | `backend` | Inicia a API com Node |

## Rotas disponiveis

### Health check

| Metodo | Rota | Descricao |
| --- | --- | --- |
| GET | `/health` | Verifica se a API esta respondendo |

### Processos

| Metodo | Rota | Descricao |
| --- | --- | --- |
| GET | `/api/processos` | Lista processos |
| GET | `/api/processos/:id` | Detalha um processo |
| POST | `/api/processos` | Cria um processo |
| PUT | `/api/processos/:id` | Atualiza um processo |
| DELETE | `/api/processos/:id` | Remove um processo |

## Fluxo completo resumido

Executando a partir da raiz do projeto:

```bash
docker compose up -d db
cd backend
npm install
npx prisma migrate dev
npm run dev
```

Depois disso, teste:

```bash
curl http://localhost:3001/health
```