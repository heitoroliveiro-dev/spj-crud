# Frontend SPJ

Frontend do SPJ (Sistema de Processos Judiciais), construído em React com Vite. A interface consome a API do backend para listar, criar, editar e excluir processos judiciais e seus andamentos.

## Layout padrão da aplicação

A aplicação segue um layout administrativo simples, com foco em leitura rápida e ações diretas:

- Cabeçalho azul escuro com identidade do sistema.
- Conteúdo centralizado com largura máxima controlada por `.page-container`.
- Cards para listagem de processos.
- Seções brancas com borda sutil para detalhes e tabelas.
- Botões de ação com padrão visual consistente.
- Modais para criação e edição.
- Toast no canto inferior central para feedback de sucesso.

Os estilos globais ficam concentrados em:

- `src/index.css`: importa Tailwind v4, define tokens globais e base visual.
- `src/default.css`: define classes reutilizáveis do projeto, como `app-shell`, `page-container`, `section-card`, `button-primary`, `button-secondary`, `form-grid` e `form-field`.

## Arquitetura frontend

A organização segue uma divisão simples por responsabilidade:

```text
src/
  components/       Componentes reutilizáveis de UI e formulário
  pages/            Telas principais da aplicação
  services/         Comunicação com a API
  utils/            Formatadores e utilitários de data
  App.jsx           Definição das rotas
  main.jsx          Entrada da aplicação
```

Fluxo principal:

1. `App.jsx` define as rotas com React Router.
2. `Dashboard.jsx` lista processos e gerencia o CRUD de processos.
3. `DetalhesProcesso.jsx` mostra os dados de um processo e gerencia seus andamentos.
4. `services/api.js` centraliza as chamadas HTTP.
5. Componentes recebem dados e callbacks por props. As páginas controlam estado, carregamento, erros e submissões.

## Tecnologias utilizadas

| Tecnologia | Uso |
| --- | --- |
| React | Construção da interface |
| Vite | Build e ambiente de desenvolvimento |
| React Router DOM | Rotas entre listagem e detalhes |
| React Hook Form | Controle e validação de formulários |
| React Datepicker | Campo de data com calendário em formato brasileiro |
| date-fns | Locale `pt-BR` para datas |
| Tailwind CSS v4 | Utilitários e tokens visuais via `@tailwindcss/vite` |
| Lucide React | Ícones |
| Fetch API | Requisições HTTP centralizadas em `services/api.js` |
| Nginx | Servir o build em container Docker |

## Componentes do projeto

| Componente | Responsabilidade |
| --- | --- |
| `ProcessoCard` | Exibe resumo do processo na listagem e ações de detalhe, edição e exclusão |
| `ProcessoForm` | Formulário de criação e edição de processos |
| `AndamentoForm` | Formulário de criação e edição de andamentos |
| `DateField` | Campo de data com calendário, locale brasileiro, limite mínimo e limite máximo |
| `Modal` | Estrutura reutilizável de modal |
| `ConfirmDialog` | Confirmação para ações destrutivas |
| `Toast` | Notificações temporárias no canto inferior central |

## Validações básicas do frontend

### Processos

- Campos obrigatórios:
  - número do processo;
  - data de abertura;
  - descrição;
  - cliente;
  - advogado;
  - UF.
- Data de abertura:
  - exibida no padrão `dd/mm/aaaa`;
  - não permite data futura;
  - caso receba data futura, normaliza para a data atual.
- Número do processo:
  - se o backend retornar conflito por número já cadastrado, a mensagem é exibida abaixo do campo.

### Andamentos

- Campos obrigatórios:
  - data;
  - descrição.
- Data do andamento:
  - exibida no padrão `dd/mm/aaaa`;
  - não permite data futura;
  - não permite data anterior à data de abertura do processo;
  - usa `minDate` com base no processo aberto na tela de detalhes.

### Feedback visual

- Erros de carregamento aparecem em blocos destacados.
- Sucessos aparecem em toast por 5 segundos.
- Ações destrutivas exigem confirmação em modal.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Variável de ambiente

O frontend usa a variável de build:

```text
VITE_API_BASE=http://localhost:3001
```

No Docker Compose, ela é enviada como argumento de build para apontar o frontend para a API local.
