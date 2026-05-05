# Banco de Dados, PostgreSQL e Prisma

A persistencia de dados do SPJ foi estruturada com **PostgreSQL** em container Docker e **Prisma ORM** para controle de schema, migrations e geracao de client tipado para o backend Node.js.

Esta pagina documenta a evolucao real do ambiente de banco: container PostgreSQL, ajuste do Prisma 7, criacao da migration inicial e validacao via Prisma Studio.

## 1. Container PostgreSQL

O servico de banco foi definido na raiz do projeto em `docker-compose.yml`.

```yaml
services:
  db:
    image: postgres:16-alpine
    container_name: spj_db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: spj_db
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

### Subida do banco

O banco foi iniciado pela raiz do projeto:

```bash
docker compose up -d db
docker compose ps
```

Status confirmado:

```text
NAME      IMAGE                COMMAND                  SERVICE   STATUS             PORTS
spj_db    postgres:16-alpine   "docker-entrypoint.s..." db        Up                 0.0.0.0:5432->5432/tcp
```

Com isso, o PostgreSQL ficou disponivel localmente em `localhost:5432`.

## 2. Configuracao do Prisma

As dependencias principais do backend sao:

```bash
npm install @prisma/client
npm install -D prisma
```

Durante a configuracao com Prisma 7, tambem foi instalado:

```bash
npm install -D @types/node
```

Esse pacote e necessario porque `backend/prisma.config.ts` usa `process.env.DATABASE_URL`, e o TypeScript precisa dos tipos do Node.js para reconhecer `process`.

## 3. Modelagem inicial

Arquivo: `backend/prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model Processos {
  id             Int         @id @default(autoincrement())
  numeroProcesso String      @unique @map("numero_processo")
  dataAbertura   DateTime    @map("data_abertura")
  descricao      String
  cliente        String
  advogado       String
  uf             String      @db.VarChar(2)
  andamentos     Andamento[]
  createdAt      DateTime    @default(now()) @map("created_at")
  updatedAt      DateTime    @updatedAt @map("updated_at")

  @@map("processos")
}

model Andamento {
  id          Int       @id @default(autoincrement())
  data        DateTime
  descricao   String
  processosId Int       @map("processos_id")
  processos   Processos @relation(fields: [processosId], references: [id], onDelete: Cascade)
  createdAt   DateTime  @default(now()) @map("created_at")

  @@map("andamentos")
}
```

Pontos relevantes da modelagem:

- `Processos` representa o cadastro principal solicitado no teste tecnico.
- `Andamento` representa os movimentos vinculados a um processo.
- A relacao `Processos -> Andamento` e 1:N.
- `numeroProcesso` e unico no banco.
- `onDelete: Cascade` garante que os andamentos sejam excluidos automaticamente quando o processo for removido.
- `@map` e `@@map` mantem nomes de tabelas e colunas em snake_case no PostgreSQL.


## 3. Criacao da migration inicial

Com o container PostgreSQL rodando e o schema validado, a migration inicial foi criada e aplicada:

```bash
cd backend
npx prisma migrate dev --name init
```

Resultado:

```text
Datasource "db": PostgreSQL database "spj_db", schema "public" at "localhost:5432"

Applying migration `20260501214042_init`

The following migration(s) have been created and applied from new schema changes:

prisma/migrations/
  └─ 20260501214042_init/
    └─ migration.sql

Your database is now in sync with your schema.
```

Arquivos criados:

```text
backend/prisma/migrations/
├── 20260501214042_init/
│   └── migration.sql
└── migration_lock.toml
```

## 4. Estrutura SQL gerada

A migration criou as tabelas:

- `processos`
- `andamentos`
- `_prisma_migrations`

Trecho principal da migration:

```sql
CREATE TABLE "processos" (
    "id" SERIAL NOT NULL,
    "numero_processo" TEXT NOT NULL,
    "data_abertura" TIMESTAMP(3) NOT NULL,
    "descricao" TEXT NOT NULL,
    "cliente" TEXT NOT NULL,
    "advogado" TEXT NOT NULL,
    "uf" VARCHAR(2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "processos_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "andamentos" (
    "id" SERIAL NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "descricao" TEXT NOT NULL,
    "processos_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "andamentos_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "processos_numero_processo_key"
ON "processos"("numero_processo");

ALTER TABLE "andamentos"
ADD CONSTRAINT "andamentos_processos_id_fkey"
FOREIGN KEY ("processos_id")
REFERENCES "processos"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;
```

O ponto mais importante para o requisito do teste e:

```sql
ON DELETE CASCADE
```

Esse comportamento garante integridade referencial entre processos e andamentos.

## 5. Geracao do Prisma Client

Depois da migration, o client foi gerado:

```bash
npx prisma generate
```

Resultado:

```text
Generated Prisma Client (7.8.0) to ./src/generated/prisma in 30ms
```

Como o generator esta configurado com:

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}
```

o backend deve importar o client a partir do caminho gerado em `src/generated/prisma`, conforme a estrutura escolhida para este projeto.

## 6. Validacao visual com Prisma Studio

O banco foi validado visualmente com:

```bash
npx prisma studio
```

Resultado:

```text
Prisma Studio is running at: http://localhost:51212
```

No Studio foram confirmadas as tabelas:

- `_prisma_migrations`
- `andamentos`
- `processos`

A tabela `processos` exibiu as colunas esperadas:

- `id`
- `advogado`
- `cliente`
- `created_at`
- `data_abertura`
- `descricao`
- `numero_processo`
- `uf`

## 7. Comandos de referencia

Subir apenas o banco:

```bash
docker compose up -d db
```

Verificar containers:

```bash
docker compose ps
```

Formatar schema:

```bash
cd backend
npx prisma format
```

Validar schema:

```bash
npx prisma validate
```

Criar e aplicar migration em desenvolvimento:

```bash
npx prisma migrate dev --name init
```

Gerar Prisma Client:

```bash
npx prisma generate
```

Abrir Prisma Studio:

```bash
npx prisma studio
```
