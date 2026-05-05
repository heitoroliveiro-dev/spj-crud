// Objetivo: testar validações de ID, existência do processo e regra de data antes de salvar.

const andamentoService = require('../../../src/services/andamentoService');
const andamentoRepository = require('../../../src/repositories/andamentoRepository');
const processoRepository = require('../../../src/repositories/processoRepository');

jest.mock('../../../src/repositories/andamentoRepository');
jest.mock('../../../src/repositories/processoRepository');

describe('andamentoService', () => {
  test('lança erro 400 para ID inválido', async () => {
    await expect(
      andamentoService.buscarAndamentoPorId('abc')
    ).rejects.toMatchObject({
      message: 'ID do andamento inválido',
      status: 400,
    });
  });

  test('lança erro 404 quando processo não existe', async () => {
    processoRepository.findById.mockResolvedValue(null);

    await expect(
      andamentoService.criar(1, {
        data: '10/05/2025',
        descricao: 'Petição inicial',
      })
    ).rejects.toMatchObject({
      message: 'Processo não encontrado',
      status: 404,
    });
  });

  test('lança erro 400 quando data do andamento é anterior à abertura', async () => {
    processoRepository.findById.mockResolvedValue({
      id: 1,
      dataAbertura: new Date(2025, 4, 10, 12),
    });

    await expect(
      andamentoService.criar(1, {
        data: '09/05/2025',
        descricao: 'Andamento inválido',
      })
    ).rejects.toMatchObject({
      message: 'A data do andamento não pode ser anterior à data de abertura do processo',
      status: 400,
    });
  });

  test('cria andamento com sucesso', async () => {
    processoRepository.findById.mockResolvedValue({
      id: 1,
      dataAbertura: new Date(2025, 4, 10, 12),
    });

    andamentoRepository.create.mockResolvedValue({
      id: 1,
      processosId: 1,
      descricao: 'Audiência marcada',
    });

    const result = await andamentoService.criar(1, {
      data: '10/05/2025',
      descricao: 'Audiência marcada',
    });

    expect(result.message).toBe('Andamento criado com sucesso');
    expect(andamentoRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        descricao: 'Audiência marcada',
        processosId: 1,
      })
    );
  });
});
