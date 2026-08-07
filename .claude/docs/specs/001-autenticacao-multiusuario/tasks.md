# TASKS — Autenticação multiusuário

- **Plan de origem**: `plan.md` (aprovado)

Esta é a **fase 3** do fluxo SDD: quebra do plano em tarefas pequenas, ordenadas e verificáveis.
`/implement` executa esta lista em ordem, respeitando dependências.

## Schema / migration
- [x] T1 — Adicionar `User`, `EmailVerificationToken`, `PasswordResetToken` a `schema.prisma`;
  gerar migration `adicionar_autenticacao_multiusuario` (`prisma-database`)
- [x] T2 — Adicionar `userId` obrigatório a `Processos`, trocar `numeroProcesso @unique` por
  `@@unique([numeroProcesso, userId])`, depende de T1 (`prisma-database`)

## Infrastructure (repositories/utils)
- [x] T3 — `repositories/userRepository.js` (findByEmail, create, markEmailVerified,
  updatePassword), depende de T1 (`prisma-database`)
- [x] T4 — `repositories/emailVerificationTokenRepository.js` e
  `repositories/passwordResetTokenRepository.js` (create, findByTokenHash, markUsed), depende de
  T1 (`prisma-database`)
- [x] T5 — `utils/passwordHasher.js` (bcryptjs: hash/compare), `utils/tokenGenerator.js`
  (gera token aleatório + hash SHA-256), `utils/jwt.js` (sign/verify) (`auth-api`)
- [x] T6 — `services/emailService.js` (Brevo: sendVerificationEmail, sendPasswordResetEmail),
  depende de `BREVO_API_KEY` configurada (`auth-api`)

## Application (services)
- [x] T7 — `services/authService.js`: signup (valida e-mail único, hasheia senha, cria user,
  gera+envia token de verificação), depende de T3, T5, T6 (`auth-api`)
- [x] T8 — `authService`: verifyEmail (valida token, marca `emailVerifiedAt`, marca token usado),
  depende de T4, T5 (`auth-api`)
- [x] T9 — `authService`: login (valida credencial, valida `emailVerifiedAt`, emite JWT), depende
  de T3, T5 (`auth-api`)
- [x] T10 — `authService`: forgotPassword + resetPassword (gera/valida token, atualiza senha),
  depende de T3, T4, T5, T6 (`auth-api`)
- [x] T11 — Atualizar `processoService`/`andamentoService`/`processoRepository`/
  `andamentoRepository` para exigir e aplicar `userId` em toda operação; verificação de posse
  retorna 404 se não for do dono, depende de T2 (`express-module-dev`, `auth-api`)

## Routes/middleware
- [x] T12 — `middlewares/requireAuth.js` (lê `Authorization: Bearer`, verifica JWT, popula
  `req.user`, 401 se inválido/ausente/expirado), depende de T5 (`auth-api`)
- [x] T13 — `express-rate-limit` nas rotas de signup/login/forgot-password, depende de T14
  (`auth-api`)
- [x] T14 — `routes/authRoutes.js` + `controllers/authController.js` (`/api/auth/signup`,
  `/verify-email`, `/login`, `/forgot-password`, `/reset-password`), montar em `app.js`, depende
  de T7-T10 (`express-module-dev`, `auth-api`)
- [x] T15 — Montar `requireAuth` em `processoRoutes`/`andamentoRoutes`; atualizar
  `processoController`/`andamentoController` para repassar `req.user.id` aos services, depende de
  T11, T12 (`express-module-dev`)
- [x] T16 — Ajustar CORS em `app.js` (`allowedHeaders: ['Content-Type', 'Authorization']`),
  depende de T12 (`deploy-render-vercel-neon`)

## Frontend
- [x] T17 — `context/AuthContext.jsx` (token em memória, user, login/signup/logout);
  `setAuthToken`/handler de 401 em `services/api.js`, depende de T14 (`express-module-dev`)
- [x] T18 — `pages/Login.jsx`, `pages/Signup.jsx`, depende de T17 (`express-module-dev`)
- [x] T19 — `pages/VerifyEmail.jsx` (lê `?token=`, chama API, mostra sucesso/erro), depende de T17
  (`express-module-dev`)
- [x] T20 — `pages/ForgotPassword.jsx`, `pages/ResetPassword.jsx` (lê `?token=`), depende de T17
  (`express-module-dev`)
- [x] T21 — `components/RequireAuth.jsx` (guard) envolvendo `/processos`/`/processos/:id` em
  `App.jsx`; botão de logout na tela principal, depende de T17-T20 (`express-module-dev`)

## Testes automatizados
- [x] T22 — Unit tests `authService` (signup, verifyEmail, login, forgotPassword,
  resetPassword — mock de repositórios), depende de T7-T10
- [x] T23 — Atualizar `tests/integration/app.test.js`: mockar `requireAuth` como pass-through
  (`req.user = { id: 1 }`), depende de T15
- [x] T24 — Testes de integração das novas rotas `/api/auth/*` (supertest, service mockado),
  depende de T14
- [x] T25 — Atualizar `processoService.test.js`/`andamentoService.test.js` para o novo parâmetro
  `userId`, depende de T11

## Verificação dos critérios de aceite da spec
- [ ] T26 — Validar item a item a seção 5 de `spec.md`: signup → e-mail recebido → confirmação →
  login bloqueado antes de confirmar → login funciona depois → mensagem genérica de erro →
  reset de senha ponta a ponta → isolamento de dado entre duas contas → guard de rota → logout →
  senha nunca exposta — incluindo o caso de cold start do Render no primeiro acesso do dia
