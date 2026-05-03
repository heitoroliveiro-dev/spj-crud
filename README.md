# SPJ (Sistema de Processos Judiciais)
O SPJ é uma aplicação full-stack moderna que gerencia processos juriciais e seus andamentos.

## Metodologia de desenvolvimento

Devido ao contexto de prazo curto e entregas rápidas e escaláveis, o desenvolvimento desse sistema foi realizado com metodologias ágeis a partir do planejamento estratégico e documentação de forma síncrona, além da utilização das ferramentas disponíveis no GitHub como o **Projects**, que me permitiu preencher um backlog de produto para avançar tasks pelo painel conforme o desenvolvimento flui.

Verifique o repositório público as branches, issues e sub-issues pelo link 

![descrição do painel](projects.png)

## Stack 

| Camada | Tecnologia |
|--------|------------|
| Frontend | React + Vite |
| Backend | Node.js + Express + Prisma ORM |
| Banco de Dados | PosgreSQL |
| Containerização | Docker + Docker Compose |
| Versionamento | Git + GitHub |
| Deploy | Render |
| Autenticação | JWT (opcional) |

# Requisitos de negócio

### RF
| Requisitos Funcionais | Descrição |
|-----------|-----------|
| 01 - Gestão de Processos | O sistema deve permitir criar, visualizar, editar e excluir processos judiciais |
| 02 - Gestão de Andamentos | O sistema deve permitir criar, visualizar, editar e excluir andamentos processuais |
| 03 - Relacionamento Processo/Andamento | O sistema deve vincular múltiplos andamentos a um único processo (relação 1:N) |
| 04 - Notificação Baseada em UF | O sistema deve processar a UF fornecida durante a criação do processo e retornar uma mensagem específica caso o estado seja "MG", e uma mensagem padrão para os demais estados |
| 05 - Listagem de processos | O sistema deve apresentar uma interface de listagem exibindo os dados consolidados e principais de cada processo cadastrado |
| 06 - Feedback de validação | O sistema deve exibir mensagens de erro no frontend caso os campos não atendam aos critérios de formatação ou obrigatoriedade antes da submissão |

### RNF
| Requisitos NÃO Funcionais | Descrição |
|-----------|-----------|
| 01 - Orquestração de Ambiente | A infraestrutura da aplicação (frontend, backend e banco de dados) deve ser conteinerizada e subir com um único comando utilizando `docker compose up --build`|
| 02 - Integridade de Dados | A exclusão de um Processo Judicial deve acionar obrigatoriamente a exclusão em cascata de todos os Andamentos vinculados a ele, garantindo a nível de banco de dados |
| 03 - Documentação de Engenharia | O repositório deve conter um `README.md` abrangente, detalhando os passos para execução, variáveis de ambiente, dependências e arquitetura |
| 04 - Desempenho e Usabilidade | A validação primária deve ocorrer no frontend para reduzir requisições desnecessárias ao servidor e fornecer feedback imediato ao usuário |

## Contrato de API

#### **Processos**:

| Metodo | Rota | Acao |
| --- | --- | --- |
| GET | `/api/processos` | Listar processos |
| GET | `/api/processos/:id` | Detalhar processo com andamentos |
| POST | `/api/processos` | Criar processo |
| PUT | `/api/processos/:id` | Editar processo |
| DELETE | `/api/processos/:id` | Excluir processo |

#### **Andamentos**:

| Metodo | Rota | Acao |
| --- | --- | --- |
| POST | `/api/processos/:processoId/andamentos` | Criar andamento |
| PUT | `/api/andamentos/:id` | Editar andamento |
| DELETE | `/api/andamentos/:id` | Excluir andamento |

