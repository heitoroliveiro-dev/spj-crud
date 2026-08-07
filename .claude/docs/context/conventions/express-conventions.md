# Convenções — Express (backend)

Ver também `.claude/skills/express-module-dev/SKILL.md` (fonte principal — este arquivo é um
resumo de referência rápida).

## Camadas
`routes` → `controllers` → `services` → `repositories`. Nunca pular camada (controller chamando
repository direto, por exemplo).

## Erros
Toda regra de negócio que falha lança `Error` com `.status` via o helper local `reportaErro`
(padrão já usado em `processoService.js`/`andamentoService.js`) — nunca `res.status(...)` dentro
de um `service`.

## Validação de entrada
Feita no `service`, não em middleware genérico — já o padrão (`validarCamposObrigatorios` em
`processoService.js`). Manter validação de negócio explícita e testável por unidade, não
delegada a uma lib de schema (nenhuma está instalada; não introduzir sem necessidade real).

## Autenticação
Ver `.claude/skills/auth-api/SKILL.md`. `middlewares/requireAuth.js` é o único ponto que lê o JWT
— nenhum controller/service deve decodificar token diretamente.
