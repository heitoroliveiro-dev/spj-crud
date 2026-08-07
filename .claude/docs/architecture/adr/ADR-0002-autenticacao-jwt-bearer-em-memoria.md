# ADR-0002 — Autenticação: JWT Bearer em memória (não cookie) + bcryptjs

- **Status**: aceita
- **Data**: 2026-08-06 · **Autores**: Heitor Oliveiro + Claude
- **Spec/Plan relacionados**: `.claude/docs/specs/001-autenticacao-multiusuario/spec.md`, `plan.md`

## Contexto
O SPJ precisa de autenticação multiusuário (cada pessoa só acessa seus próprios dados).
Frontend (Vercel) e backend (Render) são domínios diferentes — qualquer solução baseada em cookie
teria que lidar com cookie cross-site (`SameSite=None; Secure`), que navegadores modernos
(Safari ITP, Firefox ETP) já restringem por padrão, além de exigir proteção CSRF explícita.

## Alternativas consideradas
1. **Cookie httpOnly cross-site** (`SameSite=None`) — sessão sobrevive a F5, mas depende de
   comportamento de cookie de terceiro que navegadores já restringem; exige CSRF explícito
   (double-submit token); mais complexidade para um app hobby sem proxy dedicado.
2. **JWT Bearer em memória** (React Context, nunca `localStorage`), sem cookie — sem exposição a
   CSRF (não há credencial ambiente), CORS mais simples (sem `credentials: true`). Trade-off
   aceito: sessão não sobrevive a F5/nova aba — mitigado com expiração longa (12h, "uma sessão de
   trabalho") em vez do padrão de 15min pareado com refresh token.
3. **Híbrido access+refresh token** (access em memória + refresh em cookie httpOnly) — sessão
   mais duradoura, mas cada renovação automática dependeria do backend estar acordado; com o
   Render free tier dormindo após 15 min de inatividade, um refresh-on-load pagaria o cold start
   (~50s) a cada carregamento de página, não só no login — pior UX que simplesmente re-logar
   ocasionalmente.

## Decisão
JWT Bearer em memória, expiração de 12h, hash de senha com `bcryptjs` (puro JavaScript, sem risco
de build de módulo nativo no Docker do Render — trade-off consciente de segurança levemente menor
que `argon2id`, ainda aceito pela OWASP como opção válida). Token de verificação de e-mail e de
reset de senha: opaco (`crypto.randomBytes`), hasheado (SHA-256) antes de salvar no banco, nunca
JWT (JWT não pode ser revogado/marcado como usado sem uma blocklist, o que anularia a vantagem de
simplicidade).

## Consequências
Positivas: CORS simples (sem `credentials`), sem superfície de CSRF, sem dependência de
comportamento de cookie de terceiro, sem risco de build de módulo nativo. Negativas: sessão não
sobrevive a F5/fechar aba (aceito, documentado); logout é só client-side, sem blocklist de token
(um token JWT válido continua válido até expirar mesmo após "logout" — dívida técnica consciente,
plano de revisão: se algum dia precisar revogar token antes da expiração, adicionar uma tabela de
blocklist ou migrar para o modelo híbrido access+refresh).
