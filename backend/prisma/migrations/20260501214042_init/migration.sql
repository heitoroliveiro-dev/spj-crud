-- CreateTable
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

-- CreateTable
CREATE TABLE "andamentos" (
    "id" SERIAL NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "descricao" TEXT NOT NULL,
    "processos_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "andamentos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "processos_numero_processo_key" ON "processos"("numero_processo");

-- AddForeignKey
ALTER TABLE "andamentos" ADD CONSTRAINT "andamentos_processos_id_fkey" FOREIGN KEY ("processos_id") REFERENCES "processos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
