# ADR-0003 — Provedor de e-mail transacional: Brevo

- **Status**: aceita
- **Data**: 2026-08-06 · **Autores**: Heitor Oliveiro + Claude
- **Spec/Plan relacionados**: `.claude/docs/specs/001-autenticacao-multiusuario/spec.md`, `plan.md`

## Contexto
A feature de autenticação precisa enviar e-mail de verificação de conta e de reset de senha.
**Restrição dura, não preferência**: o Render bloqueia portas SMTP (25/465/587) no free tier
desde setembro de 2025 — qualquer provedor baseado só em SMTP está descartado, precisa ser API
HTTP.

## Alternativas consideradas
1. **Resend** — 3.000 e-mails/mês grátis, API HTTP simples. Sem domínio verificado, remetente
   fica limitado a `onboarding@resend.dev` (funcional, mas menos profissional).
2. **Brevo** — 300 e-mails/dia grátis (permanente, sem limite mensal agregado, então mais folga
   em dias de pico de cadastro), tem API HTTP além de SMTP (usamos só a API HTTP, pela restrição
   do Render). Escolhido pelo usuário.

## Decisão
Brevo, via API HTTP (`BREVO_API_KEY` como env var no Render), nunca SMTP. Remetente
(`EMAIL_FROM`) configurado como env var separada, para poder trocar sem redeploy de código.

## Consequências
Positivas: 300 e-mails/dia é folga suficiente para o volume esperado (app pessoal/pequeno grupo,
não um SaaS com milhares de cadastros/dia); permanente, sem expiração de trial. Negativas:
depender de um provedor externo para o fluxo crítico de signup/reset — se a API do Brevo cair ou
a cota diária estourar (ex.: ataque de cadastro em massa), signup/reset de senha ficam
indisponíveis. Mitigado por rate limiting nas rotas de auth (ver skill `auth-api`), que protege a
cota tanto quanto protege contra força bruta.
