# ADR-0004 — Hospedagem na VPS do Heitor, em modo demonstração

- **Status**: aceita
- **Data**: 2026-11-25 · **Autores**: Heitor Oliveiro + Claude
- **Spec/Plan relacionados**: `.claude/docs/specs/002-demo-na-vps/`
- **Relação**: substitui a ADR-0001 (Render + Vercel + Neon).

## Contexto
O SPJ vira vitrine pública no portfólio do Heitor. O free tier (Render dorme; Neon com limites)
dava uma primeira visita lenta, e o Heitor já mantém uma VPS Hostinger KVM 2 com borda Caddy
compartilhada (`/opt/edge`) servindo outros projetos.

## Decisão
Rodar backend, frontend e Postgres em `/opt/spj-crud` na VPS, atrás da borda, em
`https://spj.heitoroliveiro.dev`, com imagens construídas na máquina do Heitor e enviadas por SSH.
Modo demonstração: conta de teste pública, cadastro e redefinição de senha desligados (sem e-mail),
reset diário dos dados às 04:00.

## Consequências
- Primeira visita rápida, sem dormir; nenhum segredo de e-mail na VPS.
- Quem visita não testa o fluxo de cadastro e e-mail (continua coberto por testes e pelo modo
  normal, local).
- Render, Vercel e Neon podem ser desligados depois de confirmado o novo endereço.
