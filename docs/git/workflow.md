# GitFlow simplificado

Trabalho realizado com apenas 4 tipos de branch:

| branch | proposito |
|-|-|
|main|código em produção|
|develop|integração de features (base de novas branches)|
|feature/nome|funcionalidades isoladas|
|hotfix/nome|correcao urgente em producao|


### Convenção de commits

Prefixos padrões para histórico legível

|prefixo|quando usar|
|-|-|
|feat|nova funcionalidade|
|fix|correcao de bug|
|chore|tarefas de infra|
|docs|documentacao|
|refactor|refatora sem mudar comportamento|
|style|formatacao sem mudar logica|
|test|adiciona ou corrição de testes|

### workflow de desenvolvimento
```
# criar branch sempre a partir da develop
git checkout develop
git pull origin develop 
git checkout -b feature/nome-da-branch

# desenvolver e commitar
git add .
git commit -m "feat: descricao clara do que foi feito"

# finalizando, merge de volta pra develop
git checkout develop
git merge feature/nome-da-branch
git push origin develop

# deleta branch local (opcional)
git branch -d feature/nome-da-branch
```