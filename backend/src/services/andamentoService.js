const andamentoRepository = require('../repositories/andamentoRepository');
const processoRepository = require('../repositories/processoRepository');
const { dataMenorQue, parseDataBrasileiraOuIso } = require('../utils/dateUtils');

function reportaErro(message, status = 400) {
    const error = new Error(message);
    error.status = status;
    throw error;
}

function validarId(id, nome = 'ID') {
    const parsedId = Number(id);

    if(!Number.isInteger(parsedId) || parsedId <= 0){
        throw reportaErro(`${nome} inválido`, 400);
    }

    return parsedId;
}

function validarCamposObrigatorios(payload) {
    if (!payload.data) {
        throw reportaErro('Campo obrigatório ausente: data', 400);
    }

    if (!payload.descricao) {
        throw reportaErro('Campo obrigatório ausente: descricao', 400);
    }
}

function validarDataAndamento(dataAndamento, processo) {
    if (dataMenorQue(dataAndamento, processo.dataAbertura)) {
        throw reportaErro('A data do andamento não pode ser anterior à data de abertura do processo', 400);
    }
}

const andamentoService = {

    /* buscar andamento por andamentoId */
    async buscarAndamentoPorId(andamentoId){
        const andamentoIdValidado = validarId(andamentoId, 'ID do andamento')

        const andamento = await andamentoRepository.findById(andamentoIdValidado);

        if(!andamento) {
            throw reportaErro('Andamento não encontrado', 404)
        }

        return andamento;
    },

    /* buscar andamento por processoId */
    async buscaAndamentoPorProcesso(processoId) {
        const processosId = validarId(processoId, 'ID do processo');
        
        const processo = await processoRepository.findById(processosId);

        if(!processo) {
            throw reportaErro('Processo não encontrado', 404)
        }
        
        return andamentoRepository.findByProcessoId(processosId);
    },

    /* Criar */
    async criar(processoId, payload) {
        const processosId = validarId(processoId, 'ID do processo');

        validarCamposObrigatorios(payload);

        const processo = await processoRepository.findById(processosId);

        if(!processo) {
            throw reportaErro('Processo não encontrado', 404);
        }

        const dataAndamento = parseDataBrasileiraOuIso(payload.data, 'Data do andamento');
        validarDataAndamento(dataAndamento, processo);

        const andamento = await andamentoRepository.create({
            data: dataAndamento,
            descricao: payload.descricao,
            processosId,
        });

        return {
            data: andamento,
            message: 'Andamento criado com sucesso',
        };
    },

    /* Atualizar */
    async atualizar(id, payload) {
        const andamentoId = validarId(id, 'ID do andamento');

        validarCamposObrigatorios(payload);

        const andamentoExistente = await andamentoRepository.findById(andamentoId);

        if(!andamentoExistente) {
            throw reportaErro('Andamento não encontrado', 404);
        }

        const processo = await processoRepository.findById(andamentoExistente.processosId);
        const dataAndamento = parseDataBrasileiraOuIso(payload.data, 'Data do andamento');
        validarDataAndamento(dataAndamento, processo);

        const andamento = await andamentoRepository.update(andamentoId, {
            data: dataAndamento,
            descricao: payload.descricao,
        });

        return {
            data: andamento,
            message: 'Andamento atualizado com sucesso',
        };
    },

    /* Remover */
    async remover(id) {
        const andamentoId = validarId(id, 'ID do andamento');

        const andamentoExistente = await andamentoRepository.findById(andamentoId);

        if (!andamentoExistente) {
            throw reportaErro('Andamento não encontrado', 404);
        }

        await andamentoRepository.delete(andamentoId);

        return {
            message: 'Andamento excluído com sucesso',
        };
    },

};

module.exports = andamentoService;
