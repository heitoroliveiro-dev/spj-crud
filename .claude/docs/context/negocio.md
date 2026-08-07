# Contexto de negócio — SPJ

## Por que o SPJ existe
Gestão de processos judiciais e seus andamentos, originalmente construído como teste técnico
(ver `README.md` na raiz para requisitos funcionais/não funcionais completos). Permite cadastrar
processos, registrar andamentos vinculados, editar e excluir com integridade referencial.

## Quem usa
Inicialmente pensado para um usuário/escritório único. A partir da feature `001`, passa a
suportar múltiplos usuários independentes, cada um com sua própria conta e seus próprios
processos/andamentos — sem visibilidade cruzada entre contas.

## Motivação da mudança para multiusuário
Sem autenticação, qualquer pessoa com acesso à URL pública podia criar, editar ou excluir
qualquer processo/andamento, de qualquer "dono" — inviável assim que mais de uma pessoa começa a
usar o sistema. A feature `001-autenticacao-multiusuario` resolve isso: conta própria por
usuário, confirmação de e-mail obrigatória, reset de senha por e-mail, e isolamento total de
dado por conta.
