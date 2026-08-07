// Objetivo: testar se a camada HTTP de /api/auth chama o authService e retorna status correto.

const request = require('supertest');
const app = require('../../src/app');
const authService = require('../../src/services/authService');

jest.mock('../../src/services/authService');
jest.mock('../../src/services/processoService');
jest.mock('../../src/services/andamentoService');

describe('rotas /api/auth', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  test('POST /api/auth/signup chama authService e retorna 201', async () => {
    authService.signup.mockResolvedValue({ message: 'Cadastro realizado.' });

    const response = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'a@a.com', senha: '12345678' });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Cadastro realizado.');
  });

  test('POST /api/auth/verify-email chama authService e retorna 200', async () => {
    authService.verifyEmail.mockResolvedValue({ message: 'E-mail confirmado com sucesso.' });

    const response = await request(app)
      .post('/api/auth/verify-email')
      .send({ token: 'token-valido' });

    expect(response.status).toBe(200);
    expect(authService.verifyEmail).toHaveBeenCalledWith('token-valido');
  });

  test('POST /api/auth/login retorna 401 quando credencial é inválida', async () => {
    const error = new Error('E-mail ou senha inválidos');
    error.status = 401;
    authService.login.mockRejectedValue(error);

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'a@a.com', senha: 'errada' });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'E-mail ou senha inválidos' });
  });

  test('POST /api/auth/login retorna token quando credencial é válida', async () => {
    authService.login.mockResolvedValue({ token: 'jwt-fake', user: { id: 1, email: 'a@a.com' } });

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'a@a.com', senha: '12345678' });

    expect(response.status).toBe(200);
    expect(response.body.token).toBe('jwt-fake');
  });

  test('POST /api/auth/forgot-password sempre retorna 200 com mensagem genérica', async () => {
    authService.forgotPassword.mockResolvedValue({
      message: 'Se este e-mail estiver cadastrado, enviamos um link de redefinição de senha.',
    });

    const response = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'qualquer@a.com' });

    expect(response.status).toBe(200);
  });

  test('POST /api/auth/reset-password chama authService e retorna 200', async () => {
    authService.resetPassword.mockResolvedValue({ message: 'Senha redefinida com sucesso.' });

    const response = await request(app)
      .post('/api/auth/reset-password')
      .send({ token: 'token-valido', novaSenha: '12345678' });

    expect(response.status).toBe(200);
  });

  test('GET /api/processos sem token retorna 401 (rota protegida por requireAuth real)', async () => {
    const response = await request(app).get('/api/processos');

    expect(response.status).toBe(401);
  });
});
