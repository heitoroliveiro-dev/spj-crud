const { report } = require('node:process');
const processoRepository = require('../repositories/processoRepository');
const { parseDataBrasileiraOuIso } = require('../utils/dateUtils');

/* Padroniza o UF com letras maiúsculas */
function normalizaUf(uf) {
    return String(uf || '').trim().toUpperCase();
}

/* Se UF for MG, dentro do estado, se não, fora */
function mensagemCriacaoPorUf(uf) {
    return uf === 'MG'
        ? 'Processo de MG criado com sucesso' 
        : 'Processo fora de MG criado com sucesso';
}

function mensagemProcessoDuplicado() {
    return 'Este processo já está cadastrado. Utilize a barra de pesquisa ou tente cadastrar outro processo';
}

function reportaErro(message, status) {
    const error = new Error(message);
    error.status = status;
    throw error;
}

/* Percorre campos obrigatórios e retorna 400 */
function validarCamposObrigatorios(payload) {
    const campos = [
        'numeroProcesso',
        'dataAbertura',
        'descricao',
        'cliente',
        'advogado',
        'uf',
    ];
    
    for (const campo of campos) {
        if (!payload[campo]) {
            throw reportaErro(`Campo obrigatório ausente: ${campo}`, 400);
        }
    }
}

const processoService = {

    /* LISTAR PROCESSOS do usuário logado */
    async listar(userId) {
        return processoRepository.findAll(userId);
    },

    /* DETALHAR PROCESSO POR ID — só se for do usuário logado */
    async buscarPorId(id, userId) {
        const processo = await processoRepository.findById(Number(id));

        if(!processo || processo.userId !== userId) {
            throw reportaErro('Processo não encontrado', 404)
        }

        return processo;
    },

    /* CRIAR NOVO PROCESSO */
    async novoProcesso(payload, userId) {
        validarCamposObrigatorios(payload);

        const uf = normalizaUf(payload.uf);
        const processoExistente = await processoRepository.findByNumeroProcesso(payload.numeroProcesso, userId);

        if (processoExistente) {
            throw reportaErro(mensagemProcessoDuplicado(), 409);
        }

        const processo = await processoRepository.create({
            ...payload,
            uf,
            userId,
            dataAbertura: parseDataBrasileiraOuIso(payload.dataAbertura, 'Data de abertura')
        });

        return {
            data: processo,
            message: mensagemCriacaoPorUf(uf), /* após criar novoProcesso, mensagem aparece baseado no parametro uf definido em normalizaUf(payload.uf) */
        };
    },

    /* ATUALIZAR PROCESSO */
    async atualizarProcesso (id, payload, userId) {
        await this.buscarPorId(id, userId);

        validarCamposObrigatorios(payload);

        const uf = normalizaUf(payload.uf);
        const processoComMesmoNumero = await processoRepository.findByNumeroProcesso(payload.numeroProcesso, userId);

        if (processoComMesmoNumero && processoComMesmoNumero.id !== Number(id)) {
            throw reportaErro(mensagemProcessoDuplicado(), 409);
        }

        return processoRepository.update(Number(id),{
            ...payload,
            uf,
            dataAbertura: parseDataBrasileiraOuIso(payload.dataAbertura, 'Data de abertura'),
        });
    },

    /* REMOVER PROCESSO */
    async removerProcesso (id, userId) {
        await this.buscarPorId(id, userId);
        return processoRepository.delete(Number(id));
    },
};

module.exports = processoService;

/* 
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
 */
