const andamentoRepository = require('../repositories/andamentoRepository');
const processoRepository = require('../repositories/processoRepository');

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

/* Refatorar validação de data */
function validarData(data) {
    const dataConvertida = new Date(data);

    if(Number.isNaN(dataConvertida.getTime())) {
        throw reportaErro('Data do andamento inválida', 400);
    }
    return dataConvertida;
}

const andamentoService = {
    /* Criar */
    async criar(processoId, payload) {
        const processosId = validarId(processoId, 'ID do processo');

        validarCamposObrigatorios(payload);

        const processo = await processoRepository.findById(processosId);

        if(!processo) {
            throw reportaErro('Processo não encontrado', 404);
        }

        const andamento = await andamentoRepository.create({
            data: validarData(payload.data),
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

        const andamento = await andamentoRepository.update(andamentoId, {
            data: validarData(payload.data),
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
