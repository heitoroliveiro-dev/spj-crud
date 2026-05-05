// Objetivo: testar regra de negócio sem banco. 
// O repository é falso, então é possível controlar o cenário.

const processoRepository = require('../../../src/repositories/processoRepository');
const processoService = require('../../../src/services/processoService');

jest.mock('../../../src/repositories/processoRepository');

const payloadBase = {
    numeroProcesso: '0001',
    dataAbertura: '10/05/2026',
    descricao: 'Processo teste',
    cliente: 'Maria',
    advogado: 'Dr. João',
    uf: 'MG',
}

describe('processoService', () => {
    test('cria processo com UF MG e retorna mensagem específica', async () => {
        processoRepository.findByNumeroProcesso.mockResolvedValue(null);
        processoRepository.create.mockResolvedValue({ id: 1, ...payloadBase, uf: 'MG' });

        const result = await processoService.novoProcesso(payloadBase);

        expect(result.message).toBe('Processo de MG criado com sucesso');
        expect(processoRepository.create).toHaveBeenCalledWith(
            expect.objectContaining({ uf: 'MG' })
        );
    });

    test('cria processo fora de MG e retorna mensagem padrão', async () => {
        const payloadSP = {
            ...payloadBase,
            uf: 'SP',
        };

        processoRepository.findByNumeroProcesso.mockResolvedValue(null);
        processoRepository.create.mockResolvedValue({ id: 1, ...payloadSP });

        const result = await processoService.novoProcesso(payloadSP);

        expect(result.message).toBe('Processo fora de MG criado com sucesso');
        expect(processoRepository.create).toHaveBeenCalledWith(
            expect.objectContaining({ uf: 'SP' })
        );
    });

    test('lança erro 400 quando campo obrigatório está ausente', async () => {
        await expect(processoService.novoProcesso({ ...payloadBase, cliente: '' })
            ).rejects.toMatchObject({
                message: 'Campo obrigatório ausente: cliente',
                status: 400,
        });
    });

    test('lança erro 409 quando processo já existe', async () => {
        processoRepository.findByNumeroProcesso.mockResolvedValue({ id: 99 });
        
        await expect(
            processoService.novoProcesso(payloadBase)
        ).rejects.toMatchObject({
            status: 409,
        });
    });

    test('lança erro 404 ao buscar processo inexistente', async () => {
        processoRepository.findById.mockResolvedValue(null);

        await expect(processoService.buscarPorId(999)).rejects.toMatchObject({
            message: 'Processo não encontrado',
            status: 404,
        });
    });
});
