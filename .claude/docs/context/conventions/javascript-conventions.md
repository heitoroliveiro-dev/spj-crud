# Convenções — JavaScript

Projeto sem TypeScript — backend CommonJS (`require`/`module.exports`), frontend ESM (`import`/
`export`, JSX).

## Backend (CommonJS)
- Um módulo por arquivo, `module.exports` no final (ou nomeado, seguir o que já existe no
  arquivo vizinho da mesma camada).
- Sem `any`-equivalente a policiar (JS não tem tipos), mas validar entrada explicitamente em
  `services/` — nunca confiar em formato de `req.body` sem checagem.
- `async/await` em vez de `.then()` encadeado — já o padrão em todo o código existente.

## Frontend (ESM + JSX)
- Componentes funcionais com hooks — sem componente de classe em código novo.
- Nome de arquivo de componente em PascalCase (`Modal.jsx`), hook customizado em camelCase com
  prefixo `use` se algum for criado.
- Props desestruturadas no parâmetro da função, não acessadas via `props.x` no corpo.

## Ambos
- Nunca `var` — `const` por padrão, `let` só quando reatribuição é necessária.
- Nomes de variável/função em português quando refletem domínio de negócio (`numeroProcesso`,
  `reportaErro`, `andamentoService`) — já o padrão estabelecido, manter consistência em vez de
  misturar com inglês.
