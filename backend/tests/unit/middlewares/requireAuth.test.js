// Objetivo: testar o middleware isoladamente, sem subir o app inteiro.

const requireAuth = require('../../../src/middlewares/requireAuth');
const jwt = require('../../../src/utils/jwt');

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('requireAuth', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'segredo-de-teste';
  });

  test('retorna 401 quando não há header Authorization', () => {
    const req = { headers: {} };
    const res = mockRes();
    const next = jest.fn();

    requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('retorna 401 quando o token é inválido', () => {
    const req = { headers: { authorization: 'Bearer token-invalido' } };
    const res = mockRes();
    const next = jest.fn();

    requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('popula req.user e chama next() quando o token é válido', () => {
    const token = jwt.assinar({ id: 42, email: 'a@a.com' });
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = mockRes();
    const next = jest.fn();

    requireAuth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual({ id: 42, email: 'a@a.com' });
  });
});
