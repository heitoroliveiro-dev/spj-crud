# PLAN — Autenticação multiusuário

- **Spec de origem**: `spec.md` (aprovada)
- **Status**: aprovado
- **Skills consultadas**: `auth-api`, `express-module-dev`, `prisma-database`,
  `deploy-render-vercel-neon`

Esta é a **fase 2 (como)** do fluxo SDD.

## 1. Solução técnica

### Camadas afetadas
Backend ganha uma nova fatia vertical completa (`routes/authRoutes.js` →
`controllers/authController.js` → `services/authService.js` →
`repositories/userRepository.js` + `emailVerificationTokenRepository.js` +
`passwordResetTokenRepository.js`), mais um middleware novo (`requireAuth.js`) e utils
(`passwordHasher.js`, `tokenGenerator.js`, `jwt.js`, `emailService.js`). As rotas existentes
(`processoRoutes`, `andamentoRoutes`) passam a montar `requireAuth` e seus controllers/services
passam a receber e aplicar `userId`.

Frontend ganha o primeiro estado global (`context/AuthContext.jsx`), 5 páginas novas, e um guard
de rota (`components/RequireAuth.jsx`).

### Modelo de dados (`backend/prisma/schema.prisma`)

```prisma
model User {
  id                      Int                      @id @default(autoincrement())
  email                   String                   @unique
  passwordHash            String                   @map("password_hash")
  nome                    String?
  emailVerifiedAt         DateTime?                @map("email_verified_at")
  createdAt               DateTime                 @default(now()) @map("created_at")
  updatedAt               DateTime                 @updatedAt @map("updated_at")
  processos               Processos[]
  emailVerificationTokens EmailVerificationToken[]
  passwordResetTokens     PasswordResetToken[]

  @@map("users")
}

model EmailVerificationToken {
  id        Int       @id @default(autoincrement())
  tokenHash String    @unique @map("token_hash")
  userId    Int       @map("user_id")
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime  @map("expires_at")
  usedAt    DateTime? @map("used_at")
  createdAt DateTime  @default(now()) @map("created_at")

  @@index([userId])
  @@map("email_verification_tokens")
}

model PasswordResetToken {
  id        Int       @id @default(autoincrement())
  tokenHash String    @unique @map("token_hash")
  userId    Int       @map("user_id")
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime  @map("expires_at")
  usedAt    DateTime? @map("used_at")
  createdAt DateTime  @default(now()) @map("created_at")

  @@index([userId])
  @@map("password_reset_tokens")
}
```

`Processos`: adicionar `userId Int @map("user_id")` + `user User @relation(fields: [userId],
references: [id], onDelete: Cascade)` + `@@index([userId])`; trocar `numeroProcesso String
@unique @map("numero_processo")` para `numeroProcesso String @map("numero_processo")` com
`@@unique([numeroProcesso, userId])` no nível do modelo (duas contas podem ter processos com o
mesmo número — são casos diferentes de pessoas diferentes).

Duas tabelas de token separadas (não uma única com campo `type`) — um bug de branch trocando o
tipo de token seria um bug de segurança real (usar token de reset para verificar e-mail ou
vice-versa), não vale a pequena duplicação economizada.

Migration: `prisma migrate dev --name adicionar_autenticacao_multiusuario`. Como a tabela
`processos` está vazia em produção (confirmado), `userId` nasce `NOT NULL` sem necessidade de
backfill.

### Integrações
**Brevo** (API HTTP, `BREVO_API_KEY`) para dois e-mails: confirmação de cadastro e reset de
senha. Ambos com link contendo o token em query string:
`${FRONTEND_URL}/verificar-email?token=...` e `${FRONTEND_URL}/redefinir-senha?token=...`.

### Observabilidade
Log (sem dado sensível) de: tentativa de login (sucesso/falha, sem senha), envio de e-mail
(sucesso/falha da chamada à API do Brevo, sem token). Nunca logar senha, JWT, ou token de
verificação/reset em texto puro.

## 2. Trade-offs da solução escolhida

- **JWT Bearer em memória, sem refresh token** (ADR-0002): sessão não sobrevive a F5; mitigado
  com expiração de 12h. Logout é só client-side (token continua tecnicamente válido até expirar)
  — dívida técnica documentada, plano de revisão se algum dia for necessário revogar antes da
  expiração (blocklist ou migrar para modelo híbrido).
- **bcryptjs em vez de argon2** (ADR-0002): módulo puro JS, zero risco de build no Docker do
  Render, levemente menos robusto que argon2id mas ainda aceito pela OWASP.
- **Rate limiting em memória** (`express-rate-limit` padrão, sem Redis): zera a cada
  redeploy/restart do Render — aceitável para o volume de tráfego esperado, revisar se abuso real
  acontecer.
- **Brevo como dependência externa crítica** (ADR-0003): signup e reset de senha ficam
  indisponíveis se a API do Brevo cair ou a cota diária estourar. Mitigado por rate limiting nas
  rotas que disparam e-mail.

## 3. Plano de implantação

1. Instalar dependências novas no backend: `jsonwebtoken`, `bcryptjs`, `express-rate-limit`, SDK
   ou chamada HTTP direta ao Brevo (avaliar se `@getbrevo/brevo` vale a dependência extra ou se
   uma chamada `fetch` direta à API REST do Brevo é mais simples — decisão de implementação, não
   architeturalmente relevante o suficiente para travar o plano nisso).
2. Schema + migration (ver seção 1) — rodar localmente primeiro, testar `prisma migrate dev`.
3. Camadas `repositories` → `services` → `routes/controllers` para auth, nessa ordem.
4. Atualizar `processoService`/`andamentoService`/`processoRepository`/`andamentoRepository` para
   exigir e aplicar `userId` em toda operação.
5. `middlewares/requireAuth.js`, montado em `processoRoutes`/`andamentoRoutes` e nas rotas
   protegidas de `authRoutes` (nenhuma rota de auth em si precisa de `requireAuth` — são todas
   públicas por natureza: signup, verify, login, forgot-password, reset-password).
6. Frontend: `AuthContext`, páginas, guard de rota.
7. Atualizar testes existentes (quebram assim que `requireAuth` é montado) e adicionar testes
   novos.
8. Configurar `JWT_SECRET`, `BREVO_API_KEY`, `EMAIL_FROM` no Render (env vars, nunca no código).
9. Deploy (push em `main` — automático) e validação manual dos critérios de aceite do `spec.md`,
   incluindo o caso de cold start do Render no primeiro acesso do dia.

Impacto em produção: primeira mudança de schema que quebra compatibilidade retroativa das rotas
existentes (`processos`/`andamentos` passam a exigir autenticação) — não há usuário real em
produção ainda (base vazia), então não há sessão de ninguém para migrar/quebrar. Rollback: reverter
o deploy do Render para a revisão anterior; a migration em si (`userId` obrigatório) não é
reversível sem uma nova migration se algum dado real já tiver sido inserido depois deste deploy —
aceitável dado que ainda não há usuários reais.

## 4. ADR relacionada
`ADR-0002-autenticacao-jwt-bearer-em-memoria.md` (transporte de sessão + hashing),
`ADR-0003-provedor-email-transacional-brevo.md` (e-mail transacional).

---
Próximo passo depois de `Status: aprovado` → `/tasks` gera `tasks.md` nesta mesma pasta.
