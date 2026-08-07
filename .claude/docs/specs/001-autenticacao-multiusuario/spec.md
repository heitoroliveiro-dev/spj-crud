# SPEC — Autenticação multiusuário

- **Pasta**: `001-autenticacao-multiusuario/`
- **Status**: aprovada
- **Autor**: Heitor Oliveiro (com apoio de Claude) · **Data**: 2026-08-06 · **ADRs relacionadas**: ADR-0002 (JWT Bearer em memória), ADR-0003 (provedor de e-mail Brevo)

Esta é a **fase 1 (o quê e por quê)** do fluxo SDD. Sem detalhe técnico — isso vai em `plan.md`.

## 1. Contexto

O SPJ está no ar (Render + Vercel + Neon) sem nenhuma autenticação — qualquer pessoa com a URL do
frontend pode criar, editar ou excluir processos e andamentos de qualquer outra pessoa. Assim que
mais de uma pessoa usa o sistema, isso vira bagunça: dado de um usuário pode ser apagado ou
alterado por outro sem querer.

Esta spec cobre a fundação completa de autenticação multiusuário: cadastro com confirmação de
e-mail obrigatória, login, reset de senha por e-mail, e isolamento de dado por usuário em
Processos e Andamentos.

## 2. Restrições

- Autenticação própria (hash de senha + JWT), não uma biblioteca pronta como Passport/Auth.js —
  decisão registrada em ADR-0002, motivada pela topologia cross-origin (frontend na Vercel,
  backend no Render, domínios diferentes).
- Sem serviço de e-mail transacional configurado ainda no projeto — provisionar é dependência
  desta spec (Brevo, ver ADR-0003), não pode ser adiado.
- Todo formulário de auth precisa validar no backend, não só no frontend.
- Senha nunca em texto puro em nenhum lugar (tela, log, banco, resposta de rede).
- Sem múltiplos papéis/permissões dentro de uma conta — é só "dono do dado ou não".

## 3. Alternativas avaliadas

| Necessidade | Alternativa | Esforço | Decisão |
|---|---|---|---|
| Autenticação | Passport/Auth.js vs. implementação própria (hash + JWT) | — | Implementação própria — ADR-0002, motivada pela topologia cross-origin, não custo de biblioteca |
| Transporte de sessão | Cookie httpOnly cross-site vs. JWT Bearer em memória vs. híbrido access+refresh | — | JWT Bearer em memória — ADR-0002 |
| E-mail transacional | Resend vs. Brevo vs. SMTP próprio | — | Brevo — ADR-0003 (SMTP é inviável no Render free tier) |

## 4. Comportamento esperado (visão do usuário)

- Existe uma tela de cadastro onde qualquer pessoa cria conta com e-mail e senha.
- Depois de se cadastrar, a pessoa recebe um e-mail com um link de confirmação — **não consegue
  entrar no sistema até clicar nesse link**.
- Clicar no link leva a uma tela confirmando que o e-mail foi validado, com um caminho claro para
  ir até o login.
- Com e-mail confirmado, a pessoa entra com e-mail e senha e vê a tela de processos normalmente.
- Se tentar entrar sem ter confirmado o e-mail, vê uma mensagem clara explicando que precisa
  confirmar o e-mail primeiro (não uma mensagem genérica de erro).
- Se errar e-mail ou senha, a mensagem é a mesma nos dois casos — não dá pra saber se o e-mail
  existe ou não.
- Existe uma tela "esqueci minha senha": a pessoa informa o e-mail, recebe um link por e-mail, e
  a partir dele define uma senha nova.
- Tentar acessar a lista de processos sem estar logado redireciona para a tela de login.
- Depois de logada, a pessoa só vê, cria, edita e exclui os processos e andamentos que ela mesma
  criou — nunca os de outra conta, mesmo tentando acessar diretamente pela URL.
- Existe uma forma de sair (logout), acessível da tela principal.

## 5. Critérios de aceite

- [ ] Uma pessoa sem conta consegue se cadastrar informando e-mail e senha.
- [ ] Depois do cadastro, ela recebe um e-mail com link de confirmação e não consegue entrar
      antes de clicar nele.
- [ ] Clicar no link confirma o e-mail e mostra uma tela de sucesso.
- [ ] Com e-mail confirmado, login funciona com e-mail e senha corretos.
- [ ] Sem confirmar o e-mail, tentar entrar mostra mensagem específica pedindo confirmação (não
      uma mensagem genérica de erro).
- [ ] E-mail ou senha incorretos mostram a mesma mensagem genérica de erro (não revela se o
      e-mail existe).
- [ ] É possível pedir redefinição de senha por e-mail e definir uma senha nova a partir do link
      recebido.
- [ ] Depois de logada, uma pessoa só vê/edita/exclui os processos e andamentos que ela mesma
      criou — testável criando duas contas e confirmando que uma não vê os dados da outra, nem
      acessando a URL de detalhe diretamente.
- [ ] Acessar a lista de processos sem estar logado redireciona para a tela de login.
- [ ] Existe um botão de logout que funciona imediatamente.
- [ ] A senha nunca aparece em texto puro em nenhum lugar visível (tela, log, resposta de rede).

## 6. Fora de escopo

- Múltiplos papéis/permissões dentro de uma conta (ex.: conta compartilhada com convidados).
- "Lembrar de mim" persistente entre sessões além da expiração padrão do token.
- Exclusão de conta pelo próprio usuário.
- Login social (Google/GitHub etc.).
- Migração de dado pré-existente para um dono — não se aplica: a base de produção está vazia
  (confirmado antes desta spec).

---
Próximo passo depois de `Status: aprovada` → `/plan` gera `plan.md` nesta mesma pasta.
