# TASKS — SPJ em modo demonstração na VPS

- [x] T1 — `demoGuard` + testes (403 com DEMO_MODE; comportamento atual sem ele).
- [x] T2 — `scripts/reset-demo.js` (idempotente, só com DEMO_MODE).
- [x] T3 — Login: quadro da conta de demonstração e links escondidos (build args).
- [x] T4 — `deploy/`: compose de produção, `spj.caddy`, `deploy.sh`, timer de reset.
- [x] T5 — ADR-0004 (substitui ADR-0001), README e CLAUDE.md (hospedagem).
- [x] T6 — Deploy na VPS, reset inicial, verificação dos critérios.
  - *Feito (2026-11-25):* commit `6570884` no ar em https://spj.heitoroliveiro.dev, certificado
    Let's Encrypt; reset inicial (1 conta, 8 processos); timer às 04:00 ativo; signup e
    forgot-password → 403; Postgres sem porta publicada; `.env` 600; outros sites iguais.
    Login com a conta de demonstração testado numa cópia local das mesmas imagens.
