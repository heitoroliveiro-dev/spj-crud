# Playbook — Deploy (Neon + Render + Vercel)

Processo real, já executado uma vez para colocar o SPJ em produção gratuitamente. Ver
`.claude/docs/architecture/adr/ADR-0001-hospedagem-render-vercel-neon.md` para o porquê.

## Visão geral

| Componente | Provedor | Free tier | URL |
|---|---|---|---|
| Banco (Postgres) | Neon | 0.5GB, sem expiração | (connection string privada) |
| Backend (Express, Docker) | Render | Web Service free, dorme após 15min de inatividade | https://spj-crud-backend.onrender.com |
| Frontend (React/Vite) | Vercel | Hobby, projetos ilimitados | https://spj-crud.vercel.app |

Deploy automático: push em `main` no GitHub → Render e Vercel redeployam sozinhos.

## Passo a passo (do zero)

### 1. Neon (banco)
1. Login em https://console.neon.tech (GitHub OAuth).
2. Criar projeto (nome livre, região mais próxima do backend — usamos `AWS US East 2 (Ohio)`).
3. Copiar a connection string (revelar a senha primeiro — botão "Show password").

### 2. Render (backend)
1. https://dashboard.render.com/select-repo?type=web → conectar repositório GitHub
   (`heitoroliveiro-dev/spj-crud`).
2. **Root Directory**: `backend`. Linguagem detectada automaticamente como `Docker`
   (usa `backend/Dockerfile`).
3. **Instance Type**: `Free` (o plano "Starter" pago vem pré-selecionado — trocar manualmente).
4. **Environment Variables** (usar "Add from .env" para colar várias de uma vez):
   ```
   DATABASE_URL=<connection string da Neon>
   NODE_ENV=production
   FRONTEND_URL=<URL da Vercel, preencher depois do passo 3 — usar um placeholder por ora>
   ```
   A partir da feature `001`, adicionar também: `JWT_SECRET`, `BREVO_API_KEY`, `EMAIL_FROM`.
5. Deploy. O `CMD` do `backend/Dockerfile` já roda
   `npx prisma generate && npx prisma migrate deploy && npm start` — migrations aplicadas
   automaticamente, sem passo manual.
6. Anotar a URL gerada (`https://<nome-do-serviço>.onrender.com`).

### 3. Vercel (frontend)
1. https://vercel.com/new → importar o mesmo repositório GitHub.
2. **Atenção**: a Vercel detecta o monorepo e por padrão tenta usar o preset "Services" (subiria
   frontend E backend juntos, quebrando o build). **Trocar manualmente**: Application Preset →
   `Vite`, e clicar em "Edit" no Root Directory → selecionar `frontend`.
3. **Environment Variables**: `VITE_API_BASE=<URL do Render do passo 2>` (build-time — Vite
   embute isso no bundle estático; mudar esse valor exige um novo deploy, não só reiniciar).
4. Deploy. Anotar o domínio de produção real em Project → Settings → Domains (o link do "deploy
   específico" mostrado logo após o deploy, tipo `spj-crud-xxxx.vercel.app`, **não** é o domínio
   estável — o estável é `spj-crud.vercel.app`, sem sufixo).

### 4. Fechar o loop de CORS
1. Voltar no Render → Environment → editar `FRONTEND_URL` para o domínio estável da Vercel
   (`https://spj-crud.vercel.app`, sem o sufixo de deployment).
2. "Save, rebuild and deploy" — o backend só aceita requisições da origem exata configurada aqui
   (`cors({ origin: process.env.FRONTEND_URL })`, comparação de string exata, não wildcard).

## Variáveis de ambiente — referência completa

**Render (backend)**
| Variável | Exemplo | Observação |
|---|---|---|
| `DATABASE_URL` | `postgresql://...neon.tech/neondb?sslmode=require` | da Neon |
| `NODE_ENV` | `production` | |
| `FRONTEND_URL` | `https://spj-crud.vercel.app` | usado no CORS — precisa bater exato |
| `PUBLIC_BACKEND_URL` | `https://spj-crud-backend.onrender.com` | opcional, só para log de boot |
| `JWT_SECRET` | (aleatório, `openssl rand -base64 48`) | feature `001` |
| `BREVO_API_KEY` | (da conta Brevo) | feature `001` |
| `EMAIL_FROM` | `naoresponda@...` | feature `001` |

**Vercel (frontend)**
| Variável | Exemplo | Observação |
|---|---|---|
| `VITE_API_BASE` | `https://spj-crud-backend.onrender.com` | build-time, redeploy necessário se mudar |

## Troubleshooting conhecido

- **Frontend carrega mas fica "Carregando..." infinito**: quase sempre CORS — `FRONTEND_URL` no
  Render não bate exatamente com o domínio real da Vercel (incluindo `https://`, sem barra no
  final).
- **Primeira requisição do dia demora ~50s**: cold start do Render free tier, não é bug.
- **Vercel builda mas serve 404 em tudo**: Root Directory errado (precisa ser `frontend`, não a
  raiz do monorepo).

## Validação pós-deploy
1. `curl https://spj-crud-backend.onrender.com/health` → `{"status":"ok"}`.
2. Abrir o frontend, confirmar que a listagem carrega (não fica presa em "Carregando...").
3. Criar e depois excluir um registro de teste, para confirmar escrita+leitura+exclusão
   funcionando ponta a ponta antes de considerar o deploy validado.
