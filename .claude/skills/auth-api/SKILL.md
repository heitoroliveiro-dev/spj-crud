---
name: auth-api
description: Autenticação multiusuário da API (implementação própria — bcryptjs + JWT Bearer em memória, sem cookie, sem Auth.js/Passport). Use SEMPRE que a tarefa envolver signup, login, verificação de e-mail, reset de senha, sessão, proteção de rota ou escopo de dado por usuário.
---

# Autenticação da API (implementação própria, multiusuário)

## Regra 0 — Fonte da verdade
Decisão registrada em ADR (`.claude/docs/architecture/adr/ADR-0002-autenticacao-jwt-bearer-em-memoria.md`):
JWT Bearer em memória no frontend, não cookie — por causa do backend (Render) e frontend
(Vercel) serem domínios diferentes (cross-site) na época. Desde a spec 002 (ADR-0004) os dois
ficam no mesmo domínio na VPS; a decisão segue válida. Consultar documentação oficial de cada peça
antes de implementar:
- JWT: https://datatracker.ietf.org/doc/html/rfc7519 (spec) + doc de `jsonwebtoken`
- Hashing: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
  (bcrypt é opção aceita, ainda que argon2id seja a recomendação mais recente — decisão
  consciente de usar `bcryptjs`, ver ADR)
- Rate limiting: `express-rate-limit`

## Escopo (v1)

Multiusuário — cada `User` só acessa dado que ele mesmo criou. Isso NÃO é o mesmo modelo do
backoffice de usuário único do projeto irmão: aqui toda query de `Processos`/`Andamento` precisa
ser escopada por `userId`, e o cadastro é aberto (qualquer pessoa pode criar conta).

## Padrões obrigatórios

1. **Hash de senha**: `bcryptjs` (nunca MD5/SHA sem salt, nunca texto puro). Custo (`saltRounds`)
   >= 10.
2. **JWT no header `Authorization: Bearer <token>`** — nunca em cookie (evita CSRF e problema de
   cookie de terceiro cross-site), nunca em `localStorage` (guardar em memória/estado React,
   `AuthContext`).
3. **Expiração do JWT**: 12h. Sem refresh token nesta v1 (dívida técnica documentada) — expirar
   força novo login, sem crash silencioso: middleware `requireAuth` retorna 401 explícito.
4. **Token de verificação de e-mail e de reset de senha**: gerado com `crypto.randomBytes(32)`,
   **hasheado (SHA-256) antes de salvar no banco**, nunca guardado em texto puro. Expira (ex.:
   24h) e é de uso único (`usedAt` marcado ao consumir).
5. **Rate limiting** (`express-rate-limit`) nas rotas `/api/auth/login`,
   `/api/auth/signup`, `/api/auth/forgot-password` — protege contra força bruta E contra estourar
   a cota diária do provedor de e-mail.
6. **Nunca vazar se o e-mail existe ou não** em mensagens de erro de login nem de
   forgot-password (mesma resposta de sucesso genérica mesmo se o e-mail não existir, para não
   permitir enumeração de contas).
7. **Middleware único (`middlewares/requireAuth.js`)** protegendo toda rota de dado de usuário —
   não replicar checagem de auth em cada controller.
8. **Escopo por usuário em toda query**: repository recebe `userId` explícito em todo método de
   leitura/escrita; verificação de posse ("esse processo é mesmo do usuário logado?") acontece na
   camada de `service`, retornando 404 (não 403) se não for do dono — não revela que o recurso
   existe para outra conta.

## Checklist de conclusão (Definition of Done)
- [ ] Senha hasheada com bcryptjs, nunca texto puro nos logs
- [ ] JWT no header Authorization, nunca em cookie/localStorage
- [ ] Expiração do JWT configurada e testada (token expirado retorna 401)
- [ ] Token de verificação/reset gerado aleatório, hasheado no banco, expira e é de uso único
- [ ] Rate limiting testado nas rotas de signup/login/forgot-password
- [ ] Mensagem de erro de login/forgot-password não distingue "usuário não existe" de "senha errada"/"e-mail não existe"
- [ ] Toda rota de `Processos`/`Andamento` protegida por `requireAuth` e escopada por `req.user.id`
- [ ] Tentativa de acessar recurso de outro usuário retorna 404, não 403

## Anti-padrões (rejeitar em code review)
- JWT em cookie ou localStorage
- Senha ou token de verificação/reset em texto puro em qualquer lugar (código, log, banco)
- Query de `Processos`/`Andamento` sem filtro de `userId`
- `userId` aceito vindo do corpo da requisição em vez de `req.user.id` do JWT verificado
- Checagem de autenticação duplicada e inconsistente por rota
- Segredo de JWT (`JWT_SECRET`) hardcoded no código
