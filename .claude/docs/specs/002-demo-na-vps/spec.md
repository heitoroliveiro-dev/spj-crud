# SPEC — SPJ em modo demonstração na VPS (spj.heitoroliveiro.dev)

- **Pasta**: `002-demo-na-vps/` · **Status**: aprovada (2026-11-25, Heitor: opção "conta de
  demonstração", reset diário de madrugada, DNS criado) · **ADRs**: ADR-0004 (nova, substitui a
  ADR-0001)

## 1. Contexto

O SPJ vira um disco "No ar" do portfólio do Heitor (caixa de vinil de heitoroliveiro.dev). Ele sai
do free tier Render + Vercel + Neon (ADR-0001) e passa a rodar na VPS Hostinger KVM 2 do Heitor,
atrás da borda Caddy compartilhada com outros projetos, em `https://spj.heitoroliveiro.dev`.

Como é uma vitrine pública, ele roda em **modo demonstração**: qualquer visitante entra com uma
conta de teste mostrada na própria tela de login, e os dados voltam ao estado inicial todo dia.

## 2. Restrições

- Sem envio de e-mail na demonstração (sem chave da Brevo na VPS): **cadastro e "esqueci minha
  senha" ficam desligados**. O modo normal (com cadastro e e-mail) continua funcionando quando
  `DEMO_MODE` não está ligado — nada muda para quem roda local.
- A senha da conta de demonstração é pública por definição (mostrada na tela), mas fica no `.env`
  da VPS, não no código, para poder ser trocada sem commit.
- O banco não fica exposto à internet; só backend e frontend entram na rede da borda.
- Não afetar os outros projetos da VPS (CigMenu com cliente real, Perfex, heitoroliveiro.dev).

## 3. Comportamento esperado

- `https://spj.heitoroliveiro.dev` abre o SPJ; a tela de login mostra um quadro "Conta de
  demonstração" com e-mail e senha e um botão que preenche os campos.
- Com a conta de demonstração, tudo funciona: listar, buscar, criar, editar e excluir processos e
  andamentos.
- Na demonstração, as telas de cadastro e de redefinição de senha não aparecem nos links, e as
  rotas da API respondem 403 com a mensagem "Indisponível na demonstração".
- Todo dia às 04:00 (horário de Brasília) os dados são apagados e recriados: a conta de
  demonstração e uma carteira de processos fictícios com andamentos.

## 4. Critérios de aceite

- [ ] Login com a conta mostrada na tela funciona em produção.
- [ ] `POST /api/auth/signup` e `POST /api/auth/forgot-password` → 403 com `DEMO_MODE=true`; sem
      `DEMO_MODE`, comportamento atual (testes existentes passam).
- [ ] Links de cadastro e "esqueci minha senha" somem na demonstração; quadro da conta aparece.
- [ ] Script de reset apaga tudo e recria a conta (e-mail verificado) e os processos fictícios;
      rodando duas vezes seguidas dá o mesmo resultado.
- [ ] Timer diário às 04:00 instalado na VPS.
- [ ] Postgres sem porta publicada; containers com limite de memória e logs com rotação.
- [ ] Outros sites da VPS respondendo igual antes e depois.
