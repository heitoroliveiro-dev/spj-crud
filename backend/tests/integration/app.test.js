// Objetivo: aqui não testa Prisma nem regra interna. 
// Testa se a camada HTTP chama o service, retorna status correto e usa o errorHandler.

const request = require('supertest');

jest.mock('../../src/middlewares/requireAuth', () => (req, res, next) => {
  req.user = { id: 1, email: 'usuario@teste.com' };
  next();
});

const app = require('../../src/app');
const processoService = require('../../src/services/processoService');

jest.mock('../../src/services/processoService');
jest.mock('../../src/services/andamentoService');

describe('app routes', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  test('GET /health retorna status ok', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  test('GET / retorna dados da API', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('SPJ API');
    expect(response.body.status).toBe('online');
  });

  test('GET /api/processos retorna lista de processos', async () => {
    processoService.listar.mockResolvedValue([{ id: 1, numeroProcesso: '0001' }]);

    const response = await request(app).get('/api/processos');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1, numeroProcesso: '0001' }]);
  });

  test('POST /api/processos cria processo', async () => {
    processoService.novoProcesso.mockResolvedValue({
      data: { id: 1, numeroProcesso: '0001' },
      message: 'Processo de MG criado com sucesso',
    });

    const response = await request(app)
      .post('/api/processos')
      .send({ numeroProcesso: '0001' });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Processo de MG criado com sucesso');
  });

  test.each([
    [400, 'Campo obrigatório ausente: cliente'],
    [404, 'Processo não encontrado'],
    [409, 'Este processo já está cadastrado'],
  ])('propaga erro %s pelo errorHandler', async (status, message) => {
    const error = new Error(message);
    error.status = status;

    processoService.novoProcesso.mockRejectedValue(error);

    const response = await request(app)
      .post('/api/processos')
      .send({});

    expect(response.status).toBe(status);
    expect(response.body).toEqual({ error: message });
  });
});
