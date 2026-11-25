# Segurança — SPJ

## Senha
- Hash com `bcryptjs` (`saltRounds >= 10`), nunca texto puro em nenhum lugar (tela, log, banco,
  resposta de rede).
- Sem limite de complexidade arbitrário no cadastro (não impor regra tipo "1 maiúscula + 1
  símbolo" sem justificativa — comprimento mínimo razoável, ex. 8 caracteres, é suficiente e
  menos hostil ao usuário, alinhado com a orientação atual da OWASP/NIST).

## Tokens
- **JWT de sessão**: assinado com `JWT_SECRET` (env var, nunca hardcoded), expiração 12h, no
  header `Authorization: Bearer` — nunca em cookie ou `localStorage`.
- **Token de verificação de e-mail / reset de senha**: `crypto.randomBytes(32)`, hasheado
  (SHA-256) antes de salvar no banco, expira (24h) e é de uso único (`usedAt`).

## Rate limiting
`express-rate-limit` em `/api/auth/signup`, `/api/auth/login`, `/api/auth/forgot-password` —
protege contra força bruta e contra estourar a cota diária do provedor de e-mail (Brevo).

## Enumeração de conta
Login e forgot-password nunca revelam se um e-mail existe ou não — mesma resposta genérica em
ambos os casos (credencial errada / e-mail inexistente).

## Segredos
Nunca em código ou commit. Em produção, `/opt/spj-crud/.env` na VPS (`chmod 600`, gerado lá:
`JWT_SECRET`, `POSTGRES_PASSWORD`, `DEMO_EMAIL`, `DEMO_PASSWORD`). `VITE_API_BASE` e `VITE_DEMO_*`
vão para o bundle e são públicos por natureza — a senha da demonstração é pública de propósito.
Sem `BREVO_API_KEY` na demonstração (spec 002).

## Logs
Nunca logar senha, token (JWT ou de verificação/reset) em texto puro.
