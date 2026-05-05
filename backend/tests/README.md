# Testes Backend

## Primeira execução

Comando executado:

```bash
npm test
```

Resultado inicial:

- 4 suites executadas.
- 1 suite passou.
- 3 suites falharam.
- 16 testes passaram.
- 4 testes falharam.

## Falhas encontradas

### 1. `dateUtils.test.js`

Os testes de parse usavam as datas `10/05/2026` e `2026-05-10`.

Como a função `parseDataBrasileiraOuIso` possui a regra de limitar datas futuras ao dia atual, e os testes foram executados em `04/05/2026`, a função retornou `04/05/2026`.

Por isso o Jest mostrou:

```text
Expected: 10
Received: 4
```

Solução: usar datas passadas nos testes de parse comum, por exemplo `10/05/2025`.

A data futura deve ficar apenas no teste específico da regra de limite.

### 2. `processoService.test.js`

O teste "cria processo fora de MG" preparava o mock com `uf: 'SP'`, mas chamava o service com `payloadBase`.

O `payloadBase` tinha:

```js
uf: 'MG'
```

Por isso o service retornou:

```text
Processo de MG criado com sucesso
```

Solução: criar um `payloadSP` e chamar o service com ele.

```js
const payloadSP = {
  ...payloadBase,
  uf: 'SP',
};

const result = await processoService.novoProcesso(payloadSP);
```

### 3. `andamentoService.test.js`

O teste de criação usava `10/05/2026`.

Como essa data era futura no momento da execução, `parseDataBrasileiraOuIso` limitou o andamento para `04/05/2026`.

Depois disso, o service comparou:

- data do andamento: `04/05/2026`
- data de abertura do processo: `10/05/2026`

E corretamente lançou:

```text
A data do andamento não pode ser anterior à data de abertura do processo
```

Solução: usar datas passadas e coerentes, por exemplo:

```js
dataAbertura: new Date(2025, 4, 10, 12)
data: '10/05/2025'
```

### 4. Logs do `console.error` em `app.test.js`

A suite `app.test.js` passou.

Os logs aparecem porque o middleware `errorHandler` chama:

```js
console.error(err.stack);
```

Isso é esperado no código de produção, mas deixa a saída dos testes poluída.

Solução: mockar `console.error` durante os testes de integração HTTP.

```js
let consoleErrorSpy;

beforeEach(() => {
  consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  consoleErrorSpy.mockRestore();
});
```

## Aprendizados

- Testes com datas precisam evitar datas futuras acidentais.
- Quando existe regra baseada no dia atual, o teste deve usar datas passadas ou congelar o tempo.
- Mocks precisam combinar com o payload realmente enviado ao service.
- Logs de erro podem ser mockados em testes para deixar a saída mais limpa.
