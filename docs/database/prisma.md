## Banco de Dados e Infraestrutura

A persistência de dados da aplicação foi estruturada utilizando **PostgreSQL** em conjunto com o **Prisma ORM** para garantir tipagem segura (Type-Safety), agilidade nas consultas e controle rigoroso de migrações.

### Tecnologias
* **Database Engine:** PostgreSQL
* **ORM:** Prisma
* **Ambiente Local:** Docker (Container)
* **Modelagem:** Mermaid Chart

### Estrutura
O ambiente de dados foi configurado através dos seguintes passos fundacionais:

1. Instalação das dependências do ORM:
   ```bash
   npm install -D prisma
   npm install @prisma/client
   ```

2. Inicialização do schema e definição do provedor

    ```
    npx prisma init --datasource-provider postgresql
    ```

## Modelagem de dados

![descrição do painel](/docs/assets/img/classDiagram.png)